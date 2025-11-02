import axios from 'axios';

const OPENSEA_API_BASE = 'https://api.opensea.io/api/v2';

export async function getUserNFTs(walletAddress: string, collectionSlug?: string) {
  const apiKey = process.env.OPENSEA_API_KEY;
  if (!apiKey) {
    throw new Error('OpenSea API key not configured');
  }

  const url = collectionSlug
    ? `${OPENSEA_API_BASE}/chain/base/account/${walletAddress}/nfts?collection=${collectionSlug}`
    : `${OPENSEA_API_BASE}/chain/base/account/${walletAddress}/nfts`;

  const response = await axios.get(url, {
    headers: {
      'X-API-KEY': apiKey,
    },
  });

  return response.data.nfts || [];
}

export async function searchMusicNFTs(query?: string, limit = 50, offset = 0) {
  const apiKey = process.env.OPENSEA_API_KEY;
  if (!apiKey) {
    throw new Error('OpenSea API key not configured');
  }

  const url = `${OPENSEA_API_BASE}/chain/base/collection/the-warplets-music/nfts?limit=${limit}&offset=${offset}`;

  const response = await axios.get(url, {
    headers: {
      'X-API-KEY': apiKey,
    },
  });

  let nfts = response.data.nfts || [];

  if (query) {
    const queryLower = query.toLowerCase();
    nfts = nfts.filter((nft: any) =>
      nft.name?.toLowerCase().includes(queryLower) ||
      nft.description?.toLowerCase().includes(queryLower) ||
      nft.identifier?.includes(query)
    );
  }

  return nfts;
}

export function getOpenSeaNFTUrl(contractAddress: string, tokenId: string) {
  return `https://opensea.io/assets/base/${contractAddress}/${tokenId}`;
}

