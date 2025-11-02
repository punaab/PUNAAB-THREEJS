'use client';

interface WarpletCardProps {
  warplet: {
    tokenId: string;
    name: string;
    imageUrl: string;
    description?: string;
  };
  onClick?: () => void;
  className?: string;
}

export default function WarpletCard({ warplet, onClick, className = '' }: WarpletCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden border border-purple-500/30 transition-all hover:border-purple-400 hover:scale-105 cursor-pointer ${className}`}
    >
      <div className="relative aspect-square">
        <img
          src={warplet.imageUrl}
          alt={warplet.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-1">{warplet.name}</h3>
        {warplet.description && (
          <p className="text-sm text-gray-400 line-clamp-2">{warplet.description}</p>
        )}
        <div className="mt-2 text-xs text-purple-400">Token ID: {warplet.tokenId}</div>
      </div>
    </div>
  );
}

