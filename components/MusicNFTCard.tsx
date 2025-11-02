'use client';

import MusicPlayer from './MusicPlayer';

interface MusicNFTCardProps {
  nft: {
    tokenId: string;
    name: string;
    imageUrl: string;
    animationUrl?: string;
    description?: string;
    votes?: number;
  };
  onVote?: () => void;
  hasVoted?: boolean;
  className?: string;
}

export default function MusicNFTCard({ nft, onVote, hasVoted = false, className = '' }: MusicNFTCardProps) {
  return (
    <div className={`bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden border border-purple-500/30 transition-all hover:border-purple-400 ${className}`}>
      <div className="relative aspect-square">
        <img
          src={nft.imageUrl}
          alt={nft.name}
          className="w-full h-full object-cover"
        />
        {nft.votes !== undefined && (
          <div className="absolute top-2 right-2 bg-black/70 px-3 py-1 rounded-full flex items-center gap-2">
            <span className="text-lg">❤️</span>
            <span className="text-white font-semibold">{nft.votes}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2">{nft.name}</h3>
        {nft.description && (
          <p className="text-sm text-gray-400 mb-3 line-clamp-2">{nft.description}</p>
        )}
        {nft.animationUrl && (
          <MusicPlayer audioUrl={nft.animationUrl} className="mb-3" />
        )}
        {onVote && (
          <button
            onClick={onVote}
            className={`w-full px-4 py-2 rounded-lg transition-colors ${
              hasVoted
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            {hasVoted ? '❤️ Unvote' : '❤️ Vote'}
          </button>
        )}
        <a
          href={`https://opensea.io/assets/base/${process.env.NEXT_PUBLIC_OPENSEA_MUSIC_CONTRACT_ADDRESS || '0xdf84aa7ac970dcdf66195419c74ec754569d528c'}/${nft.tokenId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block text-center text-sm text-purple-400 hover:text-purple-300 underline"
        >
          View on OpenSea
        </a>
      </div>
    </div>
  );
}

