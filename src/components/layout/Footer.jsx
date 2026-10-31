import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Globe, Shield, ArrowUpRight } from 'lucide-react';
import { BRAND } from '../../config/brand';
import { useLanguage } from '../../context/LanguageContext';

function YouTubeIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t, language, setLanguage } = useLanguage();

  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 pt-16 pb-12 font-khmer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-neutral-200 bg-white flex items-center justify-center p-0.5 shadow-sm">
                <img
                  src="/assets/logo.jpg"
                  alt="V-Real Media"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg text-neutral-900">
                  {BRAND.name}
                </span>
                <span className="text-xs text-neutral-500 font-khmer">
                  {t.footer.tagline}
                </span>
              </div>
            </div>

            <p className="text-sm text-neutral-600 leading-relaxed font-khmer">
              {t.hero.description}
            </p>

            {/* Language Switcher in Footer (No Emoji) */}
            <div className="pt-2 flex items-center gap-2">
              <span className="text-xs text-neutral-500">{t.nav.lang}:</span>
              <button
                onClick={() => setLanguage('km')}
                className={`px-2.5 py-1 rounded-md text-xs font-khmer transition ${
                  language === 'km' ? 'bg-neutral-900 text-white font-bold' : 'bg-white text-neutral-600 border border-neutral-200'
                }`}
              >
                ភាសាខ្មែរ
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition ${
                  language === 'en' ? 'bg-neutral-900 text-white font-bold' : 'bg-white text-neutral-600 border border-neutral-200'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
              {t.footer.navHeading}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-neutral-600 hover:text-neutral-900 transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-neutral-600 hover:text-neutral-900 transition-colors">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-neutral-600 hover:text-neutral-900 transition-colors">
                  {t.nav.portfolio}
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-neutral-600 hover:text-neutral-900 transition-colors">
                  {t.nav.news}
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-accent-red hover:underline transition-colors flex items-center gap-1.5 pt-1">
                  <Shield className="w-4 h-4" />
                  <span>{t.footer.adminPortal}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
              {t.footer.contactHeading}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`tel:${BRAND.contact.phone}`}
                  className="flex items-center gap-3 text-neutral-600 hover:text-neutral-900 transition group"
                >
                  <div className="p-2 rounded-lg bg-white border border-neutral-200 text-accent-red transition shadow-xs">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 block">{t.nav.callUs}</span>
                    <span className="font-mono text-neutral-900 font-medium">
                      {BRAND.contact.phoneDisplay}
                    </span>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BRAND.contact.email}`}
                  className="flex items-center gap-3 text-neutral-600 hover:text-neutral-900 transition group"
                >
                  <div className="p-2 rounded-lg bg-white border border-neutral-200 text-accent-red transition shadow-xs">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 block">Email</span>
                    <span className="text-neutral-900 font-medium break-all">
                      {BRAND.contact.email}
                    </span>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="https://v-real-media.web.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-neutral-600 hover:text-neutral-900 transition group"
                >
                  <div className="p-2 rounded-lg bg-white border border-neutral-200 text-accent-red transition shadow-xs">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 block">Website</span>
                    <span className="text-neutral-900 font-mono font-medium">
                      v-real-media.web.app
                    </span>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Channels */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
              {t.footer.socialHeading}
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed font-khmer">
              {t.footer.socialDesc}
            </p>

            <div className="flex flex-col gap-2.5">
              {/* TikTok */}
              <a
                href={BRAND.social.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-800 transition group shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center font-mono text-xs font-bold">
                    TT
                  </div>
                  <div>
                    <span className="text-xs font-bold block">{BRAND.social.tiktok.name}</span>
                    <span className="text-[11px] text-neutral-500">{BRAND.social.tiktok.handle}</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition" />
              </a>

              {/* YouTube */}
              <a
                href={BRAND.social.youtube.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-800 transition group shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-red-50 text-accent-red flex items-center justify-center">
                    <YouTubeIcon className="w-4 h-4 fill-accent-red" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">{BRAND.social.youtube.name}</span>
                    <span className="text-[11px] text-neutral-500">{BRAND.social.youtube.handle}</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {currentYear} {BRAND.name}. {t.footer.rights}</p>
          <div>
            <span className="text-neutral-600 font-khmer">
              {t.footer.motto}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
