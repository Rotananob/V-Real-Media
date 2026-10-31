import React from 'react';
import { Play, Sparkles, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import { useLanguage } from '../../context/LanguageContext';

export default function PortfolioCard({ item, onPlayClick }) {
  const { t } = useLanguage();
  const thumbnail = item.thumbnailURL || '/assets/logo.jpg';
  const categoryName = t.categories[item.category] || item.category || 'Media';

  return (
    <div className="group relative rounded-xl overflow-hidden bg-white border border-neutral-200 hover:border-neutral-300 transition-all duration-200 flex flex-col h-full shadow-sm hover:shadow-md">
      
      {/* Thumbnail Aspect Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
        <img
          src={thumbnail}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/assets/logo.jpg';
          }}
        />

        {/* Featured Badge */}
        {item.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent-red text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm font-khmer">
            <Sparkles className="w-3 h-3" />
            <span>{t.portfolio.featured}</span>
          </div>
        )}

        {/* Category Pill */}
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-white/90 backdrop-blur-sm border border-neutral-200 text-[10px] font-khmer font-medium text-neutral-800 shadow-xs">
          {categoryName}
        </div>

        {/* Play Button Trigger */}
        <button
          type="button"
          onClick={() => onPlayClick(item)}
          className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          aria-label={`Play ${item.title}`}
        >
          <div className="w-12 h-12 rounded-full bg-white text-accent-red flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-200">
            <Play className="w-5 h-5 fill-accent-red ml-0.5" />
          </div>
        </button>
      </div>

      {/* Card Details */}
      <div className="p-5 flex flex-col flex-grow justify-between bg-white">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono mb-2">
            <Calendar className="w-3.5 h-3.5 text-accent-red" />
            <span>{formatDate(item.publishedAt || item.createdAt)}</span>
          </div>

          <h3 className="text-base font-bold text-neutral-900 mb-2 line-clamp-2 group-hover:text-accent-red transition-colors font-khmer">
            {item.title}
          </h3>

          <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-4 font-khmer">
            {item.description}
          </p>
        </div>

        {/* Action Bar */}
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between font-khmer">
          <span className="text-[11px] font-mono text-neutral-400">
            {item.videoProvider ? item.videoProvider.toUpperCase() : 'VIDEO'}
          </span>

          <button
            type="button"
            onClick={() => onPlayClick(item)}
            className="text-xs font-semibold text-accent-red hover:text-neutral-900 flex items-center gap-1 transition-colors"
          >
            <span>{t.portfolio.watchNow}</span>
            <Play className="w-3 h-3 fill-accent-red ml-0.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
