'use client';

import { useFarcaster } from '@/contexts/FarcasterContext';

export default function AuthButton() {
  const { isAuthenticated, isLoading, user, signIn, signOut } = useFarcaster();

  if (isLoading) {
    return (
      <button
        disabled
        className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
      >
        Loading...
      </button>
    );
  }

  if (isAuthenticated && user) {
    // Ensure all values are strings before rendering
    const displayName = typeof user.displayName === 'string' ? user.displayName : String(user.displayName || 'User');
    const username = typeof user.username === 'string' ? user.username : String(user.username || '');
    
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {user.pfpUrl && typeof user.pfpUrl === 'string' && (
            <img
              src={user.pfpUrl}
              alt={displayName}
              className="w-8 h-8 rounded-full"
            />
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium">{displayName}</span>
            {username && (
              <span className="text-xs text-gray-500">@{username}</span>
            )}
          </div>
        </div>
        <button
          onClick={signOut}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={signIn}
      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
    >
      Sign in with Farcaster
    </button>
  );
}

