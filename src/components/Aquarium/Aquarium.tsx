'use client';

import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { Bubbles } from '@/components/Aquarium/Bubbles';
import { AquariumPlants } from '@/components/Aquarium/AquariumPlants';
import { AquariumDecor } from '@/components/Aquarium/AquariumDecor';
import { FishContainer } from '@/components/Aquarium/FishContainer';
import { Snail } from '@/components/Aquarium/Snail';
import { AqualogPromoContent } from '@/components/Aquarium/AqualogPromoContent';
import { FishPosition } from '@/components/common/types';

const Aquarium = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [fishPositions, setFishPositions] = useState<FishPosition[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (windowSize.width === 0 || windowSize.height === 0) return;

    const generateFish = (numFish: number) => {
      const fishArray = [];
      for (let i = 0; i < numFish; i++) {
        fishArray.push({
          x: Math.random() * windowSize.width,
          y: Math.random() * (windowSize.height - 100),
          directionX: Math.random() < 0.5 ? 1 : -1,
          directionY: Math.random() < 0.5 ? 1 : -1,
          speedX: 30 + Math.random() * 30,
          speedY: 20 + Math.random() * 30
        });
      }
      return fishArray;
    };

    setFishPositions(generateFish(4));
  }, [windowSize]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-blue-900 via-blue-600 to-blue-400 p-4 font-[family-name:var(--font-geist-sans)]">
      <div className="absolute inset-0 overflow-hidden">
        <Bubbles />
        <FishContainer fishPositions={fishPositions} />
        <AquariumPlants />
        <AquariumDecor />
        <Snail />
      </div>
      <div className="mb-8 text-center">
        <div className="inline-flex items-center">
          <Activity className="mr-4 h-16 w-16 text-green-400 drop-shadow-lg filter" />
          <h1 className="text-6xl font-bold text-white drop-shadow-lg filter">Aqualog</h1>
        </div>
      </div>
      <AqualogPromoContent />
    </div>
  );
};

export { Aquarium };
