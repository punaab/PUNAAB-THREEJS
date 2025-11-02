import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { FarcasterProvider } from '@/contexts/FarcasterContext';
import VantaBackground from '@/components/VantaBackground';
import FooterNav from '@/components/FooterNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'The Warplets Music',
  description: 'Generate music NFTs for your Warplets using AI',
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
          <VantaBackground />
          <div className="relative min-h-screen pb-20">
            {children}
          </div>
          <FooterNav />
        </FarcasterProvider>
      </body>
    </html>
  );
}

