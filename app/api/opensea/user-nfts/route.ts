import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const OPENSEA_API_BASE = 'https://api.opensea.io/api/v2';
const OPENSEA_WARPLETS_COLLECTION = 'the-warplets-farcaster';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const walletAddress = searchParams.get('wallet');
    
    console.log('OpenSea API: Fetching NFTs for wallet:', walletAddress);
    
    if (!walletAddress) {
      console.error('OpenSea API: Wallet address is missing');
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENSEA_API_KEY;
    if (!apiKey) {
      console.error('OpenSea API: API key not configured');
      return NextResponse.json(
        { error: 'OpenSea API key not configured' },
        { status: 500 }
      );
    }

    // Fetch NFTs owned by the wallet from The Warplets collection
    const apiUrl = `${OPENSEA_API_BASE}/chain/base/account/${walletAddress}/nfts?collection=${OPENSEA_WARPLETS_COLLECTION}`;
    console.log('OpenSea API: Requesting URL:', apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: {
        'X-API-KEY': apiKey,
      },
    });

    console.log('OpenSea API: Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenSea API error:', errorText);
      console.error('OpenSea API error status:', response.status);
      return NextResponse.json(
        { error: `Failed to fetch NFTs from OpenSea: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('OpenSea API: Response data structure:', Object.keys(data));
    console.log('OpenSea API: Number of NFTs:', data.nfts?.length || 0);
    
    // Transform the data to a simpler format
    const nfts = data.nfts?.map((nft: any) => ({
      tokenId: nft.identifier,
      name: nft.name || `Warplet #${nft.identifier}`,
      imageUrl: nft.image_url,
      description: nft.description,
      contractAddress: nft.contract,
    })) || [];

    console.log('OpenSea API: Returning', nfts.length, 'NFTs');
    return NextResponse.json({ nfts });
  } catch (error) {
    console.error('Error fetching user NFTs:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

