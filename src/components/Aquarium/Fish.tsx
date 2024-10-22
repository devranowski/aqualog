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
          left: `${fish.x}%`,
          top: `${fish.y}%`,
          transform: `scaleX(${fish.direction})`
        }}
      >
        <FishIcon
          className={`text-${['orange', 'yellow', 'red', 'purple'][index]}-400 opacity-80 w-${[12, 10, 8, 16][index]} h-${[12, 10, 8, 16][index]}`}
        />
      </div>
    ))}
  </>
);

export { Fish };
