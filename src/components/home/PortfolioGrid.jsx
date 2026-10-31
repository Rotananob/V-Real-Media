import React, { useState } from 'react';
import { usePortfolio } from '../../hooks/usePortfolio';
import PortfolioCard from './PortfolioCard';
import VideoModal from './VideoModal';
import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';
import { useLanguage } from '../../context/LanguageContext';
import { Film } from 'lucide-react';

export default function PortfolioGrid({ title, showAll = false }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeVideo, setActiveVideo] = useState(null);
  const { portfolio, loading } = usePortfolio(selectedCategory);
  const { t, language } = useLanguage();

  const displayItems = showAll ? portfolio : portfolio.slice(0, 6);

  const categories = [
    { id: "all", name: t.categories.all },
    { id: "street-reality", name: t.categories["street-reality"] },
    { id: "social-experiment", name: t.categories["social-experiment"] },
    { id: "documentary", name: t.categories.documentary },
    { id: "human-stories", name: t.categories["human-stories"] },
  ];

  return (
    <section id="portfolio" className="py-24 bg-[#FAFAFA] border-b border-neutral-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-accent-red" />
              <span className="text-xs font-mono uppercase tracking-widest text-accent-red font-semibold">
                {t.portfolio.sectionBadge}
              </span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight ${
              language === 'km' ? 'font-khmer' : 'font-display uppercase'
            }`}>
              {title || t.portfolio.title}
            </h2>
            <p className="text-sm text-neutral-600 mt-2 font-khmer">
              {t.portfolio.subtitle}
            </p>
          </div>

          {/* Category Filters (Clean GitHub 2026 Style Segmented Controls) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none bg-neutral-100 p-1 rounded-xl border border-neutral-200">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium font-khmer whitespace-nowrap transition-all duration-150 ${
                  selectedCategory === cat.id
                    ? 'bg-white text-neutral-900 font-bold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <Loader size="lg" text="កំពុងទាញយកវីដេអូ..." />
        ) : displayItems.length === 0 ? (
          <EmptyState
            title={t.portfolio.emptyTitle}
            description={t.portfolio.emptyDesc}
            icon={Film}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayItems.map((item) => (
              <PortfolioCard
                key={item.id}
                item={item}
                onPlayClick={(selected) => setActiveVideo(selected)}
              />
            ))}
          </div>
        )}

      </div>

      {/* Video Modal Player */}
      <VideoModal
        isOpen={Boolean(activeVideo)}
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
      />
    </section>
  );
}
