import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Video, Sparkles, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function Hero({ onWatchClick }) {
  const { language, t } = useLanguage();

  return (
    <section className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA] border-b border-neutral-200/80">
      
      {/* Subtle clean grid backdrop */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        
        {/* Editorial Tag Pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 text-xs text-neutral-600 mb-8 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-accent-red" />
          <span className="font-khmer font-medium text-neutral-800">
            {t.hero.liveTag}
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-900 leading-[1.15] mb-6 ${
            language === 'km' ? 'font-khmer' : 'font-display uppercase'
          }`}
        >
          {t.hero.headlineLine1} {t.hero.headlineLine2}<br />
          <span className="text-accent-red">
            {t.hero.headlineLine3}
          </span>
        </motion.h1>

        {/* Human Narrative Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed mb-10 font-khmer"
        >
          {t.hero.description}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            to="/portfolio"
            className="w-full sm:w-auto px-7 py-3 rounded-lg bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800 transition shadow-sm flex items-center justify-center gap-2 group font-khmer"
          >
            <span>{t.hero.ctaExplore}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <button
            type="button"
            onClick={onWatchClick}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-800 font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2 group font-khmer"
          >
            <Play className="w-4 h-4 fill-accent-red text-accent-red ml-0.5" />
            <span>{t.hero.ctaWatch}</span>
          </button>
        </motion.div>

        {/* Statistics Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-16 mt-16 border-t border-neutral-200 text-left font-khmer"
        >
          <div className="p-4 rounded-xl bg-white border border-neutral-200/80 shadow-sm">
            <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 block font-display mb-1">
              {t.hero.stat1Number}
            </span>
            <span className="text-xs text-neutral-500 block leading-tight">
              {t.hero.stat1Label}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-neutral-200/80 shadow-sm">
            <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 block font-display mb-1">
              {t.hero.stat2Number}
            </span>
            <span className="text-xs text-neutral-500 block leading-tight">
              {t.hero.stat2Label}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-neutral-200/80 shadow-sm">
            <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 block font-display mb-1">
              {t.hero.stat3Number}
            </span>
            <span className="text-xs text-neutral-500 block leading-tight">
              {t.hero.stat3Label}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-neutral-200/80 shadow-sm">
            <span className="text-2xl sm:text-3xl font-extrabold text-accent-red block font-display mb-1">
              {t.hero.stat4Number}
            </span>
            <span className="text-xs text-neutral-500 block leading-tight">
              {t.hero.stat4Label}
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
