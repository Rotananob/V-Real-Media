import React, { useState } from 'react';
import { usePortfolio } from '../../hooks/usePortfolio';
import PortfolioCard from './PortfolioCard';
import VideoModal from './VideoModal';
import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';
import { useLanguage } from '../../context/LanguageContext';
import { BRAND } from '../../config/brand';
import { Film, Play, ExternalLink, Sparkles } from 'lucide-react';

export default function PortfolioGrid({ title, showAll = false }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeVideo, setActiveVideo] = useState(null);
  const { portfolio, loading } = usePortfolio(selectedCategory);
  const { t, language } = useLanguage();

  const displayItems = showAll ? portfolio : portfolio.slice(0, 6);

  const categories = [
    { id: "all", name: t.categories.all },
    { id: "creative", name: t.categories["creative"] || "ការច្នៃប្រឌិតថ្មី" },
    { id: "highlights", name: t.categories["highlights"] || "ឈុតពិសេស" },
    { id: "behind-the-scenes", name: t.categories["behind-the-scenes"] || "សកម្មភាពក្រៅឆាក" },
    { id: "special-editions", name: t.categories["special-editions"] || "ភាគពិសេស" },
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
          <div className="relative rounded-3xl bg-neutral-900 border border-neutral-800 text-white overflow-hidden p-8 sm:p-12 shadow-xl">
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent-red/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono text-neutral-300 mb-6 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-accent-red animate-pulse" />
                <span className="font-bold text-accent-red tracking-wider">EPISODE 01</span>
                <span className="text-neutral-500">|</span>
                <span>{language === 'km' ? 'កំពុងសម្រិតសម្រាំងក្នុងបន្ទប់កាត់ត' : 'IN POST-PRODUCTION'}</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4 font-khmer">
                {language === 'km' ? 'ភាគដំបូងនឹងមកដល់ក្នុងពេលឆាប់ៗនេះ' : 'Episode 01 Premiere Dropping Soon'}
              </h3>

              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl font-khmer">
                {language === 'km'
                  ? 'ក្រុមការងារពួកយើងកំពុងផ្ចិតផ្ចង់រៀបចំមាតិកាប្លែកភ្នែក ដើម្បីនាំយកស្នាមញញឹមជូនអ្នកទស្សនាទាំងអស់គ្នា។ វីដេអូភាគទី ១ នឹងត្រូវដាក់បញ្ចាំងនៅលើគេហទំព័រនេះភ្លាមៗនៅពេលសម្រេច ១០០%!'
                  : 'Our team is carefully fine-tuning our premiere episode to bring fresh perspectives and real smiles. It will be showcased right here as soon as editing wraps!'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 font-khmer">
                <button
                  type="button"
                  onClick={() => setActiveVideo({
                    title: language === 'km' ? "Teaser បឋម — V-REAL MEDIA" : "V-REAL MEDIA Official Teaser",
                    description: language === 'km' ? "ទស្សនីយភាពប្លែកភ្នែក ដើម្បីស្នាមញញឹមរបស់អ្នក" : "Fresh perspectives for genuine smiles",
                    videoURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  })}
                  className="px-6 py-3 rounded-xl bg-accent-red hover:bg-red-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md hover:scale-[1.02] cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{language === 'km' ? 'មើល Teaser បឋម' : 'Watch Premiere Teaser'}</span>
                </button>

                <a
                  href={BRAND.social.youtube.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white font-semibold text-xs sm:text-sm flex items-center gap-2 border border-white/10 transition-colors"
                >
                  <span>YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={BRAND.social.tiktok.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white font-semibold text-xs sm:text-sm flex items-center gap-2 border border-white/10 transition-colors"
                >
                  <span>TikTok</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
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
