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
        
        // Get wallet address from Farcaster context
        // The SDK should provide wallet information in context
        const context = sdk.context;
        
        // Try to get wallet from context (this may vary based on SDK version)
        // For now, we'll use the connected wallet if available
        if (context?.client?.connectedAddress) {
          setWalletAddress(context.client.connectedAddress);
        } else if (context?.wallet?.address) {
          setWalletAddress(context.wallet.address);
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

