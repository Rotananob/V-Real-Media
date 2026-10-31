import React from 'react';

export default function Loader({ size = 'md', text = 'Loading cinematic content...' }) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-2',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative flex items-center justify-center">
        {/* Pulsing REC ring */}
        <div
          className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-accent-red/30 border-t-accent-red animate-spin`}
        />
        <div className="absolute w-2 h-2 rounded-full bg-accent-red animate-ping" />
      </div>
      {text && (
        <p className="text-xs tracking-widest text-content-secondary uppercase font-display animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
