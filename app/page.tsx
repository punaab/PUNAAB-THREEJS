'use client';

import { useState } from 'react';
import { useFarcaster } from '@/contexts/FarcasterContext';
import UserProfile from '@/components/UserProfile';
import AuthButton from '@/components/AuthButton';
import WarpletSelector from '@/components/WarpletSelector';
import SongMachine from '@/components/SongMachine';
import QuestionFlow from '@/components/QuestionFlow';
import { useRouter } from 'next/navigation';

interface Warplet {
  tokenId: string;
  name: string;
  imageUrl: string;
  description?: string;
  contractAddress: string;
}

export default function Home() {
  const { isAuthenticated } = useFarcaster();
  const router = useRouter();
  const [selectedWarplet, setSelectedWarplet] = useState<Warplet | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStart = () => {
    if (selectedWarplet) {
      setShowQuestions(true);
    }
  };

  const handleQuestionComplete = async (answers: Record<string, any>) => {
    if (!selectedWarplet) return;

    setIsGenerating(true);
    try {
      // Navigate to generation page with data
      router.push(`/generate?warplet=${selectedWarplet.tokenId}&warpletImage=${encodeURIComponent(selectedWarplet.imageUrl)}&answers=${encodeURIComponent(JSON.stringify(answers))}`);
    } catch (error) {
      console.error('Error starting generation:', error);
      setIsGenerating(false);
    }
  };

  const handleQuestionCancel = () => {
    setShowQuestions(false);
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 flex justify-between items-center">
            <h1 className="text-4xl font-bold text-white">The Warplets Music</h1>
            <AuthButton />
          </header>
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-12 text-center border border-purple-500/30">
            <h2 className="text-2xl font-semibold text-white mb-4">Welcome</h2>
            <p className="text-gray-300 mb-6">
              Sign in with Farcaster to start generating music NFTs for your Warplets
            </p>
            <AuthButton />
          </div>
        </div>
      </main>
    );
  }

  if (showQuestions) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 flex justify-between items-center">
            <h1 className="text-4xl font-bold text-white">The Warplets Music</h1>
            <UserProfile />
          </header>
          <QuestionFlow
            onComplete={handleQuestionComplete}
            onCancel={handleQuestionCancel}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">The Warplets Music</h1>
          <UserProfile />
        </header>

        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 mb-6 border border-purple-500/30">
          <h2 className="text-2xl font-semibold text-white mb-4">Select Your Warplet</h2>
          <WarpletSelector
            onSelect={setSelectedWarplet}
            selectedWarplet={selectedWarplet}
          />
        </div>

        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30">
          <SongMachine
            selectedWarplet={selectedWarplet}
            onStart={handleStart}
          />
        </div>
      </div>
    </main>
  );
}
