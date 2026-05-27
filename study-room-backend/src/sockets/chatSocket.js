import Message from '../models/Message.js';
import Room from '../models/Room.js';
import Session from '../models/Session.js';

// Store room participants globally
const roomParticipants = new Map();

export default (io, socket, onlineUsers) => {
  
  // Join room
  socket.on('join_room', async ({ roomId }) => {
    try {
      // Check if user is allowed to join
      const room = await Room.findOne({
        _id: roomId,
        'participants.user': socket.userId,
        status: 'active'
      });
      
      if (!room) {
        socket.emit('error', { message: 'Cannot join room' });
        return;
      }
      
      // Leave previous rooms
      const previousRooms = Array.from(socket.rooms);
      previousRooms.forEach(room => {
        if (room !== socket.id) {
          socket.leave(room);
        }
      });
      
      // Join new room
      socket.join(`room_${roomId}`);
      
      // Track participant
      if (!roomParticipants.has(roomId)) {
        roomParticipants.set(roomId, new Map());
      }
      
      const participants = roomParticipants.get(roomId);
      participants.set(socket.userId, {
        socketId: socket.id,
        userName: socket.userName,
        userId: socket.userId,
        joinedAt: new Date()
      });
      
      // Get all participants in the room
      const allParticipants = Array.from(participants.values());
      
      // Broadcast updated participant list to everyone in room
      io.to(`room_${roomId}`).emit('participants_update', {
        participants: allParticipants,
        totalCount: allParticipants.length
      });
      
      // Notify that user joined
      socket.to(`room_${roomId}`).emit('user_joined', {
        userId: socket.userId,
        userName: socket.userName,
        timestamp: new Date()
      });
      
      console.log(`User ${socket.userName} joined room ${roomId}. Total participants: ${allParticipants.length}`);
      
    } catch (error) {
      console.error('Join room error:', error);
      socket.emit('error', { message: error.message });
    }
  });
  
  // Leave room
  socket.on('leave_room', async ({ roomId }) => {
    try {
      socket.leave(`room_${roomId}`);
      
      // Remove participant
      if (roomParticipants.has(roomId)) {
        const participants = roomParticipants.get(roomId);
        participants.delete(socket.userId);
        
        if (participants.size === 0) {
          roomParticipants.delete(roomId);
        } else {
          // Broadcast updated list
          const allParticipants = Array.from(participants.values());
          io.to(`room_${roomId}`).emit('participants_update', {
            participants: allParticipants,
            totalCount: allParticipants.length
          });
        }
      }
      
      // Notify others
      socket.to(`room_${roomId}`).emit('user_left', {
        userId: socket.userId,
        userName: socket.userName,
        timestamp: new Date()
      });
      
      console.log(`User ${socket.userName} left room ${roomId}`);
      
    } catch (error) {
      console.error('Leave room error:', error);
    }
  });
  
  // Kick participant (only room owner can do this)
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
          targetSocket.leave(`room_${roomId}`);
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
        io.to(`room_${roomId}`).emit('participants_update', {
          participants: allParticipants,
          totalCount: allParticipants.length
        });
      }
      
      // Notify room about kick
      io.to(`room_${roomId}`).emit('user_kicked', {
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
  
  // Send message
  socket.on('send_message', async ({ roomId, content }) => {
    try {
      const message = await Message.create({
        room: roomId,
        user: socket.userId,
        content
      });
      
      await message.populate('user', 'name email');
      
      io.to(`room_${roomId}`).emit('new_message', {
        message,
        roomId
      });
      
    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('error', { message: error.message });
    }
  });
  
  // Typing indicator
  socket.on('typing_start', ({ roomId }) => {
    socket.to(`room_${roomId}`).emit('user_typing', {
      userId: socket.userId,
      userName: socket.userName,
      isTyping: true
    });
  });
  
  socket.on('typing_stop', ({ roomId }) => {
    socket.to(`room_${roomId}`).emit('user_typing', {
      userId: socket.userId,
      isTyping: false
    });
  });
  
  // Start session
  socket.on('start_session', ({ roomId }) => {
    io.to(`room_${roomId}`).emit('session_started', {
      sessionId: Date.now().toString(),
      startTime: new Date(),
      startedBy: socket.userId,
      startedByName: socket.userName
    });
  });
  
  // End session
  socket.on('end_session', ({ roomId, duration }) => {
    io.to(`room_${roomId}`).emit('session_ended', {
      sessionId: Date.now().toString(),
      duration: duration || 0,
      endedBy: socket.userId,
      endedByName: socket.userName
    });
  });
  
  // Timer sync
  socket.on('sync_timer', ({ roomId, elapsedSeconds }) => {
    socket.to(`room_${roomId}`).emit('timer_sync', {
      elapsedSeconds,
      syncedBy: socket.userId,
      timestamp: new Date()
    });
  });
  
  // Disconnect
  socket.on('disconnect', async () => {
    // Remove user from all rooms
    for (const [roomId, participants] of roomParticipants.entries()) {
      if (participants.has(socket.userId)) {
        participants.delete(socket.userId);
        
        // Broadcast updated list
        const allParticipants = Array.from(participants.values());
        io.to(`room_${roomId}`).emit('participants_update', {
          participants: allParticipants,
          totalCount: allParticipants.length
        });
        
        socket.to(`room_${roomId}`).emit('user_left', {
          userId: socket.userId,
          userName: socket.userName,
          timestamp: new Date()
        });
      }
    }
    
    console.log(`User ${socket.userName} disconnected`);
  });
};