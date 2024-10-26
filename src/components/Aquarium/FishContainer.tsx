import { FishPosition } from '@/components/common/types';
import { memo } from 'react';
import { Fish } from '@/components/Aquarium/Fish';

interface FishContainerProps {
  fishPositions: FishPosition[];
}

const FishContainer = memo(({ fishPositions }: FishContainerProps) => (
  <>
    {fishPositions.map((fish, index) => (
      <Fish key={index} initialPosition={fish} index={index} />
    ))}
  </>
));

FishContainer.displayName = 'FishContainer';

export { FishContainer };
