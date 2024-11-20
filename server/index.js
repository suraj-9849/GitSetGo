const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "tester311.vercel.app", 
    methods: ["GET", "POST"]
  }
});

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('create-room', (roomId) => {
    rooms.set(roomId, { creator: socket.id });
    socket.join(roomId);
    console.log(`Room created: ${roomId} by ${socket.id}`);
  });

  socket.on('join-room', (roomId) => {
    const room = rooms.get(roomId);
    if (room) {
      socket.join(roomId);
      socket.to(roomId).emit('user-joined', socket.id);
      console.log(`User ${socket.id} joined room: ${roomId}`);
    }
  });

  socket.on('offer', (payload) => {
    io.to(payload.target).emit('offer', {
      sdp: payload.sdp,
      caller: socket.id
    });
  });

  socket.on('answer', (payload) => {
    io.to(payload.target).emit('answer', {
      sdp: payload.sdp,
      answerer: socket.id
    });
  });

  socket.on('ice-candidate', (payload) => {
    io.to(payload.target).emit('ice-candidate', {
      candidate: payload.candidate,
      sender: socket.id
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    rooms.forEach((value, key) => {
      if (value.creator === socket.id) {
        rooms.delete(key);
      }
    });
  });
});

app.get("/",(req,res)=>{
    res.send("Hello Baburao")
})

server.listen(3001, () => {
  console.log('Server running on port 3001');
});