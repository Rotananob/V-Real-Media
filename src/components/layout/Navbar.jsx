import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Shield, Globe } from 'lucide-react';
import { BRAND } from '../../config/brand';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.about, path: '/about' },
    { name: t.nav.portfolio, path: '/portfolio' },
    { name: t.nav.news, path: '/news' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-background-primary/95 backdrop-blur-md border-b border-border py-3 shadow-2xl'
          : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Physical REC Indicator */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-border group-hover:border-accent-red/60 transition-colors bg-surface shadow-human-card flex items-center justify-center p-0.5">
              <img
                src="/assets/logo.jpg"
                alt="V-Real Media Logo"
                className="w-full h-full object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-xl tracking-tight text-white group-hover:text-accent-red transition-colors">
                  V-REAL
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-border text-content-secondary font-mono tracking-wider">
                  MEDIA
                </span>
                {/* Physical Camera REC Lamp */}
                <div className="flex items-center gap-1.5 bg-accent-red/10 border border-accent-red/30 px-2 py-0.5 rounded-full shadow-rec-glow/20">
                  <span className="w-2 h-2 rounded-full bg-accent-red animate-rec-pulse" />
                  <span className="text-[10px] font-mono font-bold tracking-widest text-accent-red uppercase">
                    REC
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-content-muted tracking-wide font-khmer hidden sm:block">
                តថភាពតាមដងផ្លូវកម្ពុជា
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm transition-all duration-200 relative py-1 font-khmer ${
                  isActive(link.path)
                    ? 'text-white font-semibold'
                    : 'text-content-secondary hover:text-white'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-red shadow-rec-glow" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Controls: Language Selector, Quick Call, CMS Link */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Language Switcher Pill */}
            <div className="flex items-center bg-surface border border-border rounded-lg p-0.5 text-xs font-medium">
              <button
                type="button"
                onClick={() => setLanguage('km')}
                className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                  language === 'km'
                    ? 'bg-accent-red text-white shadow-sm font-semibold'
                    : 'text-content-secondary hover:text-white'
                }`}
                title="ប្តូរទៅភាសាខ្មែរ"
              >
                <span>🇰🇭</span>
                <span>ខ្មែរ</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                  language === 'en'
                    ? 'bg-accent-red text-white shadow-sm font-semibold'
                    : 'text-content-secondary hover:text-white'
                }`}
                title="Switch to English"
              >
                <span>🇬🇧</span>
                <span>EN</span>
              </button>
            </div>

            {/* Direct Phone Call Button */}
            <a
              href={`tel:${BRAND.contact.phone}`}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-surface border border-border hover:border-accent-red/50 text-white transition flex items-center gap-2 group"
            >
              <Phone className="w-3.5 h-3.5 text-accent-red group-hover:scale-110 transition-transform" />
              <span className="font-mono">{BRAND.contact.phoneDisplay}</span>
            </a>

            {/* Admin CMS Access Button */}
            <Link
              to={user ? "/admin" : "/login"}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-2 ${
                user
                  ? 'bg-accent-red text-white hover:bg-accent-darkRed shadow-rec-glow'
                  : 'bg-surface-elevated text-content-primary hover:text-white hover:border-accent-red/50 border border-border'
              }`}
              title={user ? "Open Admin CMS" : "Admin Login"}
            >
              <Shield className={`w-3.5 h-3.5 ${user ? 'text-white' : 'text-accent-red'}`} />
              <span className="font-khmer">{user ? t.nav.admin : "Admin CMS"}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'km' ? 'en' : 'km')}
              className="px-2.5 py-1 text-xs rounded-lg bg-surface border border-border text-white font-medium"
            >
              {language === 'km' ? '🇰🇭 ខ្មែរ' : '🇬🇧 EN'}
            </button>

            <Link
              to={user ? "/admin" : "/login"}
              className="p-2 rounded-lg bg-surface border border-border text-accent-red"
            >
              <Shield className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-surface border border-border text-content-primary hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background-primary/95 backdrop-blur-xl border-b border-border px-4 pt-4 pb-6 mt-2 space-y-4 shadow-2xl">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium font-khmer transition ${
                  isActive(link.path)
                    ? 'bg-surface text-accent-red border border-accent-red/30'
                    : 'text-content-secondary hover:text-white hover:bg-surface/50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-border flex flex-col gap-3">
            <a
              href={`tel:${BRAND.contact.phone}`}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-surface border border-border text-sm text-white font-medium"
            >
              <Phone className="w-4 h-4 text-accent-red" />
              <span>{t.nav.callUs}: {BRAND.contact.phoneDisplay}</span>
            </a>
            <Link
              to={user ? "/admin" : "/login"}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent-red text-white text-sm font-semibold shadow-rec-glow font-khmer"
            >
              <Shield className="w-4 h-4" />
              <span>{user ? t.nav.admin : "ចូលកាន់ Admin CMS"}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
