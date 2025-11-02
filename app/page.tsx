'use client';

import AuthButton from '@/components/AuthButton';
import ThreeScene from '@/components/ThreeScene';
import { useFarcaster } from '@/contexts/FarcasterContext';

export default function Home() {
  const { isAuthenticated } = useFarcaster();

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Farcaster Mini App
          </h1>
          <p className="text-gray-600 mb-6">
            A mini app with Farcaster authentication and Three.js integration
          </p>
          <div className="flex justify-between items-center">
            <AuthButton />
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {isAuthenticated ? (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Welcome! 🎉</h2>
              <p className="text-gray-600 mb-6">
                You're successfully authenticated. Check out the Three.js scene below:
              </p>
              <ThreeScene />
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
              <p className="text-gray-600 mb-6">
                Sign in with Farcaster to explore the 3D scene
              </p>
              <AuthButton />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

