'use client';

import { sdk, quickAuth } from '@farcaster/miniapp-sdk';

/**
 * Initialize the Farcaster Mini App SDK
 * Call this once when your app starts
 */
export async function initializeFarcasterSDK() {
  try {
    await sdk.actions.ready();
    return true;
  } catch (error) {
    console.error('Failed to initialize Farcaster SDK:', error);
    return false;
  }
}

/**
 * Get the current SDK instance
 */
export function getSDK() {
  return sdk;
}

/**
 * Get Quick Auth instance
 */
export function getQuickAuth() {
  return quickAuth;
}

