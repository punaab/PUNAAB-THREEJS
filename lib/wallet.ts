'use client';

import { sdk } from '@farcaster/miniapp-sdk';
import { useEffect, useState } from 'react';

export function useWallet() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getWalletAddress = async () => {
      try {
        await sdk.actions.ready();
        
        // Get context - it may be a Promise, so await it
        const contextPromise = sdk.context instanceof Promise ? sdk.context : Promise.resolve(sdk.context);
        const context = await contextPromise;
        
        // Try to get wallet from context (this may vary based on SDK version)
        // For now, we'll use the connected wallet if available
        const walletAddress = (context as any)?.client?.connectedAddress || 
                             (context as any)?.wallet?.address || 
                             null;
        if (walletAddress && typeof walletAddress === 'string') {
          setWalletAddress(walletAddress);
        }
      } catch (error) {
        console.error('Failed to get wallet address:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getWalletAddress();
  }, []);

  return { walletAddress, isLoading };
}

