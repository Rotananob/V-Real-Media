import React, { useState } from 'react';
import { usePortfolio } from '../../hooks/usePortfolio';
import PortfolioCard from './PortfolioCard';
import VideoModal from './VideoModal';
import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';
import { BRAND } from '../../config/brand';
import { Film } from 'lucide-react';

export default function PortfolioGrid({ title = "Featured Productions", showAll = false }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeVideo, setActiveVideo] = useState(null);
  const { portfolio, loading } = usePortfolio(selectedCategory);

  const displayItems = showAll ? portfolio : portfolio.slice(0, 6);

  return (
    <section id="portfolio" className="py-24 bg-background-primary relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-accent-red" />
              <span className="text-xs font-mono uppercase tracking-widest text-accent-red font-semibold">
                ORIGINAL WORKS
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight uppercase">
              {title}
            </h2>
            <p className="text-sm text-content-secondary mt-2">
              Explore authentic street reality captures, community experiments, and human-centric documentaries.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {BRAND.categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono uppercase tracking-wider whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'bg-accent-red text-white shadow-rec-glow'
                    : 'bg-surface border border-border text-content-secondary hover:text-white hover:border-border/80'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <Loader size="lg" text="Loading Productions..." />
        ) : displayItems.length === 0 ? (
          <EmptyState
            title="No Productions Found"
            description="We haven't added works to this category yet. Check back soon for new episodes."
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
