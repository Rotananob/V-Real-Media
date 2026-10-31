import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function Hero({ onWatchClick }) {
  const { language, t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Background Cinematic Texture & Vignette */}
      <div className="absolute inset-0 z-0 bg-background-primary">
        {/* Subtle texture grid */}
        <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px]" />
        
        {/* Dramatic radial dark gradient overlay */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-background-primary/75 to-background-primary" />
        <div className="absolute inset-0 bg-gradient-to-t from-background-primary via-background-primary/50 to-transparent" />
        
        {/* Ambient warm red flare */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-accent-red/10 blur-[140px] rounded-full pointer-events-none" />
      </div>

      {/* Cinematic Viewfinder / Camera HUD Accents */}
      <div className="absolute inset-6 sm:inset-12 pointer-events-none border border-white/5 rounded-2xl flex flex-col justify-between p-4 sm:p-6 select-none">
        <div className="flex justify-between items-start text-[11px] font-mono text-content-muted">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-red animate-rec-pulse" />
            <span className="text-accent-red font-bold tracking-widest uppercase">{t.hero.recStatus}</span>
          </div>
          <div className="tracking-widest hidden sm:block">
            ISO 400 • 1/50 • F/2.8 • 24fps
          </div>
        </div>

        <div className="flex justify-between items-end text-[11px] font-mono text-content-muted">
          <div>
            CAM 01 // V-REAL PHNOM PENH
          </div>
          <div className="tracking-widest text-white/40">
            TC 00:08:42:19
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Live Production Tag Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-elevated/90 border border-border text-xs text-content-secondary mb-8 shadow-human-card"
        >
          <span className="w-2 h-2 rounded-full bg-accent-red" />
          <span className="font-khmer font-medium text-content-primary">
            {t.hero.liveTag}
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white uppercase leading-[1.12] mb-6 ${
            language === 'km' ? 'font-khmer' : 'font-display'
          }`}
        >
          {t.hero.headlineLine1}<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-content-secondary">
            {t.hero.headlineLine2}
          </span><br />
          <span className="text-accent-red text-glow">
            {t.hero.headlineLine3}
          </span>
        </motion.h1>

        {/* Human Story Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-xl text-content-secondary max-w-3xl mx-auto font-normal leading-relaxed mb-10 font-khmer"
        >
          {t.hero.description}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/portfolio"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-accent-red text-white font-semibold text-sm hover:bg-accent-darkRed shadow-rec-glow transition-all duration-300 flex items-center justify-center gap-2 group font-khmer"
          >
            <span>{t.hero.ctaExplore}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <button
            type="button"
            onClick={onWatchClick}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-surface-elevated hover:bg-surface border border-border hover:border-accent-red/50 text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2.5 group font-khmer"
          >
            <div className="w-6 h-6 rounded-full bg-accent-red/20 border border-accent-red flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-2.5 h-2.5 fill-accent-red text-accent-red ml-0.5" />
            </div>
            <span>{t.hero.ctaWatch}</span>
          </button>
        </motion.div>

        {/* Human Production Highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 mt-16 border-t border-border/70 text-left"
        >
          <div className="p-4 rounded-xl bg-surface/50 border border-border/50">
            <span className="text-2xl sm:text-3xl font-display font-bold text-white block mb-1">
              {t.hero.stat1Number}
            </span>
            <span className="text-xs text-content-muted font-khmer block leading-tight">
              {t.hero.stat1Label}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-surface/50 border border-border/50">
            <span className="text-2xl sm:text-3xl font-display font-bold text-white block mb-1">
              {t.hero.stat2Number}
            </span>
            <span className="text-xs text-content-muted font-khmer block leading-tight">
              {t.hero.stat2Label}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-surface/50 border border-border/50">
            <span className="text-2xl sm:text-3xl font-display font-bold text-white block mb-1">
              {t.hero.stat3Number}
            </span>
            <span className="text-xs text-content-muted font-khmer block leading-tight">
              {t.hero.stat3Label}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-surface/50 border border-border/50">
            <span className="text-2xl sm:text-3xl font-display font-bold text-accent-red block mb-1">
              {t.hero.stat4Number}
            </span>
            <span className="text-xs text-content-muted font-khmer block leading-tight">
              {t.hero.stat4Label}
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
