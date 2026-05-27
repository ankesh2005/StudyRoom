import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import apiRoutes from './src/routes/api.js';
import User from './src/models/User.js';

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
const connectedUsers = new Map(); // socketId -> user info
const roomParticipants = new Map(); // roomId -> Map of userId -> user info

// Socket.IO authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return next(new Error('User not found'));
    }
    
    // Attach user info to socket
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
  
  // Store user connection with real name
  connectedUsers.set(socket.id, {
    socketId: socket.id,
    userId: socket.userId,
    userName: socket.userName,
    userEmail: socket.userEmail
  });
  
  // Join room event
  socket.on('join_room', ({ roomId }) => {
    console.log(`${socket.userName} joining room: ${roomId}`);
    
    // Leave all previous rooms
    const previousRooms = Array.from(socket.rooms);
    previousRooms.forEach(room => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });
    
    // Join new room
    socket.join(roomId);
    
    // Track participant with real user info
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
    
    // Notify others in room
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
    
    // Send success response to the joining user
    socket.emit('room_joined', {
      success: true,
      roomId,
      participants: allParticipants
    });
    
    console.log(`Total participants in room ${roomId}: ${allParticipants.length}`);
  });
  
  // Leave room event
  socket.on('leave_room', ({ roomId }) => {
    console.log(`${socket.userName} leaving room: ${roomId}`);
    
    socket.leave(roomId);
    
    // Remove from room participants
    if (roomParticipants.has(roomId)) {
      const participants = roomParticipants.get(roomId);
      participants.delete(socket.userId);
      
      // Get updated participants list
      const allParticipants = Array.from(participants.values());
      
      // Broadcast updated list to remaining participants
      io.to(roomId).emit('participants_update', {
        participants: allParticipants,
        totalCount: allParticipants.length
      });
      
      if (participants.size === 0) {
        roomParticipants.delete(roomId);
      }
    }
    
    // Notify others
    socket.to(roomId).emit('user_left', {
      userId: socket.userId,
      userName: socket.userName,
      timestamp: new Date()
    });
  });
  
  // Send message event - NOW WITH REAL USER NAMES
  socket.on('send_message', ({ roomId, content }) => {
    console.log(`${socket.userName} sent message in room ${roomId}: ${content}`);
    
    const messageData = {
      _id: Date.now().toString(),
      content,
      user: {
        _id: socket.userId,
        name: socket.userName,  // Real user name from database
        email: socket.userEmail
      },
      createdAt: new Date(),
      room: roomId
    };
    
    // Broadcast to everyone in the room including sender
    io.to(roomId).emit('new_message', {
      message: messageData,
      roomId
    });
  });
  
  // Typing indicator with real name
  socket.on('typing', ({ roomId, isTyping }) => {
    socket.to(roomId).emit('user_typing', {
      userId: socket.userId,
      userName: socket.userName,
      isTyping,
      timestamp: new Date()
    });
  });
  
  // Start session with real name
  socket.on('start_session', ({ roomId }) => {
    console.log(`Session started in room ${roomId} by ${socket.userName}`);
    
    io.to(roomId).emit('session_started', {
      sessionId: Date.now().toString(),
      startTime: new Date(),
      startedBy: socket.userId,
      startedByName: socket.userName
    });
  });
  
  // End session with real name
  socket.on('end_session', ({ roomId, duration }) => {
    console.log(`Session ended in room ${roomId} by ${socket.userName}`);
    
    io.to(roomId).emit('session_ended', {
      sessionId: Date.now().toString(),
      duration: duration || 0,
      endedBy: socket.userId,
      endedByName: socket.userName
    });
  });
  
  // Timer sync
  socket.on('sync_timer', ({ roomId, elapsedSeconds }) => {
    socket.to(roomId).emit('timer_sync', {
      elapsedSeconds,
      syncedBy: socket.userId,
      syncedByName: socket.userName,
      timestamp: Date.now()
    });
  });
  
  // Kick participant (only room owner can do this - you'll need to check room ownership)
  socket.on('kick_participant', async ({ roomId, userId, userName }) => {
    try {
      // Check if the kicker is the room owner
      const room = await Room.findOne({
        _id: roomId,
        owner: socket.userId,
        status: 'active'
      });
      
      if (!room) {
        socket.emit('error', { message: 'Only room owner can kick participants' });
        return;
      }
      
      // Find the participant's socket
      let targetSocketId = null;
      if (roomParticipants.has(roomId)) {
        const participants = roomParticipants.get(roomId);
        const participant = participants.get(userId);
        if (participant) {
          targetSocketId = participant.socketId;
          participants.delete(userId);
        }
      }
      
      // Notify the kicked user
      if (targetSocketId) {
        io.to(targetSocketId).emit('kicked_from_room', {
          roomId,
          message: `You were kicked from the room by ${socket.userName}`
        });
        
        // Disconnect the kicked user from the room
        const targetSocket = io.sockets.sockets.get(targetSocketId);
        if (targetSocket) {
          targetSocket.leave(roomId);
        }
      }
      
      // Remove user from room participants in database
      await Room.updateOne(
        { _id: roomId },
        { $pull: { participants: { user: userId } } }
      );
      
      // Broadcast updated participant list
      if (roomParticipants.has(roomId)) {
        const participants = roomParticipants.get(roomId);
        const allParticipants = Array.from(participants.values());
        io.to(roomId).emit('participants_update', {
          participants: allParticipants,
          totalCount: allParticipants.length
        });
      }
      
      // Notify room about kick
      io.to(roomId).emit('user_kicked', {
        userId,
        userName,
        kickedBy: socket.userName,
        timestamp: new Date()
      });
      
      console.log(`User ${userName} was kicked from room ${roomId} by ${socket.userName}`);
      
    } catch (error) {
      console.error('Kick participant error:', error);
      socket.emit('error', { message: error.message });
    }
  });
  
  // Disconnect
  socket.on('disconnect', () => {
    console.log(`🔌 User ${socket.userName} (${socket.userId}) disconnected`);
    
    // Remove from all rooms
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

// Import Room model for kick functionality
import Room from './src/models/Room.js';

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