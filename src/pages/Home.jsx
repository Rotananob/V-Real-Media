import React, { useState } from 'react';
import Hero from '../components/home/Hero';
import About from '../components/home/About';
import PortfolioGrid from '../components/home/PortfolioGrid';
import LatestPosts from '../components/home/LatestPosts';
import VideoModal from '../components/home/VideoModal';
import { BRAND } from '../config/brand';
import { Phone, Mail, MapPin, ExternalLink, Zap, Eye, Video, Share2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const [featuredModalOpen, setFeaturedModalOpen] = useState(false);
  const { t, language } = useLanguage();

  const featuredHeroVideo = {
    title: language === 'km' ? "វីដេអូបង្ហាញពីសកម្មភាព V-REAL MEDIA" : "V-REAL MEDIA Official Showcase",
    description: language === 'km' 
      ? "ការពិសោធន៍សង្គម និងតថភាពលើដងផ្លូវកម្ពុជា — គ្មានស្គ្រីប គ្មានការសម្តែង ឆក់យកការចាប់អារម្មណ៍ពិត ១០០%។" 
      : "Cambodian street reality & viral social experiments — 100% raw, unscripted engagement.",
    videoURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  };

  return (
    <div className="w-full bg-[#FAFAFA]">
      {/* Cinematic Clean Hero with 2026 Interactive Teaser & Scroll Parallax */}
      <Hero 
        onWatchTeaser={() => setFeaturedModalOpen(true)} 
        onWatchClick={() => setFeaturedModalOpen(true)} 
      />

      {/* About Section (Vision, Mission, Pillars) */}
      <About />

      {/* Brand & Sponsor Partnership Section (Gen Z & Viral Media Kit) */}
      <section id="sponsors" className="py-24 bg-[#FAFAFA] border-t border-b border-neutral-200 font-khmer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-16">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-accent-red" />
              <span className="text-xs font-mono uppercase tracking-widest text-accent-red font-semibold">
                {t.sponsors.badge}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight mb-4">
              {t.sponsors.title}
            </h2>

            <p className="text-base text-neutral-600 leading-relaxed">
              {t.sponsors.subtitle}
            </p>
          </div>

          {/* 4 Value Pillars for Brands */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-accent-red mb-4">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-2">
                  {t.sponsors.point1Title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {t.sponsors.point1Desc}
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-neutral-100 text-[11px] font-mono text-neutral-400">
                HIGH RETENTION
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-accent-red mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-2">
                  {t.sponsors.point2Title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {t.sponsors.point2Desc}
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-neutral-100 text-[11px] font-mono text-neutral-400">
                ORGANIC INTEGRATION
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-accent-red mb-4">
                  <Video className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-2">
                  {t.sponsors.point3Title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {t.sponsors.point3Desc}
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-neutral-100 text-[11px] font-mono text-neutral-400">
                CINEMATIC 4K
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-accent-red mb-4">
                  <Share2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-2">
                  {t.sponsors.point4Title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {t.sponsors.point4Desc}
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-neutral-100 text-[11px] font-mono text-neutral-400">
                VIRAL SOCIAL REACH
              </div>
            </div>
          </div>

          {/* Quick Collab Pitch Card */}
          <div className="p-8 rounded-2xl bg-neutral-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div>
              <h3 className="text-xl font-bold mb-2">
                {language === 'km' ? 'តើអ្នកតំណាងឱ្យ Brand, Agency ឬផលិតផលមែនទេ?' : 'Representing a Brand, Agency, or Product?'}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed">
                {language === 'km' 
                  ? 'ទាក់ទងមកយើងឥឡូវនេះ ដើម្បីពិភាក្សាអំពីកញ្ចប់ឧបត្ថម្ភ (Sponsorship Packages) និងការបញ្ជ្រាប Brand ក្នុងមាតិកា Viral លើដងផ្លូវកម្ពុជា។'
                  : 'Get in touch directly with our creator team to discuss custom sponsorship packages, product placements, and viral street activations.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <a
                href={`tel:${BRAND.contact.phone}`}
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-accent-red hover:bg-accent-darkRed text-white text-xs font-semibold transition flex items-center justify-center gap-2 shadow-xs"
              >
                <Phone className="w-4 h-4" />
                <span>{language === 'km' ? 'ទូរស័ព្ទសហការ' : 'Call Sponsorship'}: {BRAND.contact.phoneDisplay}</span>
              </a>

              <a
                href={`mailto:${BRAND.contact.email}?subject=Brand%20Sponsorship%20Inquiry%20-%20V-REAL%20MEDIA`}
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition flex items-center justify-center gap-2 border border-white/15"
              >
                <Mail className="w-4 h-4" />
                <span>{language === 'km' ? 'ផ្ញើអ៊ីមែលសហការ' : 'Email Sponsorship'}</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Portfolio Grid (Street Reality, Social Experiments, Documentaries) */}
      <PortfolioGrid title={t.portfolio.title} showAll={false} />

      {/* Latest Editorial Posts & Field Notes */}
      <div id="news">
        <LatestPosts />
      </div>

      {/* All-in-One Direct Contact Section (Clean Human Design) */}
      <section id="contact" className="py-24 bg-white border-t border-neutral-200 font-khmer">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-accent-red" />
              <span className="text-xs font-mono uppercase tracking-widest text-accent-red font-semibold">
                {t.cta.badge}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight mb-4">
              {t.cta.title}
            </h2>

            <p className="text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              {t.cta.desc}
            </p>
          </div>

          {/* Contact Direct Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {/* Phone Direct */}
            <a
              href={`tel:${BRAND.contact.phone}`}
              className="p-6 rounded-2xl bg-[#FAFAFA] border border-neutral-200 hover:border-neutral-300 hover:shadow-xs transition group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-accent-red mb-4 group-hover:scale-105 transition">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-xs text-neutral-500 font-mono block mb-1">
                  {language === 'km' ? 'ទូរស័ព្ទផ្ទាល់' : 'Direct Phone'}
                </span>
                <span className="text-lg font-bold text-neutral-900 font-mono block">
                  {BRAND.contact.phoneDisplay}
                </span>
              </div>
              <span className="mt-4 text-xs font-medium text-accent-red flex items-center gap-1">
                <span>{language === 'km' ? 'ហៅចេញឥឡូវនេះ' : 'Call directly'}</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </a>

            {/* Email Direct */}
            <a
              href={`mailto:${BRAND.contact.email}`}
              className="p-6 rounded-2xl bg-[#FAFAFA] border border-neutral-200 hover:border-neutral-300 hover:shadow-xs transition group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-accent-red mb-4 group-hover:scale-105 transition">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-xs text-neutral-500 font-mono block mb-1">
                  {language === 'km' ? 'អ៊ីមែលផលិតកម្ម' : 'Production Email'}
                </span>
                <span className="text-base font-bold text-neutral-900 break-all block">
                  {BRAND.contact.email}
                </span>
              </div>
              <span className="mt-4 text-xs font-medium text-accent-red flex items-center gap-1">
                <span>{language === 'km' ? 'ផ្ញើសារឥឡូវនេះ' : 'Send inquiry'}</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </a>

            {/* Official Studio Location */}
            <div className="p-6 rounded-2xl bg-[#FAFAFA] border border-neutral-200 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-accent-red mb-4">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-xs text-neutral-500 font-mono block mb-1">
                  {language === 'km' ? 'ទីតាំងផលិតកម្ម' : 'Production Base'}
                </span>
                <span className="text-base font-bold text-neutral-900 block">
                  {BRAND.contact.location}
                </span>
              </div>
              <span className="mt-4 text-xs text-neutral-500">
                {language === 'km' ? 'ចុះថតផ្ទាល់ទូទាំងប្រទេសកម្ពុជា' : 'Operating nationwide'}
              </span>
            </div>
          </div>

          {/* Social Channels Pill row */}
          <div className="p-6 rounded-2xl bg-neutral-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-base font-bold mb-1">
                {language === 'km' ? 'តាមដានបណ្តាញសង្គមផ្លូវការ V-REAL' : 'Follow V-REAL Official Channels'}
              </h3>
              <p className="text-xs text-neutral-400">
                {language === 'km' ? 'ទស្សនាវីដេអូប្រចាំថ្ងៃ ឈុតក្រៅឆាក និងរឿងរ៉ាវថ្មីៗ' : 'Daily street reels, behind-the-scenes, and updates'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={BRAND.social.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition flex items-center gap-2 border border-white/15"
              >
                <span>TikTok: {BRAND.social.tiktok.handle}</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href={BRAND.social.youtube.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-accent-red hover:bg-accent-darkRed text-white text-xs font-semibold transition flex items-center gap-2 shadow-xs"
              >
                <span>YouTube: {BRAND.social.youtube.handle}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
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
