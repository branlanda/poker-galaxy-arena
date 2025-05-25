
import React from 'react';

interface OfflineIndicatorProps {
  isOnline: boolean;
}

export function OfflineIndicator({ isOnline }: OfflineIndicatorProps) {
  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 w-full bg-red-500 text-white text-center py-2 z-50">
      You are currently offline. Some features may not be available.
    </div>
  );
}
