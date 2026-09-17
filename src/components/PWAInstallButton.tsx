import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share, PlusSquare, X, CheckCircle, Smartphone } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'header' | 'hero' | 'floating' | 'banner';
  className?: string;
  onOpenPlayStoreHub?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'header',
  className = '',
  onOpenPlayStoreHub,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showGenericGuide, setShowGenericGuide] = useState(false);

  // If already installed in standalone mode, do not display install prompts
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setShowGenericGuide(true);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // In iFrames or unsupported environments, show the installation / Play Store guidance
      if (onOpenPlayStoreHub) {
        onOpenPlayStoreHub();
      } else {
        setShowGenericGuide(true);
      }
    }
  };

  return (
    <>
      {variant === 'header' && (
        <button
          id="pwa-header-install-btn"
          onClick={handleClick}
          title="Install Where is my room on your device"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs transition-all active:scale-95 ${className}`}
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Install App</span>
          <span className="sm:hidden">Install</span>
        </button>
      )}

      {variant === 'hero' && (
        <button
          id="pwa-hero-install-btn"
          onClick={handleClick}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md hover:brightness-105 active:scale-98 transition-all ${className}`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Install Android / PWA App</span>
        </button>
      )}

      {variant === 'banner' && (
        <div
          id="pwa-home-banner"
          className={`p-3.5 rounded-2xl bg-gradient-to-r from-indigo-900 to-indigo-950 text-white border border-indigo-800/80 shadow-md flex items-center justify-between gap-3 ${className}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-xs font-black text-xs text-white">
              WIMR
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Where is my room App</h4>
              <p className="text-[11px] text-indigo-200">Faster room visits, offline access & direct warden chat</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClick}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shrink-0 shadow-xs flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>Install</span>
            </button>
            {onOpenPlayStoreHub && (
              <button
                onClick={onOpenPlayStoreHub}
                className="px-2.5 py-1.5 rounded-xl bg-indigo-800/80 hover:bg-indigo-700 text-indigo-200 text-xs font-semibold transition-all shrink-0 border border-indigo-700"
              >
                Play Store Hub
              </button>
            )}
          </div>
        </div>
      )}

      {/* iOS Safari Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-slate-800 animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs">
                  WIMR
                </div>
                <h3 className="text-base font-bold text-slate-900">Install on iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 mb-5">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Share className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <p>
                  1. Tap the <strong className="text-slate-900">Share button</strong> at the bottom of your Safari browser bar.
                </p>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <PlusSquare className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <p>
                  2. Scroll down the options and select <strong className="text-slate-900">Add to Home Screen</strong>.
                </p>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  3. Tap <strong className="text-slate-900">Add</strong> in the top-right corner. <strong>Where is my room</strong> will appear on your home screen!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Generic Browser / Desktop Guide Modal */}
      {showGenericGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl text-slate-800 animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs">
                  WIMR
                </div>
                <h3 className="text-base font-bold text-slate-900">Install "Where is my room"</h3>
              </div>
              <button
                onClick={() => setShowGenericGuide(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              You can install this app directly on Android, Windows, Mac, or ChromeOS for a full-screen, native app experience without app store downloads.
            </p>

            <div className="space-y-2.5 text-xs text-slate-600 mb-5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <strong className="text-slate-800 block mb-1">On Android (Chrome):</strong>
                Tap the three-dots menu (⋮) in the top-right corner and select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <strong className="text-slate-800 block mb-1">On Desktop (Chrome/Edge):</strong>
                Click the <strong>Install icon (⊕)</strong> in the address bar on the right side.
              </div>
            </div>

            <div className="flex gap-2">
              {onOpenPlayStoreHub && (
                <button
                  onClick={() => {
                    setShowGenericGuide(false);
                    onOpenPlayStoreHub();
                  }}
                  className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition text-center"
                >
                  Play Store Package Hub
                </button>
              )}
              <button
                onClick={() => setShowGenericGuide(false)}
                className="flex-1 rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
