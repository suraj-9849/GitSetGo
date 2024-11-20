import { io } from 'socket.io-client';

const URL = 'https://tester-311-backend.vercel.app';

export const socket = io(URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  withCredentials: true,
  transports: ['websocket', 'polling'],
  cors: {
    origin: "https://tester311.vercel.app"
  }
});

socket.on('connect', () => {
  console.log('Connected to server with ID:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error.message);
  // Helpful for debugging
  if (error.description) {
    console.error('Additional error details:', error.description);
  }
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
  
  // Handle specific disconnect reasons
  if (reason === 'io server disconnect') {
    // Server disconnected, try reconnecting
    socket.connect();
  }
  // If the disconnection was initiated by the server, you may want to attempt reconnection
  if (reason === 'transport close') {
    console.log('Attempting to reconnect...');
  }
});

// Add error handling for specific socket events
socket.on('error', (error) => {
  console.error('Socket error:', error);
});

socket.on('reconnect', (attemptNumber) => {
  console.log('Successfully reconnected after', attemptNumber, 'attempts');
});

socket.on('reconnect_error', (error) => {
  console.error('Reconnection error:', error);
});

socket.on('reconnect_failed', () => {
  console.error('Failed to reconnect after maximum attempts');
});

export default socket;