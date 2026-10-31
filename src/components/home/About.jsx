import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Target, Compass, Film, HeartHandshake, ShieldCheck } from 'lucide-react';
import { BRAND } from '../../config/brand';

export default function About() {
  return (
    <section id="about" className="py-24 bg-background-secondary border-t border-border relative overflow-hidden">
      {/* Background flare */}
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-accent-red/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-accent-red" />
            <span className="text-xs font-mono uppercase tracking-widest text-accent-red font-semibold">
              ABOUT V-REAL MEDIA
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight uppercase leading-tight">
            We don’t create staged fiction. We document <span className="text-accent-red">human truth</span>.
          </h2>
        </div>

        {/* 2-Column Editorial Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          {/* Left Column: Visual Claymorphic Emblem & Identity Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md rounded-2xl overflow-hidden border border-border bg-surface p-4 shadow-surface-card group">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-black/60 flex items-center justify-center">
                <img
                  src="/assets/logo.jpg"
                  alt="V-Real Media Emblem"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Viewfinder overlay */}
                <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 text-[10px] font-mono text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-red animate-rec-pulse" />
                  AUTHENTIC EMBLEM
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs text-content-muted font-mono">
                <span>V-REAL MEDIA BRAND</span>
                <span className="text-accent-red">EST. CAMBODIA</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Mission & Documentary Philosophy */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="space-y-4 text-content-secondary leading-relaxed text-base sm:text-lg">
              <p>
                <strong className="text-white font-medium">V-REAL MEDIA</strong> was founded with a singular conviction: real-life human stories hold more raw power, emotional gravity, and empathy than any artificial script.
              </p>
              <p>
                Our production team enters the streets, communities, and villages of Cambodia to document genuine human experiences. Through high-impact street reality shows and thoughtfully constructed social experiments, we bring the authentic voices of everyday people into the cinematic spotlight.
              </p>
            </div>

            {/* Mission & Vision Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-5 rounded-xl bg-surface border border-border hover:border-accent-red/40 transition">
                <div className="w-8 h-8 rounded-lg bg-accent-red/10 border border-accent-red/30 flex items-center justify-center text-accent-red mb-3">
                  <Target className="w-4 h-4" />
                </div>
                <h4 className="text-base font-heading font-bold text-white mb-1.5">Our Mission</h4>
                <p className="text-xs text-content-secondary leading-relaxed">
                  To capture unvarnished human journeys and execute ethical social experiments that bridge communities and stimulate social awareness.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-surface border border-border hover:border-accent-red/40 transition">
                <div className="w-8 h-8 rounded-lg bg-accent-red/10 border border-accent-red/30 flex items-center justify-center text-accent-red mb-3">
                  <Compass className="w-4 h-4" />
                </div>
                <h4 className="text-base font-heading font-bold text-white mb-1.5">Our Vision</h4>
                <p className="text-xs text-content-secondary leading-relaxed">
                  To stand as Cambodia's premier cinematic documentary and street reality media platform, inspiring empathy, awareness, and honest conversations.
                </p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BRAND.pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-xl bg-surface/70 border border-border hover:border-accent-red/50 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-accent-red uppercase px-2 py-0.5 rounded bg-accent-red/10 border border-accent-red/20 inline-block mb-3">
                  {pillar.tag}
                </span>
                <h3 className="text-lg font-heading font-bold text-white mb-2 group-hover:text-accent-red transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-content-secondary leading-relaxed">
                  {pillar.description}
                </p>
              </div>
              
              <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-[11px] font-mono text-content-muted">
                <span>0{index + 1} // PILLAR</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent-red" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
