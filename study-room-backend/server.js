import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import apiRoutes from './src/routes/api.js';
import User from './src/models/User.js';
import Room from './src/models/Room.js';
import Activity from './src/models/Activity.js';

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.get('/', (req, res) => {
  res.json({ message: 'Study Room API', version: '1.0.0' });
});

// Create HTTP server
const server = createServer(app);

// Socket.IO with proper configuration
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
});

// Store connected users with their real names
const connectedUsers = new Map();
const roomParticipants = new Map();
const activeSessions = new Map();

// Global timer broadcast interval
let globalTimerInterval = null;

// Helper function to check if room is active
const isRoomActive = async (roomId) => {
  try {
    const room = await Room.findOne({ _id: roomId, status: 'active' });
    return !!room;
  } catch (error) {
    console.error('Error checking room status:', error);
    return false;
  }
};

// Helper function to save activity
const saveActivity = async (userId, roomId, action, details = {}) => {
  try {
    const user = await User.findById(userId);
    await Activity.create({
      user: userId,
      userName: user?.name || 'Unknown',
      room: roomId,
      action: action,
      details: details,
      ip: 'socket',
      userAgent: 'websocket'
    });
  } catch (error) {
    console.error('Error saving activity:', error);
  }
};

// Start global timer broadcast
const startGlobalTimerBroadcast = () => {
  if (globalTimerInterval) clearInterval(globalTimerInterval);
  
  globalTimerInterval = setInterval(() => {
    // Only broadcast if there are active sessions
    if (activeSessions.size === 0) return;
    
    for (const [roomId, session] of activeSessions.entries()) {
      const elapsedSeconds = Math.floor((Date.now() - session.startTime) / 1000);
      
      // Broadcast to EVERYONE in the room
      io.to(roomId).emit('timer_sync', {
        elapsedSeconds: elapsedSeconds,
        syncedBy: 'system',
        timestamp: Date.now()
      });
    }
  }, 1000); // Every 1 second
};
// Socket.IO authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return next(new Error('User not found'));
    }
    
    socket.userId = user._id.toString();
    socket.userName = user.name;
    socket.userEmail = user.email;
    
    next();
  } catch (error) {
    console.error('Socket auth error:', error.message);
    next(new Error('Invalid token'));
  }
});

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log(`🔌 User ${socket.userName} (${socket.userId}) connected`);
  
  connectedUsers.set(socket.id, {
    socketId: socket.id,
    userId: socket.userId,
    userName: socket.userName,
    userEmail: socket.userEmail
  });

  // Join room event
  socket.on('join_room', async ({ roomId }) => {
    try {
      console.log(`${socket.userName} joining room: ${roomId}`);
      
      // Check if room is active
      const room = await Room.findOne({ _id: roomId, status: 'active' });
      
      if (!room) {
        socket.emit('error', { message: 'Room is no longer active' });
        return;
      }
      
      // Leave all previous rooms
      const previousRooms = Array.from(socket.rooms);
      previousRooms.forEach(room => {
        if (room !== socket.id) {
          socket.leave(room);
        }
      });
      
      // Join new room
      socket.join(roomId);
      
      // Track participant
      if (!roomParticipants.has(roomId)) {
        roomParticipants.set(roomId, new Map());
      }
      const participants = roomParticipants.get(roomId);
      participants.set(socket.userId, {
        userId: socket.userId,
        userName: socket.userName,
        socketId: socket.id,
        joinedAt: new Date()
      });
      
      // Get all participants list
      const allParticipants = Array.from(participants.values());
      
      // Notify others
      socket.to(roomId).emit('user_joined', {
        userId: socket.userId,
        userName: socket.userName,
        timestamp: new Date()
      });
      
      // Send updated participant list to everyone
      io.to(roomId).emit('participants_update', {
        participants: allParticipants,
        totalCount: allParticipants.length
      });
      
      // CHECK IF THERE'S AN ACTIVE SESSION
      if (activeSessions.has(roomId)) {
        const activeSession = activeSessions.get(roomId);
        const elapsedSeconds = Math.floor((Date.now() - activeSession.startTime) / 1000);
        
        console.log(`Sending current timer state to ${socket.userName}: ${elapsedSeconds} seconds`);
        
        // Send timer sync to the new joiner only
        socket.emit('timer_sync', {
          elapsedSeconds: elapsedSeconds,
          syncedBy: 'system',
          timestamp: Date.now()
        });
        
        // Also emit session_active to let them know session is running
        socket.emit('session_active', {
          sessionId: activeSession.sessionId,
          startTime: activeSession.startTime,
          elapsedSeconds: elapsedSeconds
        });
      }
      
      // Send success response
      socket.emit('room_joined', {
        success: true,
        roomId,
        participants: allParticipants
      });
      
      console.log(`Total participants in room ${roomId}: ${allParticipants.length}`);
      
    } catch (error) {
      console.error('Join room error:', error);
      socket.emit('error', { message: error.message });
    }
  });
  
  // Update session goals and broadcast to all participants
socket.on('update_session_goals', async ({ roomId, sessionId, goals }) => {
  try {
    console.log(`Goals updated for session ${sessionId} in room ${roomId} by ${socket.userName}`);
    console.log("Goals:", goals);
    
    // Save goals to database
    const Session = await import('./src/models/Session.js');
    const session = await Session.default.findById(sessionId);
    
    if (session) {
      session.goals = {
        description: goals.description,
        targetDuration: goals.targetDuration,
        targetMessages: goals.targetMessages,
        achieved: false
      };
      await session.save();
      
      // Broadcast goals to ALL participants in the room
      io.to(roomId).emit('session_goals_updated', {
        sessionId: sessionId,
        goals: session.goals,
        updatedBy: socket.userName,
        timestamp: new Date()
      });
      
      console.log(`Goals broadcasted to room ${roomId}`);
    }
    
  } catch (error) {
    console.error('Update goals error:', error);
    socket.emit('error', { message: 'Failed to update goals' });
  }
});

  // Leave room event
  socket.on('leave_room', async ({ roomId }) => {
    try {
      console.log(`${socket.userName} leaving room: ${roomId}`);
      
      socket.leave(roomId);
      
      // Remove from room participants
      if (roomParticipants.has(roomId)) {
        const participants = roomParticipants.get(roomId);
        participants.delete(socket.userId);
        
        const allParticipants = Array.from(participants.values());
        io.to(roomId).emit('participants_update', {
          participants: allParticipants,
          totalCount: allParticipants.length
        });
        
        if (participants.size === 0) {
          roomParticipants.delete(roomId);
        }
      }
      
      socket.to(roomId).emit('user_left', {
        userId: socket.userId,
        userName: socket.userName,
        timestamp: new Date()
      });
      
      // Save activity
      await saveActivity(socket.userId, roomId, 'room_left', { leftAt: new Date() });
    } catch (error) {
      console.error('Leave room error:', error);
    }
  });
  
  // Send message event
  socket.on('send_message', async ({ roomId, content }) => {
    try {
      console.log(`${socket.userName} sent message in room ${roomId}`);
      
      // Check if room is active
      const active = await isRoomActive(roomId);
      if (!active) {
        socket.emit('error', { message: 'Room is no longer active' });
        return;
      }
      
      const messageData = {
        _id: Date.now().toString(),
        content,
        user: {
          _id: socket.userId,
          name: socket.userName,
          email: socket.userEmail
        },
        createdAt: new Date(),
        room: roomId
      };
      
      io.to(roomId).emit('new_message', {
        message: messageData,
        roomId
      });
      
      // Save activity
      await saveActivity(socket.userId, roomId, 'message_sent', { message: content.substring(0, 200) });
    } catch (error) {
      console.error('Send message error:', error);
    }
  });

  // Goal achievement broadcast to all participants
socket.on('goal_achieved', ({ roomId, userName, goal }) => {
  console.log(`🏆 Goal achieved in room ${roomId} by ${userName}: ${goal}`);
  io.to(roomId).emit('goal_achieved', {
    userName: userName,
    goal: goal,
    timestamp: new Date()
  });
});
  
  // Typing indicator
  socket.on('typing', ({ roomId, isTyping }) => {
    socket.to(roomId).emit('user_typing', {
      userId: socket.userId,
      userName: socket.userName,
      isTyping,
      timestamp: new Date()
    });
  });

  // Update notes and broadcast to all participants
socket.on('update_notes', ({ roomId, notes, updatedBy }) => {
  console.log(`Notes updated in room ${roomId} by ${updatedBy}`);
  io.to(roomId).emit('notes_updated', {
    notes: notes,
    updatedBy: updatedBy,
    timestamp: new Date()
  });
});
  
  // Start session with real database session
socket.on('start_session', async ({ roomId }) => {
  try {
    console.log(`Session start requested in room ${roomId} by ${socket.userName}`);
    
    // CHECK IF THERE'S ALREADY AN ACTIVE SESSION
    if (activeSessions.has(roomId)) {
      console.log(`Room ${roomId} already has an active session - ignoring start request`);
      socket.emit('error', { message: 'A session is already active in this room' });
      return;
    }
    
    // Import Session model
    const Session = await import('./src/models/Session.js');
    
    // Create a session in database
    const session = await Session.default.create({
      room: roomId,
      startedBy: socket.userId,
      participants: [{
        user: socket.userId,
        joinTime: new Date()
      }],
      status: 'active'
    });
    
    // Store active session info for late joiners
    activeSessions.set(roomId, {
      sessionId: session._id.toString(),
      startTime: Date.now(),
      elapsedSeconds: 0
    });
    
    console.log("Created session with ID:", session._id);
    console.log("Active sessions:", Array.from(activeSessions.keys()));
    
    // Emit with real MongoDB ID to ALL users in room
    io.to(roomId).emit('session_started', {
      sessionId: session._id.toString(),
      startTime: new Date(),
      startedBy: socket.userId,
      startedByName: socket.userName
    });
    
  } catch (error) {
    console.error('Start session error:', error);
    socket.emit('error', { message: 'Failed to start session' });
  }
});

  
// End session and update database
socket.on('end_session', async ({ roomId, sessionId, duration }) => {
  try {
    console.log(`Session end requested in room ${roomId} by ${socket.userName}`);
    console.log(`Session ID from client: ${sessionId}`);
    
    // Use the sessionId from client if provided, otherwise find active session
    let sessionIdToUse = sessionId;
    
    if (!sessionIdToUse && activeSessions.has(roomId)) {
      sessionIdToUse = activeSessions.get(roomId).sessionId;
      console.log(`Using active session ID: ${sessionIdToUse}`);
    }
    
    if (!sessionIdToUse) {
      console.log(`No active session in room ${roomId} - ignoring end request`);
      socket.emit('error', { message: 'No active session to end' });
      return;
    }
    
    // Import Session model
    const Session = await import('./src/models/Session.js');
    
    // Find the session in database
    const session = await Session.default.findById(sessionIdToUse);
    
    if (!session) {
      console.log(`Session not found in database: ${sessionIdToUse}`);
      socket.emit('error', { message: 'Session not found' });
      return;
    }
    
    console.log("Found session in database. Current status:", session.status);
    
    if (session.status === 'active') {
      // Call the endSession method
      await session.endSession();
      
      console.log("Ended session:", session._id, "Duration:", session.duration, "minutes");
      
      // IMPORTANT: Emit to ALL users in room (including the sender)
      io.to(roomId).emit('session_ended', {
        sessionId: session._id.toString(),
        duration: session.duration,
        endedBy: socket.userId,
        endedByName: socket.userName
      });
      
      // Clear active session from memory
      activeSessions.delete(roomId);
    } else {
      console.log("Session was already ended");
    }
    
  } catch (error) {
    console.error('End session error:', error);
    socket.emit('error', { message: 'Failed to end session: ' + error.message });
  }
});
  
  // Timer sync from client (for manual sync)
  socket.on('sync_timer', ({ roomId, elapsedSeconds }) => {
    socket.to(roomId).emit('timer_sync', {
      elapsedSeconds,
      syncedBy: socket.userId,
      syncedByName: socket.userName,
      timestamp: Date.now()
    });
  });
  
  // Kick participant
  socket.on('kick_participant', async ({ roomId, userId, userName }) => {
    try {
      const room = await Room.findOne({
        _id: roomId,
        owner: socket.userId,
        status: 'active'
      });
      
      if (!room) {
        socket.emit('error', { message: 'Only room owner can kick participants' });
        return;
      }
      
      let targetSocketId = null;
      if (roomParticipants.has(roomId)) {
        const participants = roomParticipants.get(roomId);
        const participant = participants.get(userId);
        if (participant) {
          targetSocketId = participant.socketId;
          participants.delete(userId);
        }
      }
      
      if (targetSocketId) {
        io.to(targetSocketId).emit('kicked_from_room', {
          roomId,
          message: `You were kicked from the room by ${socket.userName}`
        });
        
        const targetSocket = io.sockets.sockets.get(targetSocketId);
        if (targetSocket) {
          targetSocket.leave(roomId);
        }
      }
      
      await Room.updateOne(
        { _id: roomId },
        { $pull: { participants: { user: userId } } }
      );
      
      if (roomParticipants.has(roomId)) {
        const participants = roomParticipants.get(roomId);
        const allParticipants = Array.from(participants.values());
        io.to(roomId).emit('participants_update', {
          participants: allParticipants,
          totalCount: allParticipants.length
        });
      }
      
      io.to(roomId).emit('user_kicked', {
        userId,
        userName,
        kickedBy: socket.userName,
        timestamp: new Date()
      });
      
      await saveActivity(socket.userId, roomId, 'user_kicked', { kickedUser: userName });
      
      console.log(`User ${userName} was kicked from room ${roomId} by ${socket.userName}`);
    } catch (error) {
      console.error('Kick participant error:', error);
      socket.emit('error', { message: error.message });
    }
  });
  
  // Disconnect - NO periodicSync reference here anymore
  socket.on('disconnect', async () => {
    console.log(`🔌 User ${socket.userName} (${socket.userId}) disconnected`);
    
    for (const [roomId, participants] of roomParticipants.entries()) {
      if (participants.has(socket.userId)) {
        participants.delete(socket.userId);
        
        const allParticipants = Array.from(participants.values());
        io.to(roomId).emit('participants_update', {
          participants: allParticipants,
          totalCount: allParticipants.length
        });
        
        socket.to(roomId).emit('user_left', {
          userId: socket.userId,
          userName: socket.userName,
          timestamp: new Date()
        });
        
        if (participants.size === 0) {
          roomParticipants.delete(roomId);
        }
      }
    }
    
    connectedUsers.delete(socket.id);
  });
});

// Start the global timer broadcast
startGlobalTimerBroadcast();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/studyroom')
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 WebSocket server ready on port ${PORT}`);
      console.log(`🌐 CORS enabled for http://localhost:3001`);
      console.log(`\n✨ Ready to accept requests!\n`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });