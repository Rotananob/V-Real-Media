import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Play, Sparkles, Phone, Flame, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { BRAND } from '../../config/brand';

export default function Hero({ onWatchTeaser }) {
  const { language, t } = useLanguage();
  const containerRef = useRef(null);

  // Scroll-driven Parallax effect (GitHub 2026 Creative standard)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.94]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, -45]);

  // Dynamic Word Cycler (Fearless, viral, non-repetitive keywords)
  const words = t.hero.dynamicWords || [
    "ការពិសោធន៍សង្គម Viral",
    "សាកល្បងចិត្តមនុស្សពិត",
    "គ្មានស្គ្រីប គ្មានការសម្តែង",
    "ឆក់អារម្មណ៍រាប់លាននាក់",
  ];

  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2600);
    return () => clearInterval(timer);
  }, [words.length]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] sm:min-h-screen flex flex-col justify-between pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA] border-b border-neutral-200 overflow-hidden"
    >
      {/* 2D Cyber-Grid & Cinematic Ambient Glow Backdrop */}
      <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      
      {/* Ambient Red Lens Flare Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-accent-red/5 rounded-full blur-3xl pointer-events-none" />

      {/* Floating 2D Street Viewfinder Corner Brackets */}
      <div className="absolute top-28 left-6 sm:left-12 w-6 h-6 border-t-2 border-l-2 border-neutral-300 pointer-events-none hidden sm:block opacity-60" />
      <div className="absolute top-28 right-6 sm:right-12 w-6 h-6 border-t-2 border-r-2 border-neutral-300 pointer-events-none hidden sm:block opacity-60" />
      <div className="absolute bottom-24 left-6 sm:left-12 w-6 h-6 border-b-2 border-l-2 border-neutral-300 pointer-events-none hidden sm:block opacity-60" />
      <div className="absolute bottom-24 right-6 sm:right-12 w-6 h-6 border-b-2 border-r-2 border-neutral-300 pointer-events-none hidden sm:block opacity-60" />

      {/* Main Parallax Scroll Container */}
      <motion.div
        style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
        className="relative z-10 max-w-5xl mx-auto text-center flex-grow flex flex-col justify-center items-center"
      >
        {/* Live Camera REC HUD Badge with 2D Audio Visualizer */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-neutral-900 text-white border border-neutral-700/80 shadow-md backdrop-blur-md text-[11px] font-mono mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-red opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-red"></span>
          </span>
          <span className="font-bold tracking-widest text-accent-red">REC</span>
          <span className="text-neutral-500">|</span>
          <span className="text-neutral-300 font-semibold">4K 60FPS</span>
          <span className="text-neutral-500">|</span>
          {/* Animated 2D Audio Equalizer bars */}
          <div className="flex items-center gap-0.5 h-3">
            <span className="w-0.5 h-2 bg-accent-red animate-pulse" />
            <span className="w-0.5 h-3 bg-accent-red animate-pulse delay-75" />
            <span className="w-0.5 h-1.5 bg-accent-red animate-pulse delay-150" />
            <span className="w-0.5 h-2.5 bg-accent-red animate-pulse delay-100" />
          </div>
          <span className="text-neutral-500 hidden sm:inline">|</span>
          <span className="text-neutral-300 hidden sm:inline font-mono">PHNOM PENH LIVE</span>
        </motion.div>

        {/* Dynamic Kinetic Headline (Sliding Word Rotator) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <h1
            className={`text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-900 leading-[1.18] ${
              language === 'km' ? 'font-khmer' : 'font-display uppercase'
            }`}
          >
            <span className="block text-neutral-900">
              {t.hero.headlinePrefix || "តថភាពលើដងផ្លូវកម្ពុជា"}
            </span>

            {/* Rotator Container */}
            <span className="block mt-2 h-[1.3em] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: 25, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -25, filter: 'blur(6px)' }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="inline-block text-accent-red font-extrabold"
                >
                  {words[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>
        </motion.div>

        {/* High-Impact Gen Z Description (Unfiltered & Captivating) */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed mb-10 font-khmer"
        >
          {t.hero.description}
        </motion.p>

        {/* 2026 Creative Action Buttons (Magnetic Glow & Interactive Teaser) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-xl mx-auto font-khmer"
        >
          {/* Primary Action Button (Magnetic Crimson Shimmer) */}
          <a
            href="#portfolio"
            className="group relative w-full sm:w-auto px-7 py-3.5 rounded-xl bg-neutral-900 text-white font-bold text-sm transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_30px_rgba(217,4,41,0.35)] hover:scale-[1.02] flex items-center justify-center gap-2 overflow-hidden border border-neutral-800"
          >
            {/* Shimmer sweep */}
            <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-700 ease-out" />
            <Flame className="w-4 h-4 text-accent-red group-hover:animate-bounce" />
            <span>{t.hero.ctaWatch}</span>
            <ArrowDown className="w-4 h-4 text-neutral-400 group-hover:translate-y-0.5 transition-transform" />
          </a>

          {/* Secondary Action: Interactive Teaser Popup Trigger */}
          <button
            type="button"
            onClick={onWatchTeaser}
            className="group w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/90 hover:bg-white text-neutral-900 font-bold text-sm transition-all duration-200 shadow-xs hover:shadow-md border border-neutral-200 hover:border-neutral-400 flex items-center justify-center gap-2.5 backdrop-blur-sm cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-accent-red/10 border border-accent-red/20 flex items-center justify-center text-accent-red group-hover:scale-110 transition-transform">
              <Play className="w-3 h-3 fill-accent-red ml-0.5" />
            </div>
            <span>{t.hero.ctaTeaser || "មើល Teaser ក្តៅៗ"}</span>
          </button>

          {/* Tertiary Action: Brand Sponsor Gateway */}
          <a
            href="#sponsors"
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-sm transition-colors flex items-center justify-center gap-2 border border-neutral-200/80"
          >
            <Zap className="w-3.5 h-3.5 text-accent-red" />
            <span>{t.hero.ctaCollab || "សម្រាប់ Sponsors"}</span>
          </a>
        </motion.div>

        {/* Quick Direct Creator Contact Line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-500 font-khmer"
        >
          <span>ទូរស័ព្ទផ្ទាល់:</span>
          <a
            href={`tel:${BRAND.contact.phone}`}
            className="font-mono font-bold text-neutral-900 hover:text-accent-red underline transition-colors"
          >
            {BRAND.contact.phoneDisplay}
          </a>
          <span className="text-neutral-400">•</span>
          <span className="text-neutral-600">ឆ្លើយតបរហ័ស ២៤/៧</span>
        </motion.div>
      </motion.div>

      {/* 2D Infinite Marquee Ticker (GitHub 2026 Creative Creator Standard) */}
      <div className="relative z-10 w-full mt-12 pt-6 border-t border-neutral-200/70 overflow-hidden">
        <div className="flex whitespace-nowrap overflow-hidden select-none opacity-80 hover:opacity-100 transition-opacity">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 25, ease: 'linear', repeat: Infinity }}
            className="flex items-center gap-8 text-xs font-mono tracking-wider font-semibold text-neutral-500"
          >
            <span>⚡ 100% RAW & UNSCRIPTED</span>
            <span className="text-accent-red">•</span>
            <span>🎬 4K CINEMATIC CAPTURE</span>
            <span className="text-accent-red">•</span>
            <span>🧠 VIRAL SOCIAL EXPERIMENTS</span>
            <span className="text-accent-red">•</span>
            <span>💥 HIGH-RETENTION GEN Z</span>
            <span className="text-accent-red">•</span>
            <span>🇰🇭 CAMBODIA GROUND ZERO</span>
            <span className="text-accent-red">•</span>
            <span>🔥 ZERO STAGING • PURE REALITY</span>
            <span className="text-accent-red">•</span>

            {/* Repeated for continuous loop */}
            <span>⚡ 100% RAW & UNSCRIPTED</span>
            <span className="text-accent-red">•</span>
            <span>🎬 4K CINEMATIC CAPTURE</span>
            <span className="text-accent-red">•</span>
            <span>🧠 VIRAL SOCIAL EXPERIMENTS</span>
            <span className="text-accent-red">•</span>
            <span>💥 HIGH-RETENTION GEN Z</span>
            <span className="text-accent-red">•</span>
            <span>🇰🇭 CAMBODIA GROUND ZERO</span>
            <span className="text-accent-red">•</span>
            <span>🔥 ZERO STAGING • PURE REALITY</span>
            <span className="text-accent-red">•</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
