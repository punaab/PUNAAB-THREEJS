'use client';

import { useState, useEffect } from 'react';
import UserProfile from '@/components/UserProfile';
import MusicNFTCard from '@/components/MusicNFTCard';

interface MusicNFT {
  tokenId: string;
  name: string;
  imageUrl: string;
  animationUrl?: string;
  description?: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [nfts, setNfts] = useState<MusicNFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchNFTs = async () => {
    if (!query.trim()) {
      // Load initial NFTs if query is empty
      loadInitialNFTs();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/opensea/search-music?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Failed to search NFTs');
      }

      const data = await response.json();
      setNfts(data.nfts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search');
      console.error('Error searching:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadInitialNFTs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/opensea/search-music?limit=20');
      
      if (!response.ok) {
        throw new Error('Failed to load NFTs');
      }

      const data = await response.json();
      setNfts(data.nfts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
      console.error('Error loading:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load initial NFTs on mount
    loadInitialNFTs();
  }, []);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">Search Music</h1>
          <UserProfile />
        </header>

        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 mb-6 border border-purple-500/30">
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchNFTs()}
              placeholder="Search Warplet Music NFTs..."
              className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={searchNFTs}
              disabled={isLoading}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            <p className="text-gray-400 mt-4">Searching...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nfts.map((nft) => (
              <MusicNFTCard
                key={nft.tokenId}
                nft={nft}
              />
            ))}
          </div>
        )}

        {!isLoading && nfts.length === 0 && query && (
          <div className="text-center py-12">
            <p className="text-gray-400">No results found</p>
          </div>
        )}
      </div>
    </main>
  );
}

