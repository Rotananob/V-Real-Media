import React, { useState } from 'react';
import Hero from '../components/home/Hero';
import About from '../components/home/About';
import PortfolioGrid from '../components/home/PortfolioGrid';
import LatestPosts from '../components/home/LatestPosts';
import VideoModal from '../components/home/VideoModal';
import { BRAND } from '../config/brand';
import { Phone, Mail, ArrowRight, ShieldCheck, Film } from 'lucide-react';

export default function Home() {
  const [featuredModalOpen, setFeaturedModalOpen] = useState(false);

  // Default featured video for Hero watch button
  const featuredHeroVideo = {
    title: "V-REAL MEDIA Official Showcase",
    description: "Real Stories. Real People. Real Impact. A cinematic documentary look into Cambodian communities.",
    videoURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  };

  return (
    <div className="w-full">
      {/* Cinematic Hero */}
      <Hero onWatchClick={() => setFeaturedModalOpen(true)} />

      {/* About Section */}
      <About />

      {/* Featured Portfolio Grid */}
      <PortfolioGrid title="Featured Street Works" showAll={false} />

      {/* Latest Editorial Posts */}
      <LatestPosts />

      {/* Contact & Community Call to Action */}
      <section className="py-20 bg-background-primary relative overflow-hidden border-t border-border">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-red/5 via-transparent to-accent-red/5 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-accent-red/30 text-xs font-mono text-accent-red mb-6">
            <span className="w-2 h-2 rounded-full bg-accent-red animate-rec-pulse" />
            <span>HAVE A STORY TO SHARE?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight uppercase leading-tight mb-4">
            Do You Know An Untold Story?
          </h2>

          <p className="text-base sm:text-lg text-content-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            We are always listening. If you or someone in your community has a compelling, authentic story or an idea for a social awareness experiment, connect directly with our production crew.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`tel:${BRAND.contact.phone}`}
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-accent-red text-white text-sm font-semibold hover:bg-accent-darkRed shadow-rec-glow transition flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Call Us: {BRAND.contact.phoneDisplay}</span>
            </a>

            <a
              href={`mailto:${BRAND.contact.email}`}
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-surface-elevated border border-border text-white text-sm font-semibold hover:border-accent-red/60 transition flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4 text-accent-red" />
              <span>Email: {BRAND.contact.email}</span>
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
