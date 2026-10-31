import React from 'react';
import { motion } from 'framer-motion';
import { Target, Compass, Film, HeartHandshake, Shield, Sparkles, CheckCircle, Video } from 'lucide-react';
import { BRAND } from '../config/brand';

export default function AboutPage() {
  return (
    <div className="pt-28 pb-24 bg-background-primary min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-accent-red/30 text-xs font-mono text-accent-red mb-4">
            <span className="w-2 h-2 rounded-full bg-accent-red animate-rec-pulse" />
            <span>BEHIND V-REAL MEDIA</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-white uppercase tracking-tight leading-tight mb-6">
            The Lens of Reality
          </h1>

          <p className="text-base sm:text-lg text-content-secondary leading-relaxed">
            Discover the philosophy, ethos, and production principles behind our street reality shows and documentary cinema.
          </p>
        </div>

        {/* Featured Visual & Emblem Showcase */}
        <div className="relative rounded-2xl overflow-hidden border border-border bg-surface-elevated mb-20 p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden border border-border bg-surface p-4 shadow-rec-glow/10">
                <img
                  src="/assets/logo.jpg"
                  alt="V-Real Media Original Frame"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>

            <div className="lg:col-span-8 space-y-5">
              <span className="text-xs font-mono text-accent-red uppercase tracking-widest font-semibold block">
                ORIGIN STORY & PURPOSE
              </span>

              <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-white leading-tight">
                Born From The Streets. Driven By Real Human Stories.
              </h2>

              <p className="text-sm sm:text-base text-content-secondary leading-relaxed">
                V-REAL MEDIA began with a simple camera and a profound respect for authentic everyday narratives. In a digital world saturated with exaggerated filters and choreographed social media trends, we choose honesty.
              </p>

              <p className="text-sm sm:text-base text-content-secondary leading-relaxed">
                We believe that every street vendor, night-shift worker, artisan, and student has a story rich with human dignity, struggle, and inspiration. We don’t manipulate reality; we frame it with cinematic clarity.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-content-muted">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-accent-red" />
                  <span>Unscripted Dialogue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-accent-red" />
                  <span>Ethical Consent</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-accent-red" />
                  <span>Community Respect</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Mission & Vision Detailed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="p-8 rounded-2xl bg-surface border border-border relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-accent-red/10 border border-accent-red/30 flex items-center justify-center text-accent-red mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-white mb-3">Our Mission</h3>
            <p className="text-sm sm:text-base text-content-secondary leading-relaxed mb-4">
              To record and broadcast real-world social experiments, street interactions, and human documentaries that challenge preconceptions, promote mutual empathy, and awaken social responsibility across Cambodia and international audiences.
            </p>
            <ul className="space-y-2 text-xs font-mono text-content-muted">
              <li>• Honor human dignity in all documentary captures</li>
              <li>• Highlight uncelebrated grassroots heroes</li>
              <li>• Foster empathy across socio-economic boundaries</li>
            </ul>
          </div>

          <div className="p-8 rounded-2xl bg-surface border border-border relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-accent-red/10 border border-accent-red/30 flex items-center justify-center text-accent-red mb-6">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-white mb-3">Our Vision</h3>
            <p className="text-sm sm:text-base text-content-secondary leading-relaxed mb-4">
              To be recognized as the standard for authentic, fearless, and cinematic street storytelling in Southeast Asia. We envision a media landscape where truth and human empathy triumph over sensationalism.
            </p>
            <ul className="space-y-2 text-xs font-mono text-content-muted">
              <li>• Expand production to all provinces in Cambodia</li>
              <li>• Set benchmarks for ethical social experiments</li>
              <li>• Mentor emerging documentary filmmakers</li>
            </ul>
          </div>
        </div>

        {/* Production Philosophy */}
        <div className="p-8 sm:p-12 rounded-2xl bg-surface border border-border/80 mb-20">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-mono text-accent-red uppercase tracking-widest font-semibold block mb-2">
              METHODOLOGY
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white">
              The V-REAL Production Standards
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="space-y-2">
              <span className="text-3xl font-display font-extrabold text-accent-red">01</span>
              <h4 className="text-lg font-heading font-bold text-white">Respect First</h4>
              <p className="text-xs text-content-secondary leading-relaxed">
                Before recording, we ensure every participant’s dignity is prioritized. We never exploit vulnerability for cheap virality.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-3xl font-display font-extrabold text-accent-red">02</span>
              <h4 className="text-lg font-heading font-bold text-white">Cinematic Craft</h4>
              <p className="text-xs text-content-secondary leading-relaxed">
                Even in fast-moving street environments, we apply top-tier cinematography, natural lighting, and crisp sound design.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-3xl font-display font-extrabold text-accent-red">03</span>
              <h4 className="text-lg font-heading font-bold text-white">Community Impact</h4>
              <p className="text-xs text-content-secondary leading-relaxed">
                Every video serves a purpose: sparking dialogue, supporting those in need, and uniting people through shared humanity.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
