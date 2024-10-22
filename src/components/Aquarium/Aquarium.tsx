'use client';

import { useState, useEffect, useRef } from 'react';
import { Activity } from 'lucide-react';
import { Bubbles } from '@/components/Aquarium/Bubbles';
import { AquariumPlants } from '@/components/Aquarium/AquariumPlants';
import { AquariumDecor } from '@/components/Aquarium/AquariumDecor';
import { Fish } from '@/components/Aquarium/Fish';
import { Snail } from '@/components/Aquarium/Snail';
import { AqualogPromoContent } from '@/components/Aquarium/AqualogPromoContent';
import { FishPosition } from '@/components/common/types';

const Aquarium = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const bufferBottom = 100;

  const [fishPositions, setFishPositions] = useState<FishPosition[]>([]);

  useEffect(() => {
    if (windowSize.width === 0 || windowSize.height === 0) return;

    const generateFish = (numFish: number) => {
      const fishArray = [];
      for (let i = 0; i < numFish; i++) {
        fishArray.push({
          x: Math.random() * windowSize.width,
          y: Math.random() * (windowSize.height - bufferBottom),
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

  const lastTimeRef = useRef(Date.now());

  useEffect(() => {
    const animateFish = () => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      setFishPositions((prevPositions) =>
        prevPositions.map((fish) => {
          let newX = fish.x + fish.speedX * deltaTime * fish.directionX;
          let newY = fish.y + fish.speedY * deltaTime * fish.directionY;
          let newDirectionX = fish.directionX;
          let newDirectionY = fish.directionY;

          if (newX <= 0 || newX >= windowSize.width) {
            newDirectionX *= -1;
            newX = fish.x + fish.speedX * deltaTime * newDirectionX;
          }

          if (newY <= 0 || newY >= windowSize.height - bufferBottom) {
            newDirectionY *= -1;
            newY = fish.y + fish.speedY * deltaTime * newDirectionY;
          }

          return {
            ...fish,
            x: newX,
            y: newY,
            directionX: newDirectionX,
            directionY: newDirectionY
          };
        })
      );
    };

    const intervalId = setInterval(animateFish, 50);
    return () => clearInterval(intervalId);
  }, [windowSize]);

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
