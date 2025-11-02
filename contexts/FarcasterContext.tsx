'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { sdk, quickAuth } from '@farcaster/miniapp-sdk';

interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl?: string;
}

interface FarcasterContextType {
  user: FarcasterUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  walletAddress: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const FarcasterContext = createContext<FarcasterContextType | undefined>(undefined);

export function FarcasterProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    // Initialize SDK and check authentication status
    const initSDK = async () => {
      try {
        // Wait for SDK to be ready
        await sdk.actions.ready();
        
        // Get context - it may be a Promise, so await it
        const context = await (sdk.context instanceof Promise ? sdk.context : Promise.resolve(sdk.context));
        
        // Check if user is already authenticated via context
        const currentUser = context?.user;
        if (currentUser) {
          // Safely convert values to strings, handling edge cases
          const username = currentUser.username 
            ? (typeof currentUser.username === 'string' 
                ? currentUser.username 
                : (currentUser.username?.toString?.() || ''))
            : '';
          const displayName = currentUser.displayName 
            ? (typeof currentUser.displayName === 'string' 
                ? currentUser.displayName 
                : (currentUser.displayName?.toString?.() || ''))
            : '';
          
          setUser({
            fid: currentUser.fid,
            username: username || '',
            displayName: displayName || 'User',
            pfpUrl: typeof currentUser.pfpUrl === 'string' ? currentUser.pfpUrl : undefined,
          });
          setIsAuthenticated(true);
          
          // Try to get wallet address - ensure it's a string, not a Promise
          try {
            const walletAddr = (context as any)?.wallet?.address || 
                             (context as any)?.client?.connectedAddress || 
                             null;
            // Ensure it's a string, not a Promise
            if (walletAddr && typeof walletAddr === 'string') {
              setWalletAddress(walletAddr);
            } else if (walletAddr && typeof walletAddr.then === 'function') {
              // If it's a Promise, await it
              walletAddr.then((addr: string) => {
                if (typeof addr === 'string') {
                  setWalletAddress(addr);
                }
              }).catch(() => {
                // If wallet address fetch fails, continue without it
                setWalletAddress(null);
              });
            } else {
              setWalletAddress(null);
            }
          } catch (err) {
            console.error('Error getting wallet address:', err);
            setWalletAddress(null);
          }
        }
      } catch (error) {
        console.error('Failed to initialize Farcaster SDK:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initSDK();
  }, []);

  const signIn = async () => {
    try {
      setIsLoading(true);
      // Ensure SDK is ready before attempting sign-in
      await sdk.actions.ready();
      
      // Use Quick Auth to get a token
      // Note: This will only work when running inside a Farcaster client
      const { token } = await quickAuth.getToken();
      
      if (token) {
        // Get context - it may be a Promise, so await it
        const context = await (sdk.context instanceof Promise ? sdk.context : Promise.resolve(sdk.context));
        
        // After getting token, user info should be available in context
        const currentUser = context?.user;
        if (currentUser) {
          // Safely convert values to strings, handling edge cases
          const username = currentUser.username 
            ? (typeof currentUser.username === 'string' 
                ? currentUser.username 
                : (currentUser.username?.toString?.() || ''))
            : '';
          const displayName = currentUser.displayName 
            ? (typeof currentUser.displayName === 'string' 
                ? currentUser.displayName 
                : (currentUser.displayName?.toString?.() || ''))
            : '';
          
          setUser({
            fid: currentUser.fid,
            username: username || '',
            displayName: displayName || 'User',
            pfpUrl: typeof currentUser.pfpUrl === 'string' ? currentUser.pfpUrl : undefined,
          });
          setIsAuthenticated(true);
          
          // Try to get wallet address - ensure it's a string, not a Promise
          try {
            const walletAddr = (context as any)?.wallet?.address || 
                             (context as any)?.client?.connectedAddress || 
                             null;
            // Ensure it's a string, not a Promise
            if (walletAddr && typeof walletAddr === 'string') {
              setWalletAddress(walletAddr);
            } else if (walletAddr && typeof walletAddr.then === 'function') {
              // If it's a Promise, await it
              walletAddr.then((addr: string) => {
                if (typeof addr === 'string') {
                  setWalletAddress(addr);
                }
              }).catch(() => {
                // If wallet address fetch fails, continue without it
                setWalletAddress(null);
              });
            } else {
              setWalletAddress(null);
            }
          } catch (err) {
            console.error('Error getting wallet address:', err);
            setWalletAddress(null);
          }
        }
      }
    } catch (error: any) {
      console.error('Sign in failed:', error);
      // In development, show a helpful message if not in Farcaster environment
      if (error?.message?.includes('result') || error?.message?.includes('undefined')) {
        console.warn('Note: Farcaster authentication requires running within a Farcaster client. The app will work in development mode.');
      }
      // Don't throw - let the UI handle the error state
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Clear local state
      setUser(null);
      setIsAuthenticated(false);
      setWalletAddress(null);
      // Note: The SDK doesn't have a signOut method, so we just clear local state
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <FarcasterContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        walletAddress,
        signIn,
        signOut,
      }}
    >
      {children}
    </FarcasterContext.Provider>
  );
}

export function useFarcaster() {
  const context = useContext(FarcasterContext);
  if (context === undefined) {
    throw new Error('useFarcaster must be used within a FarcasterProvider');
  }
  return context;
}
