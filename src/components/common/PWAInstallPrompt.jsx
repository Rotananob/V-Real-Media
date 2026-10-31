import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
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
      className="fixed bottom-5 right-4 sm:right-6 z-50 max-w-sm w-[calc(100%-2rem)] bg-white border border-neutral-200 rounded-2xl p-4 shadow-xl font-khmer"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 shrink-0">
          <Smartphone className="w-5 h-5 text-accent-red" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5 truncate">
              <span>{language === 'km' ? 'ដំឡើងកម្មវិធី V-REAL' : 'Install V-REAL App'}</span>
              <Sparkles className="w-3.5 h-3.5 text-accent-red" />
            </h4>
            <button
              onClick={() => setShowPrompt(false)}
              className="p-1 text-neutral-400 hover:text-neutral-700"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">
            {language === 'km'
              ? 'ទស្សនាវីដេអូបានលឿនជាងមុន និងទទួលការជូនដំណឹងរឿងរ៉ាវថ្មីៗលើទូរស័ព្ទរបស់អ្នក។'
              : 'Add to home screen for instant playback and unscripted street stories.'}
          </p>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleInstall}
              className="px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{language === 'km' ? 'ដំឡើង' : 'Install'}</span>
            </button>
            <button
              onClick={() => setShowPrompt(false)}
              className="px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-600 hover:text-neutral-900 text-xs font-medium transition"
            >
              {language === 'km' ? 'ពេលក្រោយ' : 'Later'}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
