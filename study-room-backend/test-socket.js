import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('✅ Socket connected successfully!');
  console.log('Socket ID:', socket.id);
  
  // Test join room
  socket.emit('join_room', { roomId: 'test-room' });
  
  // Test send message
  socket.emit('send_message', { roomId: 'test-room', content: 'Hello from test!' });
  
  setTimeout(() => {
    socket.disconnect();
    process.exit(0);
  }, 2000);
});

socket.on('connect_error', (error) => {
  console.error('❌ Socket connection error:', error.message);
  process.exit(1);
});

socket.on('room_joined', (data) => {
  console.log('Joined room:', data);
});

socket.on('new_message', (data) => {
  console.log('Received message:', data);
});
