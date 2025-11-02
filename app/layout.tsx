import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { FarcasterProvider } from '@/contexts/FarcasterContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Farcaster Mini App',
  description: 'A Farcaster mini app with Three.js integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FarcasterProvider>
          {children}
        </FarcasterProvider>
      </body>
    </html>
  );
}

