import React from 'react';

const RoomControls = ({
  isInRoom,
  roomId,
  isMuted,
  isVideoOff,
  onCreateRoom,
  onJoinRoom,
  onLeaveRoom,
  onToggleAudio,
  onToggleVideo,
  onRoomIdChange,
}) => {
  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      alert('Room ID copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy room ID:', err);
    }
  };

  return (
    <div className="w-full">
      {!isInRoom ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            type="text"
            value={roomId}
            onChange={(e) => onRoomIdChange(e.target.value)}
            placeholder="Enter Room ID"
            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex gap-2">
            <button
              onClick={onCreateRoom}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                       transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create Room
            </button>
            <button
              onClick={() => onJoinRoom(roomId)}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                       transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              disabled={!roomId}
            >
              Join Room
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-white">Room ID: {roomId}</span>
              <button
                onClick={copyRoomId}
                className="px-3 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 
                         transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Copy
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onToggleAudio}
                className={`px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 
                         ${isMuted 
                           ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500' 
                           : 'bg-green-500 hover:bg-green-600 focus:ring-green-500'
                         }`}
              >
                <div className="flex items-center gap-2">
                  {isMuted ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" 
                              clipRule="evenodd" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                      </svg>
                      <span>Unmute</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0-11V4" />
                      </svg>
                      <span>Mute</span>
                    </>
                  )}
                </div>
              </button>

              <button
                onClick={onToggleVideo}
                className={`px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 
                         ${isVideoOff 
                           ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500' 
                           : 'bg-green-500 hover:bg-green-600 focus:ring-green-500'
                         }`}
              >
                <div className="flex items-center gap-2">
                  {isVideoOff ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                      </svg>
                      <span>Show Video</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Hide Video</span>
                    </>
                  )}
                </div>
              </button>

              <button
                onClick={onLeaveRoom}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 
                         transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Leave Room</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomControls;