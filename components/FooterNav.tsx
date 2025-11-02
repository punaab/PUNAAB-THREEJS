'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function FooterNav() {
  const pathname = usePathname();

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/search', icon: '🔍', label: 'Search' },
    { path: '/vote', icon: '❤️', label: 'Vote' },
    { path: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
    { 
      path: 'https://opensea.io/collection/the-warplets-music', 
      icon: '🌊', 
      label: 'OpenSea',
      external: true 
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-purple-500/30 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const content = (
              <div className={`flex flex-col items-center gap-1 transition-all ${
                isActive 
                  ? 'text-purple-400 scale-110' 
                  : 'text-gray-400 hover:text-purple-300'
              }`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all ${
                  isActive 
                    ? 'bg-purple-500/30 ring-2 ring-purple-400' 
                    : 'bg-gray-800/50 hover:bg-purple-500/20'
                }`}>
                  {item.icon}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </div>
            );

            if (item.external) {
              return (
                <a
                  key={item.path}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0"
                >
                  {content}
                </a>
              );
            }

            return (
              <Link
                key={item.path}
                href={item.path}
                className="flex-shrink-0"
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

