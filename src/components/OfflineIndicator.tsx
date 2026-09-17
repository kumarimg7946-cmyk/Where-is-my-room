import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <aside
      aria-label="Network Status"
      id="pwa-offline-banner"
      className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 flex items-center gap-2.5 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xl border border-amber-400/40 animate-bounce-subtle"
    >
      <WifiOff className="w-4 h-4 shrink-0 text-amber-200" />
      <span>Offline Mode &bull; Cached rooms and listings available</span>
    </aside>
  );
};
