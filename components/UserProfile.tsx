'use client';

import { useFarcaster } from '@/contexts/FarcasterContext';

export default function UserProfile() {
  const { isAuthenticated, user } = useFarcaster();

  if (!isAuthenticated || !user) {
    return null;
  }

  // Ensure all values are strings before rendering
  const displayName = typeof user.displayName === 'string' 
    ? user.displayName 
    : String(user.displayName || 'User');
  const username = typeof user.username === 'string' 
    ? user.username 
    : String(user.username || '');

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full border border-purple-500/30">
      {user.pfpUrl && typeof user.pfpUrl === 'string' && (
        <img
          src={user.pfpUrl}
          alt={displayName}
          className="w-10 h-10 rounded-full border-2 border-purple-400"
        />
      )}
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-white">{displayName}</span>
        {username && (
          <span className="text-xs text-purple-300">@{username}</span>
        )}
      </div>
    </div>
  );
}

