import React, { useState, useRef, useEffect } from 'react';
import { socket } from './socket';
import VideoPlayer from './VideoPlayer';
import RoomControls from './RoomControls';

const VideoRoom = () => {
  const [roomId, setRoomId] = useState('');
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isInRoom, setIsInRoom] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [remoteUserStatus, setRemoteUserStatus] = useState(null);

  const peerConnection = useRef(null);
  const reconnectAttempts = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 3;

  const servers = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302', 
          'stun:stun2.l.google.com:19302',
          'stun:stun3.l.google.com:19302'
        ],
      },
    ],
  };

  useEffect(() => {
    setupMediaStream();
    const cleanup = setupSocketListeners();
    setupConnectionMonitoring();

    return () => {
      cleanup();
      cleanupResources();
    };
  }, []);

  const setupSocketListeners = () => {
    // User joined event handler
    socket.on('user-joined', async (userId) => {
      try {
        setRemoteUserStatus('connecting');
        await setupPeerConnection();
        
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);

        socket.emit('offer', {
          target: userId,
          sdp: offer
        });
      } catch (err) {
        setError('Failed to establish connection with new user');
        console.error('Error in user-joined handler:', err);
      }
    });

    // Offer handler
    socket.on('offer', async ({ sdp, caller }) => {
      try {
        await setupPeerConnection();
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(sdp));
        
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);

        socket.emit('answer', {
          target: caller,
          sdp: answer
        });
      } catch (err) {
        setError('Failed to process connection offer');
        console.error('Error in offer handler:', err);
      }
    });

    // Answer handler
    socket.on('answer', async ({ sdp }) => {
      try {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(sdp));
        setRemoteUserStatus('connected');
      } catch (err) {
        setError('Failed to process connection answer');
        console.error('Error in answer handler:', err);
      }
    });

    // ICE candidate handler
    socket.on('ice-candidate', async ({ candidate, sender }) => {
      try {
        if (peerConnection.current && candidate) {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (err) {
        console.error('Error in ice-candidate handler:', err);
      }
    });

    // User left handler
    socket.on('user-left', () => {
      setRemoteUserStatus('disconnected');
      setRemoteStream(null);
    });

    // Reconnection handlers
    socket.on('reconnect-peer', async (userId) => {
      try {
        await handlePeerReconnection();
      } catch (err) {
        console.error('Error in reconnect-peer handler:', err);
      }
    });

    // Room error handler
    socket.on('room-error', (message) => {
      setError(message);
      setIsInRoom(false);
    });

    // Cleanup function to remove all listeners
    return () => {
      socket.off('user-joined');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('user-left');
      socket.off('reconnect-peer');
      socket.off('room-error');
    };
  };

  const setupConnectionMonitoring = () => {
    socket.on('connect', () => {
      setConnectionStatus('connected');
      setError(null);
      reconnectAttempts.current = 0;
    });

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
      setError('Connection lost. Attempting to reconnect...');
      handleReconnection();
    });

    if (peerConnection.current) {
      peerConnection.current.onconnectionstatechange = () => {
        const state = peerConnection.current.connectionState;
        setRemoteUserStatus(state);
        
        if (state === 'failed' || state === 'disconnected') {
          setError('Peer connection lost. Please try rejoining the room.');
          handlePeerReconnection();
        }
      };
    }
  };

  const handleReconnection = async () => {
    if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
      setError('Unable to reconnect. Please refresh the page.');
      return;
    }

    reconnectAttempts.current += 1;
    try {
      await socket.connect();
    } catch (err) {
      setTimeout(handleReconnection, 2000 * reconnectAttempts.current);
    }
  };

  const handlePeerReconnection = async () => {
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    
    if (isInRoom) {
      await setupPeerConnection();
      socket.emit('reconnect-peer', roomId);
    }
  };

  const setupMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
    } catch (err) {
      handleMediaError(err);
    }
  };

  const handleMediaError = (error) => {
    let errorMessage = 'Error accessing media devices';
    
    if (error.name === 'NotAllowedError') {
      errorMessage = 'Please allow camera and microphone access to use this app';
    } else if (error.name === 'NotFoundError') {
      errorMessage = 'No camera or microphone found';
    } else if (error.name === 'NotReadableError') {
      errorMessage = 'Your media devices are already in use';
    }
    
    setError(errorMessage);
  };

  const setupPeerConnection = async () => {
    peerConnection.current = new RTCPeerConnection(servers);
    
    peerConnection.current.addTransceiver('video', { direction: 'sendrecv' });
    peerConnection.current.addTransceiver('audio', { direction: 'sendrecv' });

    peerConnection.current.ontrack = ({ streams: [stream] }) => {
      setRemoteStream(stream);
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', {
          target: roomId,
          candidate: event.candidate,
        });
      }
    };

    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, localStream);
      });
    }
  };

  const createRoom = async () => {
    try {
      const newRoomId = Math.random().toString(36).substring(7);
      setRoomId(newRoomId);
      await setupPeerConnection();
      socket.emit('create-room', newRoomId);
      setIsInRoom(true);
      setError(null);
    } catch (err) {
      setError('Failed to create room. Please try again.');
    }
  };

  const joinRoom = async (roomIdToJoin) => {
    try {
      if (!roomIdToJoin.trim()) {
        throw new Error('Please enter a room ID');
      }
      setRoomId(roomIdToJoin);
      await setupPeerConnection();
      socket.emit('join-room', roomIdToJoin);
      setIsInRoom(true);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to join room. Please try again.');
    }
  };

  const cleanupResources = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    socket.off('connect');
    socket.off('disconnect');
  };

  return (
    <div className="min-h-screen bg-white/70 text-black pt-10 p-6">
      <div className="max-w-6xl mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-black text-sm">
              {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {remoteUserStatus && (
          <div className="mb-4">
            <span className="text-black text-sm">
              Remote User: {remoteUserStatus}
            </span>
          </div>
        )}

        <RoomControls
          isInRoom={isInRoom}
          roomId={roomId}
          isMuted={isMuted}
          isVideoOff={isVideoOff}
          onCreateRoom={createRoom}
          onJoinRoom={joinRoom}
          onLeaveRoom={cleanupResources}
          onToggleAudio={() => setIsMuted(!isMuted)}
          onToggleVideo={() => setIsVideoOff(!isVideoOff)}
          onRoomIdChange={setRoomId}
          disabled={!!error}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {localStream && (
            <VideoPlayer
              stream={localStream}
              isMuted={true}
              isLocal={true}
              error={error}
            />
          )}

          {remoteStream && (
            <VideoPlayer
              stream={remoteStream}
              isMuted={false}
              isLocal={false}
              error={error}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoRoom;