import React, { useState, useEffect } from 'react';
import { Volume2, Mic } from 'lucide-react';

export default function AudioDecibelMeter() {
  const [levels, setLevels] = useState([60, 75, 45, 85, 65, 90, 50, 70]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLevels([
        Math.floor(Math.random() * 50) + 40,
        Math.floor(Math.random() * 60) + 35,
        Math.floor(Math.random() * 70) + 30,
        Math.floor(Math.random() * 55) + 40,
        Math.floor(Math.random() * 65) + 35,
        Math.floor(Math.random() * 80) + 20,
        Math.floor(Math.random() * 50) + 45,
        Math.floor(Math.random() * 60) + 40,
      ]);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-surface/90 border border-border text-[10px] font-mono select-none">
      <div className="flex items-center gap-1 text-accent-red font-bold">
        <Mic className="w-3 h-3 animate-pulse" />
        <span>CH 01/02</span>
      </div>

      <div className="flex items-end gap-1 h-3.5 w-24">
        {levels.map((lvl, idx) => (
          <div
            key={idx}
            className={`flex-1 rounded-sm transition-all duration-150 ${
              lvl > 80
                ? 'bg-accent-red'
                : lvl > 60
                ? 'bg-amber-400'
                : 'bg-emerald-500/80'
            }`}
            style={{ height: `${lvl}%` }}
          />
        ))}
      </div>

      <span className="text-content-muted">-12 dB</span>
    </div>
  );
}
