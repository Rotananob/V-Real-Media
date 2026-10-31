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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200 text-xs text-neutral-700 mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-accent-red" />
            <span className="font-semibold">{t.about.sectionBadge}</span>
          </div>

          <h1 className={`text-4xl sm:text-6xl font-extrabold text-neutral-900 tracking-tight leading-tight mb-6 ${
            language === 'km' ? 'font-khmer' : 'font-display uppercase'
          }`}>
            {language === 'km' ? "កញ្ចក់ឆ្លុះបញ្ចាំងតថភាពមនុស្ស" : "The Lens of Reality"}
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
            {language === 'km' 
              ? "ស្វែងយល់ពីទស្សនវិស័យ គោលការណ៍សីលធម៌ និងស្តង់ដារនៃការផលិតភាពយន្តឯកសារ និងកម្មវិធីតថភាពតាមដងផ្លូវរបស់យើង។"
              : "Discover the philosophy, ethos, and production principles behind our street reality shows and documentary cinema."}
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
                ORIGIN STORY & PURPOSE
              </span>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 leading-tight">
                {language === 'km' ? "កើតចេញពីដងផ្លូវ។ ដឹកនាំដោយរឿងរ៉ាវពិតរបស់មនុស្ស។" : "Born From The Streets. Driven By Real Human Stories."}
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
              <li>• {language === 'km' ? 'គោរពសេចក្តីថ្លៃថ្នូររបស់មនុស្សគ្រប់រូបក្នុងគ្រប់វីដេអូ' : 'Honor human dignity in all documentary captures'}</li>
              <li>• {language === 'km' ? 'បង្ហាញពីវីរបុរសស្ងៀមស្ងាត់ក្នុងសហគមន៍' : 'Highlight uncelebrated grassroots heroes'}</li>
              <li>• {language === 'km' ? 'លើកកម្ពស់ការយល់ចិត្តគ្នាក្នុងសង្គម' : 'Foster empathy across socio-economic boundaries'}</li>
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
              <li>• {language === 'km' ? 'ពង្រីកការផលិតទៅកាន់គ្រប់ខេត្តក្រុងនៃប្រទេសកម្ពុជា' : 'Expand production to all provinces in Cambodia'}</li>
              <li>• {language === 'km' ? 'កំណត់ស្តង់ដារគុណភាពសម្រាប់ការពិសោធន៍សង្គម' : 'Set benchmarks for ethical social experiments'}</li>
              <li>• {language === 'km' ? 'បណ្តុះបណ្តាលយុវជនជំនាន់ក្រោយលើការផលិតភាពយន្តឯកសារ' : 'Mentor emerging documentary filmmakers'}</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
