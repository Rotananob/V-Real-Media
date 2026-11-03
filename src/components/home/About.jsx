import React from 'react';
import { motion } from 'framer-motion';
import { Target, Compass, Check } from 'lucide-react';
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
    <section id="vision" className="relative py-24 bg-white border-b border-neutral-200">
      <div id="about" className="absolute -top-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-accent-red" />
            <span className="text-xs font-mono uppercase tracking-widest text-accent-red font-semibold">
              {t.about.sectionBadge}
            </span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight ${
            language === 'km' ? 'font-khmer' : 'font-display uppercase'
          }`}>
            {t.about.mainTitle} <span className="text-accent-red">{t.about.truthHighlight}</span>
          </h2>
        </div>

        {/* 2-Column Editorial Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          {/* Left Column: Framed Logo Emblem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-50 p-4 shadow-sm">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-white border border-neutral-200 flex items-center justify-center">
                <img
                  src="/assets/logo.jpg"
                  alt="V-Real Media"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              <div className="pt-4 flex items-center justify-between text-xs text-neutral-500 font-khmer">
                <span>V-REAL • CREATIVE MEDIA</span>
                <span className="text-accent-red font-mono font-medium">CAMBODIA</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Mission & Narrative */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="space-y-4 text-neutral-600 leading-relaxed text-base sm:text-lg font-khmer">
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
            </div>

            {/* Factual Commitments */}
            <div className="pt-2 flex flex-wrap gap-3 text-xs font-khmer">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-800">
                <Check className="w-3.5 h-3.5 text-accent-red" />
                <span>{t.about.badge1}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-800">
                <Check className="w-3.5 h-3.5 text-accent-red" />
                <span>{t.about.badge2}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-800">
                <Check className="w-3.5 h-3.5 text-accent-red" />
                <span>{t.about.badge3}</span>
              </div>
            </div>

            {/* Mission & Vision Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 font-khmer">
              <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-200">
                <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-accent-red mb-3 shadow-xs">
                  <Target className="w-4 h-4" />
                </div>
                <h4 className="text-base font-bold text-neutral-900 mb-1.5">{t.about.missionTitle}</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {t.about.missionDesc}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-200">
                <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-accent-red mb-3 shadow-xs">
                  <Compass className="w-4 h-4" />
                </div>
                <h4 className="text-base font-bold text-neutral-900 mb-1.5">{t.about.visionTitle}</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {t.about.visionDesc}
                </p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* 4 Pillars Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-neutral-900 mb-6 font-khmer">
            {t.about.pillarsTitle}
          </h3>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 font-khmer">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="p-5 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 transition-all flex flex-col justify-between shadow-xs"
            >
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-accent-red uppercase px-2 py-0.5 rounded bg-red-50 border border-red-100 inline-block mb-3">
                  {pillar.tag}
                </span>
                <h4 className="text-base font-bold text-neutral-900 mb-2">
                  {pillar.title}
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
              
              <div className="mt-6 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span>0{index + 1}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent-red" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
