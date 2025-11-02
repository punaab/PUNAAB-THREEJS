'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import UserProfile from '@/components/UserProfile';
import { useFarcaster } from '@/contexts/FarcasterContext';

function GenerateContent() {
  const searchParams = useSearchParams();
  const warpletTokenId = searchParams.get('warplet');
  const warpletImageUrl = searchParams.get('warpletImage');
  const answersParam = searchParams.get('answers');
  const { walletAddress } = useFarcaster();
  
  const [status, setStatus] = useState<'generating' | 'success' | 'error'>('generating');
  const [error, setError] = useState<string | null>(null);
  const [nftUrl, setNftUrl] = useState<string | null>(null);

  useEffect(() => {
    if (warpletTokenId && answersParam) {
      generateNFT();
    }
  }, [warpletTokenId, answersParam]);

  const generateNFT = async () => {
    try {
      const answers = JSON.parse(decodeURIComponent(answersParam || '{}'));
      
      // Step 1: Generate art
      const artResponse = await fetch('/api/neynar/generate-art', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          warpletTokenId,
          warpletImageUrl: warpletImageUrl || '',
        }),
      });

      if (!artResponse.ok) {
        throw new Error('Failed to generate art');
      }

      const artData = await artResponse.json();

      // Step 2: Generate music
      const musicResponse = await fetch('/api/suno/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalityAnswers: answers,
          warpletName: `Warplet #${warpletTokenId}`,
        }),
      });

      if (!musicResponse.ok) {
        throw new Error('Failed to generate music');
      }

      const musicData = await musicResponse.json();

      // Step 3: Mint NFT
      const walletAddr = typeof walletAddress === 'string' ? walletAddress : '';
      const mintResponse = await fetch('/api/opensea/mint-nft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenId: warpletTokenId,
          imageUrl: artData.imageUrl,
          animationUrl: musicData.audioUrl,
          name: `${musicData.title || `Warplet Music #${warpletTokenId}`}`,
          description: `AI-generated music NFT for Warplet #${warpletTokenId}`,
          walletAddress: walletAddr,
        }),
      });

      if (!mintResponse.ok) {
        throw new Error('Failed to mint NFT');
      }

      const mintData = await mintResponse.json();
      setStatus('success');
      // Set NFT URL based on response
      if (mintData.contractAddress && mintData.tokenId) {
        setNftUrl(`https://opensea.io/assets/base/${mintData.contractAddress}/${mintData.tokenId}`);
      }
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Generation failed');
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-lg p-12 text-center border border-purple-500/30">
      {status === 'generating' && (
        <>
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-4">Generating Your Music NFT...</h2>
          <p className="text-gray-400">This may take a few minutes</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-4">Success!</h2>
          <p className="text-gray-400 mb-6">Your music NFT has been generated</p>
          {nftUrl && (
            <a
              href={nftUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              View on OpenSea
            </a>
          )}
        </>
      )}

      {status === 'error' && (
        <>
          <div className="text-6xl mb-6">❌</div>
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-red-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Try Again
          </button>
        </>
      )}
    </div>
  );
}

export default function GeneratePage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Generate Music NFT</h1>
          <div className="flex justify-center">
            <UserProfile />
          </div>
        </header>

        <Suspense fallback={
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-12 text-center border border-purple-500/30">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mb-6"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        }>
          <GenerateContent />
        </Suspense>
      </div>
    </main>
  );
}
