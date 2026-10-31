import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Play } from 'lucide-react';
import { detectVideoProvider, getSafeEmbedUrl } from '../../utils/videoUtils';
import { useLanguage } from '../../context/LanguageContext';

export default function VideoModal({ isOpen, video, onClose }) {
  const { t } = useLanguage();

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/60 backdrop-blur-sm">
        
        {/* Backdrop click */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-4xl bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-neutral-50 border-b border-neutral-200">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-accent-red" />
              <span className="text-xs font-mono font-bold tracking-widest text-neutral-800 uppercase">
                {parsed.provider.toUpperCase()}
              </span>
              <span className="text-neutral-400 text-xs hidden sm:inline">•</span>
              <span className="text-xs text-neutral-600 truncate max-w-xs sm:max-w-md font-khmer">
                {video.title}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 transition"
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
              <div className="text-center p-8 max-w-md font-khmer text-white">
                <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-4 text-accent-red">
                  <ExternalLink className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold mb-2">
                  {video.title}
                </h4>
                <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
                  វីដេអូនេះត្រូវបានបង្ហោះនៅលើ {parsed.provider}។ អ្នកអាចចុចបើកទស្សនាលើផ្លេតហ្វមដើមបានដោយផ្ទាល់។
                </p>
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-red text-white text-xs font-bold uppercase tracking-wider hover:bg-accent-darkRed transition"
                >
                  <span>{t.portfolio.openInNewTab}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Video Metadata Footer */}
          <div className="p-5 bg-white border-t border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-khmer">
            <div>
              <h3 className="text-base font-bold text-neutral-900 mb-1">
                {video.title}
              </h3>
              <p className="text-xs text-neutral-600 line-clamp-2 max-w-2xl leading-relaxed">
                {video.description}
              </p>
            </div>

            {videoUrl && (
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-3.5 py-1.5 rounded-lg bg-neutral-100 border border-neutral-200 hover:border-neutral-300 text-xs text-neutral-700 hover:text-neutral-900 transition flex items-center gap-1.5"
              >
                <span>{t.portfolio.originalLink}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
