import React, { useEffect, useRef } from 'react';

const VideoPlayer = ({ stream, isMuted = false, isLocal = false }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative w-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isMuted}
        className="w-full h-full rounded-lg bg-gray-900 object-cover"
      />
      <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-lg">
        <p className="text-white text-sm font-medium">
          {isLocal ? 'You' : 'Remote User'}
        </p>
      </div>
      {!stream && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg">
          <div className="text-gray-400 text-center">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <p>No video signal</p>
          </div>
        </div>
      )}
      {stream && !stream.active && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90 rounded-lg">
          <p className="text-white">Video paused</p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;