import React from 'react';
import { motion } from 'framer-motion';
import { Target, Compass, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AboutPage() {
  const { t, language } = useLanguage();

  return (
    <div className="pt-28 pb-24 bg-[#FAFAFA] min-h-screen font-khmer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-accent-red" />
            <span className="text-xs font-mono uppercase tracking-widest text-accent-red font-semibold">
              {t.about.sectionBadge}
            </span>
          </div>

          <h1 className={`text-4xl sm:text-6xl font-extrabold text-neutral-900 tracking-tight leading-tight mb-6 ${
            language === 'km' ? 'font-khmer' : 'font-display uppercase'
          }`}>
            {language === 'km' ? "ចក្ខុវិស័យជំនាន់ថ្មី • តថភាពពិត ១០០%" : "Next-Gen Street Reality • 100% Unscripted"}
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
            {language === 'km' 
              ? "ស្វែងយល់ពីបេសកកម្មរបស់ V-REAL MEDIA ក្នុងការផ្លាស់ប្តូរទម្រង់មាតិកាឌីជីថលនៅកម្ពុជា តាមរយៈការពិសោធន៍សង្គមដ៏ជក់ចិត្ត និងតថភាពតាមដងផ្លូវកម្រិតពិភពលោក។"
              : "Discover V-REAL MEDIA's mission to revolutionize Cambodian digital storytelling through high-retention street reality and viral social experiments."}
          </p>
        </div>

        {/* Featured Visual & Emblem Showcase */}
        <div className="relative rounded-2xl overflow-hidden border border-neutral-200 bg-white mb-20 p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-50 p-4 shadow-xs">
                <img
                  src="/assets/logo.jpg"
                  alt="V-Real Media Emblem"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>

            <div className="lg:col-span-8 space-y-5">
              <span className="text-xs text-accent-red font-mono uppercase tracking-widest font-semibold block">
                CREATOR PLATFORM & VISION
              </span>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 leading-tight">
                {language === 'km' ? "គ្មានស្គ្រីប គ្មានការរៀបចំ — ថាមពលពិតនៃដងផ្លូវ" : "Zero Scripts. Zero Staging. Pure Street Adrenaline."}
              </h2>

              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                {t.about.p1}
              </p>

              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                {t.about.p2}
              </p>

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
            </div>

          </div>
        </div>

        {/* Mission & Vision Detailed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 font-khmer">
          <div className="p-8 rounded-2xl bg-white border border-neutral-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-accent-red mb-6 shadow-xs">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">{t.about.missionTitle}</h3>
            <p className="text-sm text-neutral-600 leading-relaxed mb-4">
              {t.about.missionDesc}
            </p>
            <ul className="space-y-2 text-xs text-neutral-500">
              <li>• {language === 'km' ? 'គោរព និងរក្សាសេចក្តីថ្លៃថ្នូររបស់មនុស្សគ្រប់រូប' : 'Respect and uphold human dignity in every video'}</li>
              <li>• {language === 'km' ? 'បង្ហាញពីរឿងរ៉ាវតស៊ូរបស់អ្នករកស៊ី និងបងប្អូនសាមញ្ញ' : 'Spotlight the perseverance of everyday people'}</li>
              <li>• {language === 'km' ? 'ជួយឱ្យយើងចេះយល់ចិត្ត និងស្រឡាញ់គ្នាទៅវិញទៅមក' : 'Encourage mutual empathy and community kindness'}</li>
            </ul>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-neutral-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-accent-red mb-6 shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">{t.about.visionTitle}</h3>
            <p className="text-sm text-neutral-600 leading-relaxed mb-4">
              {t.about.visionDesc}
            </p>
            <ul className="space-y-2 text-xs text-neutral-500">
              <li>• {language === 'km' ? 'ចុះទៅកាន់គ្រប់ខេត្តក្រុងដើម្បីស្តាប់រឿងរ៉ាវផ្សេងៗពីគ្នា' : 'Document authentic voices across all Cambodian provinces'}</li>
              <li>• {language === 'km' ? 'ធ្វើការពិសោធន៍សង្គមប្រកបដោយភាពស្មោះត្រង់ និងមិនបំភ្លៃ' : 'Conduct honest, unmanipulated social experiments'}</li>
              <li>• {language === 'km' ? 'លើកទឹកចិត្តយុវជនឱ្យយល់ដឹងពីតថភាពជាក់ស្ដែងក្នុងសង្គម' : 'Inspire youth to understand real social dynamics'}</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
