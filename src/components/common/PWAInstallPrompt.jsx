import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    // Check if already in standalone PWA mode
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after a gentle 3-second delay
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt || isInstalled) return null;

  return (
    <aside
      aria-label="Install Application"
      className="fixed bottom-5 right-4 sm:right-6 z-50 max-w-sm w-[calc(100%-2rem)] bg-surface border border-accent-red/40 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-fade-in font-khmer"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-red/10 border border-accent-red/30 flex items-center justify-center text-accent-red shrink-0 shadow-sm">
          <Smartphone className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5 truncate">
              <span>{language === 'km' ? 'ដំឡើងកម្មវិធី V-REAL' : 'Install V-REAL App'}</span>
              <Sparkles className="w-3.5 h-3.5 text-accent-red" />
            </h4>
            <button
              onClick={() => setShowPrompt(false)}
              className="p-1 text-content-muted hover:text-white"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-content-secondary mt-1 leading-relaxed">
            {language === 'km'
              ? 'ទស្សនាវីដេអូបានលឿនជាងមុន និងទទួលការជូនដំណឹងរឿងរ៉ាវថ្មីៗលើទូរស័ព្ទរបស់អ្នក។'
              : 'Add to home screen for instant playback and unscripted street stories.'}
          </p>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleInstall}
              className="px-4 py-2 rounded-xl bg-accent-red hover:bg-accent-darkRed text-white text-xs font-semibold shadow-rec-glow transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{language === 'km' ? 'ដំឡើងឥឡូវនេះ' : 'Install Now'}</span>
            </button>
            <button
              onClick={() => setShowPrompt(false)}
              className="px-3 py-2 rounded-xl bg-surface-elevated text-content-secondary hover:text-white text-xs font-medium transition"
            >
              {language === 'km' ? 'ពេលក្រោយ' : 'Later'}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
