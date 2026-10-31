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
    <div className="w-full bg-[#FAFAFA]">
      {/* Cinematic Clean Hero */}
      <Hero onWatchClick={() => setFeaturedModalOpen(true)} />

      {/* About Section */}
      <About />

      {/* Featured Portfolio Grid */}
      <PortfolioGrid title={t.portfolio.title} showAll={false} />

      {/* Latest Editorial Posts */}
      <LatestPosts />

      {/* Human Contact & Community Call to Action (Clean Light Design) */}
      <section className="py-20 bg-white border-t border-neutral-200 font-khmer">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs text-neutral-700 mb-6 font-medium">
            <span className="w-2 h-2 rounded-full bg-accent-red" />
            <span>{t.cta.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight mb-4">
            {t.cta.title}
          </h2>

          <p className="text-base text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t.cta.desc}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`tel:${BRAND.contact.phone}`}
              className="w-full sm:w-auto px-7 py-3 rounded-lg bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800 transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Phone className="w-4 h-4 text-accent-red" />
              <span>{t.cta.callBtn}</span>
            </a>

            <a
              href={`mailto:${BRAND.contact.email}`}
              className="w-full sm:w-auto px-7 py-3 rounded-lg bg-white border border-neutral-200 text-neutral-800 text-sm font-semibold hover:bg-neutral-50 transition flex items-center justify-center gap-2 shadow-sm"
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
