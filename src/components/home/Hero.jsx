import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Video, Sparkles } from 'lucide-react';
import { BRAND } from '../../config/brand';

export default function Hero({ onWatchClick }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16">
      {/* Background Cinematic Texture & Vignette */}
      <div className="absolute inset-0 z-0 bg-background-primary">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Dramatic radial dark gradient overlay */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-background-primary/70 to-background-primary" />
        <div className="absolute inset-0 bg-gradient-to-t from-background-primary via-background-primary/40 to-transparent" />
        
        {/* Ambient red flare */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-accent-red/10 blur-[130px] rounded-full pointer-events-none" />
      </div>

      {/* Cinematic Viewfinder / Camera HUD Accents */}
      <div className="absolute inset-8 sm:inset-12 pointer-events-none border border-white/5 rounded-2xl flex flex-col justify-between p-4 sm:p-6 select-none">
        <div className="flex justify-between items-start text-[11px] font-mono text-content-muted">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-red animate-rec-pulse" />
            <span className="text-accent-red font-bold tracking-widest uppercase">REC [4K 60FPS]</span>
          </div>
          <div className="tracking-widest">
            ISO 400 • 1/50 • F/2.8
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
        
        {/* Brand Tag Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-elevated/90 border border-border text-xs text-content-secondary mb-8 shadow-xl"
        >
          <span className="w-2 h-2 rounded-full bg-accent-red" />
          <span className="font-mono uppercase tracking-widest text-content-primary">
            V-REAL MEDIA PRODUCTION
          </span>
          <span className="text-content-muted">•</span>
          <span className="text-content-muted">Cambodia</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight text-white uppercase leading-[1.08] mb-6"
        >
          REAL STORIES.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-300 to-content-secondary">
            REAL PEOPLE.
          </span><br />
          <span className="text-accent-red text-glow">
            REAL IMPACT.
          </span>
        </motion.h1>

        {/* Subtitle Description */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-base sm:text-xl text-content-secondary max-w-2xl mx-auto font-normal leading-relaxed mb-10"
        >
          {BRAND.description}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/portfolio"
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-accent-red text-white font-semibold text-sm hover:bg-accent-darkRed shadow-rec-glow transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <span>Explore Our Stories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <button
            type="button"
            onClick={onWatchClick}
            className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-surface-elevated hover:bg-surface border border-border hover:border-accent-red/50 text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2.5 group"
          >
            <div className="w-5 h-5 rounded-full bg-accent-red/20 border border-accent-red flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-2.5 h-2.5 fill-accent-red text-accent-red ml-0.5" />
            </div>
            <span>Watch Featured Video</span>
          </button>
        </motion.div>

        {/* Quick Statistics Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 mt-16 border-t border-border/60 text-left"
        >
          <div>
            <span className="text-2xl sm:text-3xl font-display font-bold text-white block">100%</span>
            <span className="text-xs text-content-muted uppercase tracking-wider">Unscripted Reality</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-display font-bold text-white block">4K UHD</span>
            <span className="text-xs text-content-muted uppercase tracking-wider">Cinematic Capture</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-display font-bold text-white block">Social</span>
            <span className="text-xs text-content-muted uppercase tracking-wider">Empathetic Experiments</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-display font-bold text-accent-red block">Cambodia</span>
            <span className="text-xs text-content-muted uppercase tracking-wider">Community Awareness</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
