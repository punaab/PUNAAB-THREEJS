'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    VANTA: {
      FOG: (options: any) => any;
    };
    THREE: any;
  }
}

export default function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !vantaRef.current) return;

    // Load Vanta.js dynamically
    const loadVanta = async () => {
      if (typeof window === 'undefined') return;
      
      if (!window.VANTA) {
        // Load three.js if not already loaded
        if (!window.THREE) {
          const threeScript = document.createElement('script');
          threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
          threeScript.onload = () => {
            loadVantaScript();
          };
          document.head.appendChild(threeScript);
        } else {
          loadVantaScript();
        }
      } else {
        initVanta();
      }
    };

    const loadVantaScript = () => {
      const vantaScript = document.createElement('script');
      vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.fog.min.js';
      vantaScript.onload = () => {
        initVanta();
      };
      document.head.appendChild(vantaScript);
    };

    const initVanta = () => {
      if (!vantaRef.current || !window.VANTA) return;

      effectRef.current = window.VANTA.FOG({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        highlightColor: 0xc300ff,
        midtoneColor: 0x96ff,
        lowlightColor: 0xefff00,
        baseColor: 0x0,
        blurFactor: 0.10,
        speed: 1.40,
        zoom: 1.30,
      });
    };

    loadVanta();

    return () => {
      if (effectRef.current) {
        effectRef.current.destroy?.();
      }
    };
  }, [isMounted]);

  if (!isMounted) {
    return <div className="fixed inset-0 -z-10 bg-black" />;
  }

  return (
    <div
      ref={vantaRef}
      className="fixed inset-0 -z-10"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

