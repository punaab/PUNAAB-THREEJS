import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const OPENSEA_API_BASE = 'https://api.opensea.io/api/v2';
const OPENSEA_WARPLETS_COLLECTION = 'the-warplets-farcaster';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const walletAddress = searchParams.get('wallet');
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENSEA_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenSea API key not configured' },
        { status: 500 }
      );
    }

    // Fetch NFTs owned by the wallet from The Warplets collection
    const response = await fetch(
      `${OPENSEA_API_BASE}/chain/base/account/${walletAddress}/nfts?collection=${OPENSEA_WARPLETS_COLLECTION}`,
      {
        headers: {
          'X-API-KEY': apiKey,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenSea API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch NFTs from OpenSea' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Transform the data to a simpler format
    const nfts = data.nfts?.map((nft: any) => ({
      tokenId: nft.identifier,
      name: nft.name || `Warplet #${nft.identifier}`,
      imageUrl: nft.image_url,
      description: nft.description,
      contractAddress: nft.contract,
    })) || [];

    return NextResponse.json({ nfts });
  } catch (error) {
    console.error('Error fetching user NFTs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

