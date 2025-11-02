# Farcaster Mini App

A Next.js-based Farcaster mini app with Three.js integration, featuring native Farcaster SDK authentication.

## Features

- 🔐 Farcaster authentication using `@farcaster/miniapp-sdk`
- 🎨 Three.js 3D scene integration using React Three Fiber
- ⚡ Next.js 14 with App Router
- 📱 Farcaster Mini App manifest configuration
- 🎯 TypeScript support

## Getting Started

### Prerequisites

- Node.js 22.11.0 or higher
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file (optional for local development):
```bash
cp .env.example .env.local
```

3. Update the `farcaster.json` manifest file:
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
│   ├── layout.tsx          # Root layout with Farcaster provider
│   ├── page.tsx             # Main page component
│   └── globals.css          # Global styles
├── components/
│   ├── AuthButton.tsx       # Farcaster authentication button
│   └── ThreeScene.tsx       # Three.js scene component
├── contexts/
│   └── FarcasterContext.tsx # Farcaster authentication context
├── lib/
│   └── farcaster.ts         # Farcaster SDK utilities
└── .well-known/
    └── farcaster.json       # Farcaster mini app manifest
```

## Authentication Flow

1. User clicks "Sign in with Farcaster"
2. `sdk.actions.signIn()` is called via the Farcaster SDK
3. SDK handles the authentication modal/flow
4. User credentials are returned and stored in React context
5. User session is managed throughout the app

## Three.js Integration

The app includes a basic Three.js scene using React Three Fiber. You can extend the `ThreeScene` component to add your own 3D content.

Example:
```tsx
<mesh>
  <boxGeometry args={[2, 2, 2]} />
  <meshStandardMaterial color="orange" />
</mesh>
```

## Manifest Configuration

The Farcaster manifest is located at `.well-known/farcaster.json`. Make sure to:

- Update `canonicalDomain` with your actual domain
- Update `homeUrl` and `iconUrl` with your production URLs
- Ensure the manifest is publicly accessible at `https://your-domain.com/.well-known/farcaster.json`

## Learn More

- [Farcaster Mini Apps Documentation](https://miniapps.farcaster.xyz/docs/getting-started)
- [Farcaster SDK Reference](https://miniapps.farcaster.xyz/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)

## License

MIT

