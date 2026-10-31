import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Play, AlertCircle } from 'lucide-react';
import { detectVideoProvider, getSafeEmbedUrl } from '../../utils/videoUtils';

export default function VideoModal({ isOpen, video, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !video) return null;

  const videoUrl = video.videoURL || '';
  const parsed = detectVideoProvider(videoUrl);
  const safeEmbedUrl = getSafeEmbedUrl(videoUrl);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/90 backdrop-blur-md">
        
        {/* Backdrop click */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-4xl bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-surface-elevated border-b border-border">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-red animate-rec-pulse" />
              <span className="text-xs font-mono font-bold tracking-widest text-accent-red uppercase">
                {parsed.provider.toUpperCase()} PLAYBACK
              </span>
              <span className="text-content-muted text-xs hidden sm:inline">•</span>
              <span className="text-xs text-content-secondary truncate max-w-xs sm:max-w-md">
                {video.title}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-content-muted hover:text-white hover:bg-surface border border-transparent hover:border-border transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Player Container */}
          <div className="relative aspect-video w-full bg-black flex items-center justify-center">
            {safeEmbedUrl ? (
              <iframe
                src={safeEmbedUrl}
                title={video.title || 'Video Player'}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : parsed.provider === 'direct' ? (
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center p-8 max-w-md">
                <div className="w-12 h-12 rounded-full bg-surface-elevated border border-border flex items-center justify-center mx-auto mb-4 text-accent-red">
                  <ExternalLink className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-heading font-bold text-white mb-2">
                  External Media Video
                </h4>
                <p className="text-xs text-content-secondary mb-6 leading-relaxed">
                  This video is hosted on an external platform ({parsed.provider}) and is configured to view directly on their official player.
                </p>
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-red text-white text-xs font-bold uppercase tracking-wider shadow-rec-glow hover:bg-accent-darkRed transition"
                >
                  <span>Open Video in New Tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Video Metadata Footer */}
          <div className="p-5 bg-surface border-t border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-heading font-bold text-white mb-1">
                {video.title}
              </h3>
              <p className="text-xs text-content-secondary line-clamp-2 max-w-2xl">
                {video.description}
              </p>
            </div>

            {videoUrl && (
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-3.5 py-1.5 rounded-lg bg-surface-elevated border border-border hover:border-accent-red text-xs text-content-secondary hover:text-white transition flex items-center gap-1.5"
              >
                <span>Original Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
