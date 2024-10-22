import { Fish as FishIcon } from 'lucide-react';
import { FishPosition } from '@/components/common/types';

interface FishProps {
  fishPositions: FishPosition[];
}

const Fish = ({ fishPositions }: FishProps) => (
  <>
    {fishPositions.map((fish, index) => (
      <div
        key={index}
        className="fish-container"
        style={{
          left: `${fish.x}px`,
          top: `${fish.y}px`,
          transform: `scaleX(${fish.directionX})`
        }}
      >
        <FishIcon
          className={`text-${
            ['orange', 'yellow', 'red', 'purple'][index % 4]
          }-400 opacity-80 w-${[12, 10, 8, 16][index % 4]} h-${[12, 10, 8, 16][index % 4]}`}
        />
      </div>
    ))}
  </>
);

export { Fish };
