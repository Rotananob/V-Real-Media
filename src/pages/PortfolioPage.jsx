import React, { useState, useMemo } from 'react';
import { usePortfolio } from '../hooks/usePortfolio';
import PortfolioCard from '../components/home/PortfolioCard';
import VideoModal from '../components/home/VideoModal';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { BRAND } from '../config/brand';
import { Search, Film, Sparkles } from 'lucide-react';

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);

  const { portfolio, loading } = usePortfolio(selectedCategory);

  const filteredPortfolio = useMemo(() => {
    if (!searchQuery.trim()) return portfolio;
    const q = searchQuery.toLowerCase().trim();
    return portfolio.filter(
      (item) =>
        item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
    );
  }, [portfolio, searchQuery]);

  return (
    <div className="pt-28 pb-24 bg-background-primary min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-accent-red animate-rec-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-accent-red font-semibold">
              DOCUMENTARY ARCHIVE
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white uppercase tracking-tight mb-4">
            Cinematic Works
          </h1>

          <p className="text-base text-content-secondary leading-relaxed">
            Browse our full archive of street reality episodes, documentary features, and social experiments.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-border">
          
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
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

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-content-muted" />
            <input
              type="text"
              placeholder="Search works..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-lg bg-surface border border-border focus:border-accent-red focus:outline-none text-white placeholder-content-muted"
            />
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <Loader size="lg" text="Loading Portfolio Gallery..." />
        ) : filteredPortfolio.length === 0 ? (
          <EmptyState
            title="No Matching Productions"
            description={
              searchQuery
                ? `No productions found matching "${searchQuery}". Try a different term or clear the filter.`
                : "No productions available in this category yet."
            }
            icon={Film}
            action={
              searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 text-xs rounded-lg bg-surface border border-border text-accent-red hover:text-white"
                >
                  Clear Search
                </button>
              ) : null
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortfolio.map((item) => (
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
    </div>
  );
}
