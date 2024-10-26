'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Fish as FishIcon } from 'lucide-react';
import { FishPosition } from '@/components/common/types';

interface FishProps {
  initialPosition: FishPosition;
  index: number;
}

const colorVariants = ['orange', 'yellow', 'red', 'purple'];
const sizeVariants = [12, 10, 8, 16];

const Fish = ({ initialPosition, index }: FishProps) => {
  const [position, setPosition] = useState(initialPosition);
  const lastTimeRef = useRef(Date.now());
  const requestRef = useRef<number>();

  const animate = useCallback(() => {
    const currentTime = Date.now();
    const deltaTime = (currentTime - lastTimeRef.current) / 1000;
    lastTimeRef.current = currentTime;

    setPosition((prev) => {
      let newX = prev.x + prev.speedX * deltaTime * prev.directionX;
      let newY = prev.y + prev.speedY * deltaTime * prev.directionY;
      let newDirectionX = prev.directionX;
      let newDirectionY = prev.directionY;

      if (newX <= 0 || newX >= window.innerWidth) {
        newDirectionX *= -1;
        newX = prev.x + prev.speedX * deltaTime * newDirectionX;
      }

      if (newY <= 0 || newY >= window.innerHeight - 100) {
        newDirectionY *= -1;
        newY = prev.y + prev.speedY * deltaTime * newDirectionY;
      }

      return {
        ...prev,
        x: newX,
        y: newY,
        directionX: newDirectionX,
        directionY: newDirectionY
      };
    });

    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);

  return (
    <div
      className="fish-container absolute transform-gpu transition-transform duration-100 will-change-transform"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `scaleX(${position.directionX})`
      }}
    >
      <FishIcon
        className={`text-${colorVariants[index % 4]}-400 opacity-80 w-${
          sizeVariants[index % 4]
        } h-${sizeVariants[index % 4]}`}
      />
    </div>
  );
};

export { Fish };
