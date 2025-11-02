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

  // Function to get wallet address from Ethereum provider
  const getWalletAddressFromProvider = async () => {
    try {
      // Check if wallet provider capability is available
      if (sdk.wallet?.getEthereumProvider) {
        const provider = await sdk.wallet.getEthereumProvider();
        if (provider && provider.request) {
          const accounts = await provider.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            return accounts[0];
          }
          // Try requesting accounts if not already connected
          const requestedAccounts = await provider.request({ method: 'eth_requestAccounts' });
          if (requestedAccounts && requestedAccounts.length > 0) {
            return requestedAccounts[0];
          }
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting wallet from provider:', error);
      return null;
    }
  };

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
                : String(currentUser.username || ''))
            : '';
          const displayName = currentUser.displayName 
            ? (typeof currentUser.displayName === 'string' 
                ? currentUser.displayName 
                : String(currentUser.displayName || ''))
            : '';
          
          setUser({
            fid: currentUser.fid,
            username: username || '',
            displayName: displayName || 'User',
            pfpUrl: typeof currentUser.pfpUrl === 'string' ? currentUser.pfpUrl : undefined,
          });
          setIsAuthenticated(true);
          
          // Try to get wallet address - multiple methods
          try {
            // Log context structure for debugging
            console.log('Farcaster context:', context);
            console.log('Context wallet:', (context as any)?.wallet);
            console.log('Context client:', (context as any)?.client);
            
            // Method 1: Try Ethereum provider
            let walletAddr: string | Promise<string> | null = await getWalletAddressFromProvider();
            
            // Method 2: Try context paths if provider didn't work
            if (!walletAddr) {
              const contextWalletAddr = (context as any)?.wallet?.address || 
                                       (context as any)?.client?.connectedAddress ||
                                       (context as any)?.client?.walletAddress ||
                                       (context as any)?.account?.address ||
                                       null;
              walletAddr = contextWalletAddr;
            }
            
            console.log('Wallet address found:', walletAddr);
            
            // Handle wallet address - check if it's a Promise or string
            if (!walletAddr) {
              console.warn('No wallet address found in context');
              setWalletAddress(null);
            } else if (typeof walletAddr === 'string') {
              setWalletAddress(walletAddr);
              console.log('Wallet address set:', walletAddr);
            } else if (walletAddr && typeof (walletAddr as any).then === 'function') {
              // If it's a Promise, await it
              (walletAddr as Promise<string>).then((addr: string) => {
                if (typeof addr === 'string') {
                  setWalletAddress(addr);
                  console.log('Wallet address set from promise:', addr);
                }
              }).catch(() => {
                // If wallet address fetch fails, continue without it
                setWalletAddress(null);
              });
            } else {
              console.warn('Wallet address is not a valid string or Promise');
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
      try {
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
                  : String(currentUser.username || ''))
              : '';
            const displayName = currentUser.displayName 
              ? (typeof currentUser.displayName === 'string' 
                  ? currentUser.displayName 
                  : String(currentUser.displayName || ''))
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
              // Log context structure for debugging
              console.log('Farcaster context (signIn):', context);
              console.log('Context wallet (signIn):', (context as any)?.wallet);
              console.log('Context client (signIn):', (context as any)?.client);
              
              // Method 1: Try Ethereum provider
              let walletAddr: string | Promise<string> | null = await getWalletAddressFromProvider();
              
              // Method 2: Try context paths if provider didn't work
              if (!walletAddr) {
                const contextWalletAddr = (context as any)?.wallet?.address || 
                                         (context as any)?.client?.connectedAddress ||
                                         (context as any)?.client?.walletAddress ||
                                         (context as any)?.account?.address ||
                                         null;
                walletAddr = contextWalletAddr;
              }
              
              console.log('Wallet address found (signIn):', walletAddr);
              
              // Handle wallet address - check if it's a Promise or string
              if (!walletAddr) {
                console.warn('No wallet address found in context (signIn)');
                setWalletAddress(null);
              } else if (typeof walletAddr === 'string') {
                setWalletAddress(walletAddr);
                console.log('Wallet address set (signIn):', walletAddr);
              } else if (walletAddr && typeof (walletAddr as any).then === 'function') {
                // If it's a Promise, await it
                (walletAddr as Promise<string>).then((addr: string) => {
                  if (typeof addr === 'string') {
                    setWalletAddress(addr);
                    console.log('Wallet address set from promise (signIn):', addr);
                  }
                }).catch(() => {
                  // If wallet address fetch fails, continue without it
                  setWalletAddress(null);
                });
              } else {
                console.warn('Wallet address is not a valid string or Promise (signIn)');
                setWalletAddress(null);
              }
            } catch (err) {
              console.error('Error getting wallet address (signIn):', err);
              setWalletAddress(null);
            }
          }
        }
      } catch (authError: any) {
        // Handle Farcaster client not available gracefully
        if (authError?.message?.includes('result') || 
            authError?.message?.includes('undefined') ||
            authError?.code === 'ECONNREFUSED') {
          console.warn('Farcaster authentication requires running within a Farcaster client. The app will work in development mode.');
          // Don't throw - gracefully handle the case where Farcaster client is not available
          return;
        }
        throw authError; // Re-throw other errors
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
