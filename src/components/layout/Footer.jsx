import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Globe, Shield, ArrowUpRight, Heart, Play } from 'lucide-react';
import { BRAND } from '../../config/brand';

function YouTubeIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-background-secondary border-t border-border pt-16 pb-12 overflow-hidden">
      {/* Subtle background red glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-accent-red/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-border bg-surface flex items-center justify-center">
                <img
                  src="/assets/logo.jpg"
                  alt="V-Real Media"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg text-white">
                  {BRAND.name}
                </span>
                <span className="text-[10px] tracking-widest text-accent-red uppercase font-mono">
                  Authentic Street Cinema
                </span>
              </div>
            </div>

            <p className="text-sm text-content-secondary leading-relaxed">
              {BRAND.description}
            </p>

            <div className="flex items-center gap-2 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border">
                <span className="w-2 h-2 rounded-full bg-accent-red animate-rec-pulse" />
                <span className="text-xs text-content-primary font-mono font-medium">LIVE PRODUCTION</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-heading font-semibold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-content-secondary hover:text-accent-red transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-content-secondary hover:text-accent-red transition-colors">
                  About Our Mission
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-content-secondary hover:text-accent-red transition-colors">
                  Cinematic Portfolio
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-content-secondary hover:text-accent-red transition-colors">
                  News & Documentary Feeds
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-content-muted hover:text-white transition-colors flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-accent-red" />
                  <span>Admin CMS Login</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-heading font-semibold uppercase tracking-wider text-white">
              Direct Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`tel:${BRAND.contact.phone}`}
                  className="flex items-center gap-3 text-content-secondary hover:text-white transition group"
                >
                  <div className="p-2 rounded-lg bg-surface border border-border group-hover:border-accent-red text-accent-red transition">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-content-muted block">Phone</span>
                    <span className="font-mono text-content-primary group-hover:text-accent-red transition">
                      {BRAND.contact.phoneDisplay}
                    </span>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BRAND.contact.email}`}
                  className="flex items-center gap-3 text-content-secondary hover:text-white transition group"
                >
                  <div className="p-2 rounded-lg bg-surface border border-border group-hover:border-accent-red text-accent-red transition">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-content-muted block">Email</span>
                    <span className="text-content-primary group-hover:text-accent-red transition break-all">
                      {BRAND.contact.email}
                    </span>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={BRAND.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-content-secondary hover:text-white transition group"
                >
                  <div className="p-2 rounded-lg bg-surface border border-border group-hover:border-accent-red text-accent-red transition">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-content-muted block">Website</span>
                    <span className="text-content-primary group-hover:text-accent-red transition font-mono">
                      v-real.web.app
                    </span>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Channels */}
          <div className="space-y-4">
            <h4 className="text-sm font-heading font-semibold uppercase tracking-wider text-white">
              Official Channels
            </h4>
            <p className="text-xs text-content-secondary leading-relaxed">
              Follow our daily street episodes, behind-the-scenes teasers, and community updates on TikTok and YouTube.
            </p>

            <div className="flex flex-col gap-2.5">
              {/* TikTok */}
              <a
                href={BRAND.social.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-lg bg-surface border border-border hover:border-accent-red/60 text-content-primary transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-black border border-border flex items-center justify-center text-white">
                    <span className="text-xs font-bold font-mono">TT</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold block">{BRAND.social.tiktok.name}</span>
                    <span className="text-[11px] text-content-muted">{BRAND.social.tiktok.handle}</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-content-muted group-hover:text-accent-red transition" />
              </a>

              {/* YouTube */}
              <a
                href={BRAND.social.youtube.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-lg bg-surface border border-border hover:border-accent-red/60 text-content-primary transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-accent-red/20 border border-accent-red/40 flex items-center justify-center text-accent-red">
                    <YouTubeIcon className="w-4 h-4 fill-accent-red" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">{BRAND.social.youtube.name}</span>
                    <span className="text-[11px] text-content-muted">{BRAND.social.youtube.handle}</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-content-muted group-hover:text-accent-red transition" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-content-muted">
          <p>© {currentYear} {BRAND.name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-content-secondary">
              Real Stories • Real People • Real Impact
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
