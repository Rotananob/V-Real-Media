import React, { useState } from 'react';
import Hero from '../components/home/Hero';
import About from '../components/home/About';
import PortfolioGrid from '../components/home/PortfolioGrid';
import LatestPosts from '../components/home/LatestPosts';
import VideoModal from '../components/home/VideoModal';
import { BRAND } from '../config/brand';
import { Phone, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const [featuredModalOpen, setFeaturedModalOpen] = useState(false);
  const { t, language } = useLanguage();

  const featuredHeroVideo = {
    title: language === 'km' ? "វីដេអូបង្ហាញពីសកម្មភាព V-REAL MEDIA" : "V-REAL MEDIA Official Showcase",
    description: language === 'km' 
      ? "រឿងរ៉ាវពិត មនុស្សពិត ផលប៉ះពាល់ពិត។ ទិដ្ឋភាពភាពយន្តឯកសារនៃសហគមន៍កម្ពុជា។" 
      : "Real Stories. Real People. Real Impact. A cinematic documentary look into Cambodian communities.",
    videoURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  };

  return (
    <div className="w-full">
      {/* Cinematic Hero */}
      <Hero onWatchClick={() => setFeaturedModalOpen(true)} />

      {/* About Section */}
      <About />

      {/* Featured Portfolio Grid */}
      <PortfolioGrid title={t.portfolio.title} showAll={false} />

      {/* Latest Editorial Posts */}
      <LatestPosts />

      {/* Human Contact & Community Call to Action */}
      <section className="py-20 bg-background-primary relative overflow-hidden border-t border-border font-khmer">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-red/5 via-transparent to-accent-red/5 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-surface border border-accent-red/30 text-xs text-accent-red mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-accent-red animate-rec-pulse" />
            <span className="font-semibold">{t.cta.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            {t.cta.title}
          </h2>

          <p className="text-base sm:text-lg text-content-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            {t.cta.desc}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`tel:${BRAND.contact.phone}`}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-accent-red text-white text-sm font-semibold hover:bg-accent-darkRed shadow-rec-glow transition flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>{t.cta.callBtn}</span>
            </a>

            <a
              href={`mailto:${BRAND.contact.email}`}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-surface-elevated border border-border text-white text-sm font-semibold hover:border-accent-red/60 transition flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4 text-accent-red" />
              <span>{t.cta.emailBtn}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Featured Video Modal */}
      <VideoModal
        isOpen={featuredModalOpen}
        video={featuredHeroVideo}
        onClose={() => setFeaturedModalOpen(false)}
      />
    </div>
  );
}
