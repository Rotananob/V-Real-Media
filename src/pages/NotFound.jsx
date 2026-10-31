import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-accent-red/30 text-xs font-mono text-accent-red mb-6">
          <span className="w-2 h-2 rounded-full bg-accent-red animate-rec-pulse" />
          <span>FRAME NOT FOUND // 404</span>
        </div>

        <h1 className="text-7xl sm:text-9xl font-display font-extrabold text-white tracking-tighter mb-4">
          404
        </h1>

        <h2 className="text-xl sm:text-2xl font-heading font-bold text-white mb-3">
          This Scene Doesn't Exist
        </h2>

        <p className="text-sm text-content-secondary mb-8 leading-relaxed">
          The footage or page you were trying to access has been moved, archived, or was never filmed.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent-red text-white text-xs font-mono uppercase tracking-widest font-bold shadow-rec-glow hover:bg-accent-darkRed transition"
        >
          <Home className="w-4 h-4" />
          <span>Return To Main Stage</span>
        </Link>
      </div>
    </div>
  );
}
