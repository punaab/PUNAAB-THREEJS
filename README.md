# The Warplets Music

A Farcaster mini app for generating music NFTs from your Warplets collection using AI (Neynar & Suno).

## Features

- 🔐 Farcaster authentication using `@farcaster/miniapp-sdk`
- 🎨 Vanta.js FOG animated background
- 🎵 AI-powered music generation with Suno
- 🖼️ AI art generation with Neynar
- 🎫 NFT minting to OpenSea
- 🔍 Search The Warplets Music collection
- ❤️ Vote on music NFTs
- 🏆 Leaderboard of top tracks
- 📱 Farcaster Mini App manifest configuration
- ⚡ Next.js 14 with App Router
- 🎯 TypeScript support

## Getting Started

### Prerequisites

- Node.js 22.11.0 or higher
- npm or yarn
- API keys for OpenSea, Neynar, and Suno

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file:
```bash
cp .env.example .env.local
```

3. Fill in your API keys in `.env.local`:
```env
OPENSEA_API_KEY=your_opensea_api_key_here
NEYNAR_API_KEY=your_neynar_api_key_here
SUNO_API_KEY=your_suno_api_key_here
OPENSEA_MUSIC_CONTRACT_ADDRESS=0xdf84aa7ac970dcdf66195419c74ec754569d528c
OPENSEA_WARPLETS_CONTRACT_ADDRESS=your_warplets_contract_address_here
```

4. Update the `farcaster.json` manifest file:
   - Edit `.well-known/farcaster.json`
   - Update `canonicalDomain`, `homeUrl`, and `iconUrl` with your domain when deploying

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing in Farcaster

To test your mini app within Farcaster:

1. Enable Developer Mode:
   - Go to `https://farcaster.xyz/~/settings/developer-tools`
   - Toggle on "Developer Mode"

2. Preview your app:
   - Use the Mini App preview tool at `https://farcaster.xyz/~/developers/mini-apps/preview`
   - Enter your app's URL

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── api/                    # Backend API routes
│   │   ├── opensea/            # OpenSea API endpoints
│   │   ├── neynar/             # Neynar AI endpoints
│   │   └── suno/               # Suno AI endpoints
│   ├── page.tsx                # Home page with song machine
│   ├── search/page.tsx         # Search page
│   ├── vote/page.tsx           # Vote page
│   ├── leaderboard/page.tsx    # Leaderboard page
│   ├── generate/page.tsx        # Generation flow page
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/
│   ├── VantaBackground.tsx     # Vanta FOG background
│   ├── FooterNav.tsx           # Bottom navigation
│   ├── WarpletSelector.tsx     # Warplet selection UI
│   ├── QuestionFlow.tsx        # Personality questions
│   ├── SongMachine.tsx         # START button and machine UI
│   ├── MusicPlayer.tsx         # Audio player
│   ├── WarpletCard.tsx         # Display Warplet NFT
│   ├── MusicNFTCard.tsx        # Display music NFT
│   └── AuthButton.tsx          # Authentication button
├── contexts/
│   └── FarcasterContext.tsx    # Farcaster authentication context
├── lib/
│   ├── opensea.ts              # OpenSea API utilities
│   ├── neynar.ts               # Neynar API utilities
│   ├── suno.ts                 # Suno API utilities
│   ├── wallet.ts               # Wallet utilities
│   └── farcaster.ts            # Farcaster SDK utilities
└── .well-known/
    └── farcaster.json          # Farcaster mini app manifest
```

## How It Works

1. **Select Warplet**: User selects a Warplet NFT from their OpenSea collection
2. **Answer Questions**: User answers personality questions about their Warplet
3. **Generate AI Content**: 
   - Neynar generates art using Warplet likeness
   - Suno generates music based on personality questions
4. **Mint NFT**: Music and artwork are minted to OpenSea as an NFT
5. **Share & Vote**: Users can search, listen, and vote on generated tracks

## Learn More

- [Farcaster Mini Apps Documentation](https://miniapps.farcaster.xyz/docs/getting-started)
- [Farcaster SDK Reference](https://miniapps.farcaster.xyz/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [OpenSea API Documentation](https://docs.opensea.io/)
- [Vanta.js Documentation](https://www.vantajs.com/)

## License

MIT

