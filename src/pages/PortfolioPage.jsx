import React, { useState, useMemo } from 'react';
import { usePortfolio } from '../hooks/usePortfolio';
import PortfolioCard from '../components/home/PortfolioCard';
import VideoModal from '../components/home/VideoModal';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { useLanguage } from '../context/LanguageContext';
import { Search, Film } from 'lucide-react';

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);
  const { t, language } = useLanguage();

  const { portfolio, loading } = usePortfolio(selectedCategory);

  const categories = [
    { id: "all", name: t.categories.all },
    { id: "street-reality", name: t.categories["street-reality"] },
    { id: "social-experiment", name: t.categories["social-experiment"] },
    { id: "documentary", name: t.categories.documentary },
    { id: "human-stories", name: t.categories["human-stories"] },
  ];

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
    <div className="pt-28 pb-24 bg-background-primary min-h-screen font-khmer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-accent-red animate-rec-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-accent-red font-semibold">
              {t.portfolio.sectionBadge}
            </span>
          </div>

          <h1 className={`text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 ${
            language === 'km' ? 'font-khmer' : 'font-display uppercase'
          }`}>
            {t.portfolio.title}
          </h1>

          <p className="text-base text-content-secondary leading-relaxed">
            {t.portfolio.subtitle}
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-border">
          
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-khmer whitespace-nowrap transition-all duration-200 ${
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
              placeholder={t.portfolio.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-lg bg-surface border border-border focus:border-accent-red focus:outline-none text-white placeholder-content-muted"
            />
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <Loader size="lg" text="កំពុងទាញយកវីដេអូ..." />
        ) : filteredPortfolio.length === 0 ? (
          <EmptyState
            title={t.portfolio.emptyTitle}
            description={
              searchQuery
                ? `រកមិនឃើញវីដេអូដែលត្រូវនឹងពាក្យ "${searchQuery}" ឡើយ។`
                : t.portfolio.emptyDesc
            }
            icon={Film}
            action={
              searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 text-xs rounded-lg bg-surface border border-border text-accent-red hover:text-white"
                >
                  សម្អាតការស្វែងរក
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
