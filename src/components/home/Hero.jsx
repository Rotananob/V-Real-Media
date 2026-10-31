import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Phone, Shield } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { BRAND } from '../../config/brand';

export default function Hero() {
  const { language, t } = useLanguage();

  return (
    <section className="relative min-h-[75vh] sm:min-h-[80vh] flex items-center justify-center pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA] border-b border-neutral-200">
      
      {/* Subtle clean grid backdrop */}
      <div className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        
        {/* Main Headline (Clean & Honest) */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-900 leading-[1.18] mb-6 ${
            language === 'km' ? 'font-khmer' : 'font-display uppercase'
          }`}
        >
          {t.hero.headlineLine1} • {t.hero.headlineLine2}<br />
          <span className="text-accent-red">
            {t.hero.headlineLine3}
          </span>
        </motion.h1>

        {/* Human Narrative Description (Truthful, not exaggerated) */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed mb-10 font-khmer"
        >
          {t.hero.description}
        </motion.p>

        {/* Action Buttons: Smooth links to all-in-one sections */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 font-khmer"
        >
          <a
            href="#portfolio"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800 transition shadow-xs flex items-center justify-center gap-2"
          >
            <span>{language === 'km' ? 'ទស្សនាវីដេអូ' : 'Watch Videos'}</span>
            <ArrowDown className="w-4 h-4" />
          </a>

          <a
            href="#vision"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-800 font-semibold text-sm transition shadow-xs flex items-center justify-center gap-2"
          >
            <span>{language === 'km' ? 'រឿងរ៉ាវរបស់ពួកយើង' : 'Our Story'}</span>
          </a>

          <a
            href={`tel:${BRAND.contact.phone}`}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-800 font-semibold text-sm transition shadow-xs flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4 text-accent-red" />
            <span>{BRAND.contact.phoneDisplay}</span>
          </a>
        </motion.div>

      </div>
    </section>
  );
}
