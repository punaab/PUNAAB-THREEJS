import { NextRequest, NextResponse } from 'next/server';

const OPENSEA_API_BASE = 'https://api.opensea.io/api/v2';
const OPENSEA_MUSIC_COLLECTION = 'the-warplets-music';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const apiKey = process.env.OPENSEA_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenSea API key not configured' },
        { status: 500 }
      );
    }

    // Fetch NFTs from The Warplets Music collection
    const url = query
      ? `${OPENSEA_API_BASE}/chain/base/collection/${OPENSEA_MUSIC_COLLECTION}/nfts?limit=${limit}&offset=${offset}`
      : `${OPENSEA_API_BASE}/chain/base/collection/${OPENSEA_MUSIC_COLLECTION}/nfts?limit=${limit}&offset=${offset}`;

    const response = await fetch(url, {
      headers: {
        'X-API-KEY': apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenSea API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch NFTs from OpenSea' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Filter by query if provided
    let nfts = data.nfts || [];
    if (query) {
      const queryLower = query.toLowerCase();
      nfts = nfts.filter((nft: any) =>
        nft.name?.toLowerCase().includes(queryLower) ||
        nft.description?.toLowerCase().includes(queryLower) ||
        nft.identifier?.includes(query)
      );
    }

    // Transform the data
    const transformedNfts = nfts.map((nft: any) => ({
      tokenId: nft.identifier,
      name: nft.name || `Warplet Music #${nft.identifier}`,
      imageUrl: nft.image_url,
      description: nft.description,
      animationUrl: nft.animation_url, // MP3 file
      contractAddress: nft.contract,
      traits: nft.traits || [],
    }));

    return NextResponse.json({
      nfts: transformedNfts,
      total: transformedNfts.length,
    });
  } catch (error) {
    console.error('Error searching music NFTs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

