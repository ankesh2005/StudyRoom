import Message from '../models/Message.js';
import Room from '../models/Room.js';
import Session from '../models/Session.js';

export default (io, socket, onlineUsers) => {
  
  // Join room
  socket.on('join_room', async ({ roomId }, callback) => {
    try {
      const room = await Room.findOne({
        _id: roomId,
        'participants.user': socket.userId,
        status: 'active'
      });
      
      if (!room) {
        return callback({ error: 'Cannot join room' });
      }
      
      socket.join(`room_${roomId}`);
      
      // Notify others
      socket.to(`room_${roomId}`).emit('user_joined', {
        userId: socket.userId,
        userName: socket.userName,
        timestamp: new Date()
      });
      
      // Get participants with online status
      const participants = room.participants.map(p => ({
        userId: p.user,
        isOnline: onlineUsers.has(p.user.toString()),
        role: p.role
      }));
      
      callback({
        success: true,
        room: {
          id: room._id,
          name: room.name,
          participants
        }
      });
    } catch (error) {
      callback({ error: error.message });
    }
  });
  
  // Send message
  socket.on('send_message', async ({ roomId, content }, callback) => {
    try {
      const room = await Room.findOne({
        _id: roomId,
        'participants.user': socket.userId
      });
      
      if (!room) {
        return callback({ error: 'Not a member' });
      }
      
      const message = await Message.create({
        room: roomId,
        user: socket.userId,
        content
      });
      
      await message.populate('user', 'name email');
      
      // Update session messages count if active
      if (room.currentSession) {
        await Session.findByIdAndUpdate(room.currentSession, {
          $inc: { 'metrics.messagesCount': 1 }
        });
      }
      
      io.to(`room_${roomId}`).emit('new_message', {
        message,
        roomId
      });
      
      callback({ success: true, message });
    } catch (error) {
      callback({ error: error.message });
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
  
  // Timer sync
  socket.on('sync_timer', ({ roomId, elapsedSeconds }) => {
    socket.to(`room_${roomId}`).emit('timer_sync', {
      elapsedSeconds,
      syncedBy: socket.userId,
      timestamp: new Date()
    });
  });
  
  // Leave room
  socket.on('leave_room', async ({ roomId }, callback) => {
    socket.leave(`room_${roomId}`);
    socket.to(`room_${roomId}`).emit('user_left', {
      userId: socket.userId,
      userName: socket.userName,
      timestamp: new Date()
    });
    callback({ success: true });
  });
};