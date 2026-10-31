import React from 'react';
import { motion } from 'framer-motion';
import { Target, Compass, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function About() {
  const { t, language } = useLanguage();

  const pillars = [
    t.about.pillar1,
    t.about.pillar2,
    t.about.pillar3,
    t.about.pillar4,
  ];

  return (
    <section id="about" className="py-24 bg-background-secondary border-t border-border relative overflow-hidden">
      {/* Background warm flare */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent-red/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-accent-red" />
            <span className="text-xs font-mono uppercase tracking-widest text-accent-red font-semibold">
              {t.about.sectionBadge}
            </span>
          </div>
          <h2 className={`text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight ${
            language === 'km' ? 'font-khmer' : 'font-display uppercase'
          }`}>
            {t.about.mainTitle} <span className="text-accent-red">{t.about.truthHighlight}</span>
          </h2>
        </div>

        {/* 2-Column Editorial Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          {/* Left Column: Authentic Framed Emblem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md rounded-2xl overflow-hidden border border-border bg-surface p-4 shadow-human-card group">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-black flex items-center justify-center">
                <img
                  src="/assets/logo.jpg"
                  alt="V-Real Media Emblem"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Viewfinder overlay */}
                <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 text-[10px] font-mono text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-red animate-rec-pulse" />
                  AUTHENTIC EMBLEM
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs text-content-muted font-khmer">
                <span>ស្ទូឌីយោ V-REAL MEDIA</span>
                <span className="text-accent-red font-mono">PHNOM PENH, CAMBODIA</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Mission & Documentary Philosophy */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="space-y-4 text-content-secondary leading-relaxed text-base sm:text-lg font-khmer">
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
            </div>

            {/* Badges */}
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-khmer text-content-muted">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border">
                <CheckCircle className="w-4 h-4 text-accent-red" />
                <span className="text-content-primary">{t.about.badge1}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border">
                <CheckCircle className="w-4 h-4 text-accent-red" />
                <span className="text-content-primary">{t.about.badge2}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border">
                <CheckCircle className="w-4 h-4 text-accent-red" />
                <span className="text-content-primary">{t.about.badge3}</span>
              </div>
            </div>

            {/* Mission & Vision Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 font-khmer">
              <div className="p-5 rounded-xl bg-surface border border-border hover:border-accent-red/40 transition">
                <div className="w-9 h-9 rounded-lg bg-accent-red/10 border border-accent-red/30 flex items-center justify-center text-accent-red mb-3">
                  <Target className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">{t.about.missionTitle}</h4>
                <p className="text-xs text-content-secondary leading-relaxed">
                  {t.about.missionDesc}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-surface border border-border hover:border-accent-red/40 transition">
                <div className="w-9 h-9 rounded-lg bg-accent-red/10 border border-accent-red/30 flex items-center justify-center text-accent-red mb-3">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">{t.about.visionTitle}</h4>
                <p className="text-xs text-content-secondary leading-relaxed">
                  {t.about.visionDesc}
                </p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* 4 Pillars Grid */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-6 font-khmer">
            {t.about.pillarsTitle}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-khmer">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-6 rounded-xl bg-surface/80 border border-border hover:border-accent-red/50 transition-all duration-300 group flex flex-col justify-between shadow-human-card"
            >
              <div>
                <span className="text-[11px] font-mono font-bold tracking-widest text-accent-red uppercase px-2.5 py-0.5 rounded bg-accent-red/10 border border-accent-red/20 inline-block mb-3">
                  {pillar.tag}
                </span>
                <h4 className="text-lg font-bold text-white mb-2 group-hover:text-accent-red transition-colors">
                  {pillar.title}
                </h4>
                <p className="text-xs text-content-secondary leading-relaxed">
                  {pillar.desc}
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
