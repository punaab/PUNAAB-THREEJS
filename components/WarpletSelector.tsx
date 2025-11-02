'use client';

import { useEffect, useState } from 'react';
import { useFarcaster } from '@/contexts/FarcasterContext';

interface Warplet {
  tokenId: string;
  name: string;
  imageUrl: string;
  description?: string;
  contractAddress: string;
}

interface WarpletSelectorProps {
  onSelect: (warplet: Warplet) => void;
  selectedWarplet?: Warplet | null;
}

export default function WarpletSelector({ onSelect, selectedWarplet }: WarpletSelectorProps) {
  const { walletAddress, isAuthenticated } = useFarcaster();
  const [warplets, setWarplets] = useState<Warplet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && walletAddress) {
      // Ensure walletAddress is a string, not a Promise
      const address = typeof walletAddress === 'string' ? walletAddress : null;
      if (address) {
        fetchWarplets(address);
      }
    }
  }, [isAuthenticated, walletAddress]);

  const fetchWarplets = async (address: string) => {
    if (!address || typeof address !== 'string') return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/opensea/user-nfts?wallet=${encodeURIComponent(address)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch Warplets');
      }

      const data = await response.json();
      setWarplets(data.nfts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Warplets');
      console.error('Error fetching Warplets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">Please sign in to view your Warplets</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <p className="text-gray-400 mt-4">Loading your Warplets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => fetchWarplets(typeof walletAddress === 'string' ? walletAddress : '')}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (warplets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">No Warplets found in your wallet</p>
        <a
          href="https://opensea.io/collection/the-warplets-farcaster"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-purple-300 underline"
        >
          Get Warplets on OpenSea
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {warplets.map((warplet) => (
        <button
          key={warplet.tokenId}
          onClick={() => onSelect(warplet)}
          className={`relative overflow-hidden rounded-lg border-2 transition-all ${
            selectedWarplet?.tokenId === warplet.tokenId
              ? 'border-purple-400 ring-4 ring-purple-400/50 scale-105'
              : 'border-gray-700 hover:border-purple-500'
          }`}
        >
          <img
            src={warplet.imageUrl}
            alt={warplet.name}
            className="w-full h-full object-cover aspect-square"
          />
          {selectedWarplet?.tokenId === warplet.tokenId && (
            <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
              <div className="bg-purple-500 rounded-full p-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
            <p className="text-white text-sm font-medium truncate">{warplet.name}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

