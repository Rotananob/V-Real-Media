import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, Shield, Film, Sparkles } from 'lucide-react';
import { BRAND } from '../../config/brand';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'News', path: '/news' },
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
          ? 'bg-background-primary/90 backdrop-blur-md border-b border-border py-3 shadow-2xl'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Live REC Indicator */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-border group-hover:border-accent-red/60 transition-colors bg-surface flex items-center justify-center">
              <img
                src="/assets/logo.jpg"
                alt="V-Real Media Logo"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-accent-red transition-colors">
                  V-REAL
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-surface border border-border text-content-secondary font-mono tracking-wider">
                  MEDIA
                </span>
                {/* Live REC indicator */}
                <div className="flex items-center gap-1.5 ml-1 bg-accent-red/10 border border-accent-red/30 px-2 py-0.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-accent-red animate-rec-pulse" />
                  <span className="text-[10px] font-mono font-bold tracking-widest text-accent-red uppercase">
                    REC
                  </span>
                </div>
              </div>
              <span className="text-[10px] tracking-wider text-content-muted uppercase hidden sm:block">
                Cinematic Street Reality
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-all duration-200 relative py-1 ${
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

          {/* Action CTAs & Admin Link */}
          <div className="hidden md:flex items-center gap-4">
            {/* Quick Contact Button */}
            <a
              href={`tel:${BRAND.contact.phone}`}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-surface border border-border hover:border-accent-red/50 text-white transition flex items-center gap-2 group"
            >
              <Phone className="w-3.5 h-3.5 text-accent-red group-hover:scale-110 transition-transform" />
              <span>{BRAND.contact.phoneDisplay}</span>
            </a>

            {/* Admin Access Indicator */}
            {user ? (
              <Link
                to="/admin"
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-accent-red text-white hover:bg-accent-darkRed shadow-rec-glow transition flex items-center gap-1.5"
                title={isAdmin ? "Go to Admin Dashboard" : "Admin Panel"}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>CMS</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="p-2 text-content-muted hover:text-white rounded-lg hover:bg-surface border border-transparent hover:border-border transition"
                title="Admin Sign In"
              >
                <Shield className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {user && (
              <Link to="/admin" className="p-2 text-accent-red">
                <Shield className="w-5 h-5" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-surface border border-border text-content-primary hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background-primary/95 backdrop-blur-xl border-b border-border px-4 pt-4 pb-6 mt-2 space-y-4">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition ${
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
              <span>Call {BRAND.contact.phoneDisplay}</span>
            </a>
            <a
              href={`mailto:${BRAND.contact.email}`}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-surface border border-border text-sm text-white font-medium"
            >
              <Mail className="w-4 h-4 text-accent-red" />
              <span>{BRAND.contact.email}</span>
            </a>
            <Link
              to={user ? "/admin" : "/login"}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent-red text-white text-sm font-semibold shadow-rec-glow"
            >
              <Shield className="w-4 h-4" />
              <span>{user ? "Open CMS Dashboard" : "Admin Login"}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
