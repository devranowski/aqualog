'use client';

import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { Bubbles } from '@/components/Aquarium/Bubbles';
import { AquariumPlants } from '@/components/Aquarium/AquariumPlants';
import { AquariumDecor } from '@/components/Aquarium/AquariumDecor';
import { Fish } from '@/components/Aquarium/Fish';
import { Snail } from '@/components/Aquarium/Snail';
import { AqualogPromoContent } from '@/components/Aquarium/AqualogPromoContent';
import { FishPosition } from '@/components/common/types';

const Aquarium = () => {
  const [fishPositions, setFishPositions] = useState<FishPosition[]>([
    { x: 20, y: 30, direction: 1, speedX: 0.5, speedY: 0.3, amplitudeX: 40, amplitudeY: 30 },
    { x: 70, y: 60, direction: -1, speedX: 0.4, speedY: 0.5, amplitudeX: 50, amplitudeY: 25 },
    { x: 40, y: 80, direction: 1, speedX: 0.6, speedY: 0.2, amplitudeX: 30, amplitudeY: 40 },
    { x: 90, y: 20, direction: -1, speedX: 0.3, speedY: 0.4, amplitudeX: 45, amplitudeY: 35 }
  ]);

  useEffect(() => {
    const animateFish = () => {
      const time = Date.now() * 0.001;
      setFishPositions((prevPositions) =>
        prevPositions.map((fish) => {
          const newX = (Math.sin(time * fish.speedX) * fish.amplitudeX + 50) % 100;
          const newY = (Math.cos(time * fish.speedY) * fish.amplitudeY + 50) % 100;
          const newDirection = newX > fish.x ? 1 : -1;
          return {
            ...fish,
            x: newX,
            y: newY,
            direction: newDirection
          };
        })
      );
    };

    const intervalId = setInterval(animateFish, 50);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-blue-900 via-blue-600 to-blue-400 p-4 font-[family-name:var(--font-geist-sans)]">
      <div className="absolute inset-0 overflow-hidden">
        <Bubbles />
        <Fish fishPositions={fishPositions} />
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

export default Aquarium;
