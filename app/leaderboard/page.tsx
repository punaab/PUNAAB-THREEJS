'use client';

import { useState, useEffect } from 'react';
import UserProfile from '@/components/UserProfile';

interface MusicNFT {
  tokenId: string;
  name: string;
  imageUrl: string;
  animationUrl?: string;
  votes?: number;
}

export default function LeaderboardPage() {
  const [nfts, setNfts] = useState<MusicNFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/opensea/search-music?limit=50');
      if (response.ok) {
        const data = await response.json();
        // Sort by votes (would need backend implementation)
        const sorted = (data.nfts || []).sort((a: MusicNFT, b: MusicNFT) => 
          (b.votes || 0) - (a.votes || 0)
        );
        setNfts(sorted);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">Leaderboard</h1>
          <UserProfile />
        </header>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            <p className="text-gray-400 mt-4">Loading...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {nfts.map((nft, index) => (
              <div
                key={nft.tokenId}
                className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30 flex items-center gap-6"
              >
                <div className="text-3xl font-bold text-purple-400 w-12 text-center">
                  #{index + 1}
                </div>
                <img
                  src={nft.imageUrl}
                  alt={nft.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{nft.name}</h3>
                  {nft.animationUrl && (
                    <audio controls className="w-full max-w-md">
                      <source src={nft.animationUrl} type="audio/mpeg" />
                    </audio>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{nft.votes || 0}</div>
                  <div className="text-sm text-gray-400">votes</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

