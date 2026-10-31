import React from 'react';

export default function Loader({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3 font-khmer">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-neutral-200 border-t-neutral-900 animate-spin`}
      />
      {text && (
        <p className="text-xs text-neutral-500 font-medium">
          {text}
        </p>
      )}
    </div>
  );
}
