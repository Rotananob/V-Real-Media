import React from 'react';
import { Play, Sparkles, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import { useLanguage } from '../../context/LanguageContext';

export default function PortfolioCard({ item, onPlayClick }) {
  const { t } = useLanguage();
  const thumbnail = item.thumbnailURL || '/assets/logo.jpg';

  const categoryName = t.categories[item.category] || item.category || 'Media';

  return (
    <div className="group relative rounded-xl overflow-hidden bg-surface border border-border hover:border-accent-red/60 transition-all duration-300 flex flex-col h-full shadow-human-card hover:shadow-rec-glow/15">
      
      {/* Thumbnail Aspect Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <img
          src={thumbnail}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/assets/logo.jpg';
          }}
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-black/30" />

        {/* Featured Badge */}
        {item.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent-red/90 text-white text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-sm shadow-md font-khmer">
            <Sparkles className="w-3 h-3" />
            <span>{t.portfolio.featured}</span>
          </div>
        )}

        {/* Category Pill */}
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-khmer uppercase tracking-wider text-content-secondary">
          {categoryName}
        </div>

        {/* Hover Play Button Trigger */}
        <button
          type="button"
          onClick={() => onPlayClick(item)}
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
          aria-label={`Play ${item.title}`}
        >
          <div className="w-14 h-14 rounded-full bg-accent-red text-white flex items-center justify-center shadow-rec-glow transform scale-80 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </div>
        </button>
      </div>

      {/* Card Details */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-content-muted font-mono mb-2">
            <Calendar className="w-3.5 h-3.5 text-accent-red" />
            <span>{formatDate(item.publishedAt || item.createdAt)}</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-accent-red transition-colors font-khmer">
            {item.title}
          </h3>

          <p className="text-xs sm:text-sm text-content-secondary line-clamp-2 leading-relaxed mb-4 font-khmer">
            {item.description}
          </p>
        </div>

        {/* Action Bar */}
        <div className="pt-3 border-t border-border/60 flex items-center justify-between font-khmer">
          <span className="text-[11px] font-mono text-content-muted">
            {item.videoProvider ? item.videoProvider.toUpperCase() : 'VIDEO'}
          </span>

          <button
            type="button"
            onClick={() => onPlayClick(item)}
            className="text-xs font-semibold text-accent-red hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <span>{t.portfolio.watchNow}</span>
            <Play className="w-3 h-3 fill-accent-red hover:fill-white ml-0.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
