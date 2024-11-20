
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: ['https://tester311.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['https://tester311.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('create-room', (roomId) => {
    try {
      rooms.set(roomId, new Set([socket.id]));
      socket.join(roomId);
      console.log(`Room ${roomId} created by ${socket.id}`);
    } catch (error) {
      socket.emit('room-error', 'Failed to create room');
    }
  });

  socket.on('join-room', (roomId) => {
    try {
      const room = rooms.get(roomId);
      if (!room) {
        socket.emit('room-error', 'Room not found');
        return;
      }

      if (room.size >= 2) {
        socket.emit('room-error', 'Room is full');
        return;
      }

      room.add(socket.id);
      socket.join(roomId);
      socket.to(roomId).emit('user-joined', socket.id);
      console.log(`User ${socket.id} joined room ${roomId}`);
    } catch (error) {
      socket.emit('room-error', 'Failed to join room');
    }
  });

  socket.on('offer', ({ target, sdp }) => {
    socket.to(target).emit('offer', {
      sdp,
      caller: socket.id
    });
  });

  socket.on('answer', ({ target, sdp }) => {
    socket.to(target).emit('answer', {
      sdp,
      answerer: socket.id
    });
  });

  socket.on('ice-candidate', ({ target, candidate }) => {
    socket.to(target).emit('ice-candidate', {
      candidate,
      sender: socket.id
    });
  });

  socket.on('disconnecting', () => {
    for (const roomId of socket.rooms) {
      if (rooms.has(roomId)) {
        const room = rooms.get(roomId);
        room.delete(socket.id);
        
        if (room.size === 0) {
          rooms.delete(roomId);
        } else {
          socket.to(roomId).emit('user-left', socket.id);
        }
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Handle health check
app.get('/api/healthcheck', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

module.exports = server;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

