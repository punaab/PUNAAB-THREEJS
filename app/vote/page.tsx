'use client';

import { useState, useEffect } from 'react';
import UserProfile from '@/components/UserProfile';
import MusicNFTCard from '@/components/MusicNFTCard';

interface MusicNFT {
  tokenId: string;
  name: string;
  imageUrl: string;
  animationUrl?: string;
  votes?: number;
}

export default function VotePage() {
  const [nfts, setNfts] = useState<MusicNFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [votedNFTs, setVotedNFTs] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadNFTs();
    // Load voted NFTs from localStorage
    const savedVotes = localStorage.getItem('votedNFTs');
    if (savedVotes) {
      setVotedNFTs(new Set(JSON.parse(savedVotes)));
    }
  }, []);

  const loadNFTs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/opensea/search-music?limit=20');
      if (response.ok) {
        const data = await response.json();
        // Add vote counts (in real app, this would come from backend)
        const nftsWithVotes = (data.nfts || []).map((nft: MusicNFT) => ({
          ...nft,
          votes: votedNFTs.has(nft.tokenId) ? 1 : 0,
        }));
        setNfts(nftsWithVotes);
      }
    } catch (error) {
      console.error('Error loading NFTs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (tokenId: string) => {
    // In a real implementation, you'd call an API to store votes
    const newVotedNFTs = new Set(votedNFTs);
    
    if (newVotedNFTs.has(tokenId)) {
      newVotedNFTs.delete(tokenId);
    } else {
      newVotedNFTs.add(tokenId);
    }
    
    setVotedNFTs(newVotedNFTs);
    localStorage.setItem('votedNFTs', JSON.stringify(Array.from(newVotedNFTs)));
    
    // Update vote count in local state
    setNfts(nfts.map(nft => 
      nft.tokenId === tokenId 
        ? { ...nft, votes: newVotedNFTs.has(tokenId) ? 1 : 0 }
        : nft
    ));
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Vote</h1>
          <div className="flex justify-center">
            <UserProfile />
          </div>
        </header>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            <p className="text-gray-400 mt-4">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nfts.map((nft) => (
              <MusicNFTCard
                key={nft.tokenId}
                nft={nft}
                onVote={() => handleVote(nft.tokenId)}
                hasVoted={votedNFTs.has(nft.tokenId)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

