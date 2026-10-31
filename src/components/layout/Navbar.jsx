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
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.about, path: '/#about', hash: '#about' },
    { name: t.nav.portfolio, path: '/#portfolio', hash: '#portfolio' },
    { name: t.nav.news, path: '/news' },
    { name: t.nav.contact, path: '/#contact', hash: '#contact' },
  ];

  const handleNavClick = (e, link) => {
    if (link.hash) {
      if (location.pathname === '/') {
        e.preventDefault();
        const elem = document.querySelector(link.hash);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const isActive = (link) => {
    if (link.path === '/' && location.pathname === '/' && !location.hash) return true;
    if (link.hash && location.hash === link.hash) return true;
    if (!link.hash && link.path !== '/' && location.pathname.startsWith(link.path)) return true;
    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-neutral-200 py-3 shadow-sm'
          : 'bg-white/80 backdrop-blur-sm border-b border-neutral-100 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Subtle REC Indicator */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-neutral-200 bg-white p-0.5 shadow-sm flex items-center justify-center">
              <img
                src="/assets/logo.jpg"
                alt="V-Real Media"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-neutral-900 group-hover:text-accent-red transition-colors">
                  V-REAL
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-100 border border-neutral-200 text-neutral-600 font-mono tracking-wider font-semibold">
                  MEDIA
                </span>
                <span className="w-2 h-2 rounded-full bg-accent-red inline-block" title="Active Production" />
              </div>
              <span className="text-[11px] text-neutral-500 font-khmer hidden sm:block">
                {language === 'km' ? 'រឿងរ៉ាវពិត • មនុស្សពិត' : 'Real Stories • Real Lives'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => handleNavClick(e, link)}
                className={`text-sm transition-colors duration-150 relative py-1 font-khmer ${
                  isActive(link)
                    ? 'text-neutral-900 font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {link.name}
                {isActive(link) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-red rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Controls: Language Selector, Quick Call, CMS Link */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Language Switcher (Zero Emoji - Clean Icons & Text) */}
            <div className="flex items-center bg-neutral-100 border border-neutral-200 rounded-lg p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setLanguage('km')}
                className={`px-2.5 py-1 rounded-md transition font-khmer text-xs ${
                  language === 'km'
                    ? 'bg-white text-neutral-900 font-bold shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                ខ្មែរ
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-md transition text-xs font-mono ${
                  language === 'en'
                    ? 'bg-white text-neutral-900 font-bold shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                EN
              </button>
            </div>

            {/* Quick Call */}
            <a
              href={`tel:${BRAND.contact.phone}`}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-neutral-50 border border-neutral-200 hover:border-neutral-300 text-neutral-800 transition flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-accent-red" />
              <span className="font-mono">{BRAND.contact.phoneDisplay}</span>
            </a>

            {/* Admin CMS Access */}
            <Link
              to={user ? "/admin" : "/login"}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                user
                  ? 'bg-accent-red text-white hover:bg-accent-darkRed shadow-sm'
                  : 'bg-neutral-900 text-white hover:bg-neutral-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="font-khmer">{user ? t.nav.admin : "Admin"}</span>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Lang Button (Clean) */}
            <button
              onClick={() => setLanguage(language === 'km' ? 'en' : 'km')}
              className="px-2.5 py-1 text-xs rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-800 font-semibold"
            >
              {language === 'km' ? 'EN' : 'ខ្មែរ'}
            </button>

            <Link
              to={user ? "/admin" : "/login"}
              className="p-2 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-800"
            >
              <Shield className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-800 hover:bg-neutral-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200 px-4 pt-4 pb-6 mt-2 space-y-4 shadow-lg">
          <div className="flex flex-col space-y-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => {
                  handleNavClick(e, link);
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium font-khmer transition ${
                  isActive(link)
                    ? 'bg-neutral-100 text-neutral-900 font-bold'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-neutral-100 flex flex-col gap-2.5">
            <a
              href={`tel:${BRAND.contact.phone}`}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-sm text-neutral-800 font-medium"
            >
              <Phone className="w-4 h-4 text-accent-red" />
              <span>{t.nav.callUs}: {BRAND.contact.phoneDisplay}</span>
            </a>
            <Link
              to={user ? "/admin" : "/login"}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-900 text-white text-sm font-semibold font-khmer shadow-sm"
            >
              <Shield className="w-4 h-4" />
              <span>{user ? t.nav.admin : "Admin CMS"}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
