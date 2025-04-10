import { Server } from 'socket.io';

let io;

export function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_CLIENT_URL,
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('joinLoadRoom', (loadId) => {
      socket.join(`load_${loadId}`);
    });
    
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}