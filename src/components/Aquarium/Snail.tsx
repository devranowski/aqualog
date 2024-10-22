import { Snail as SnailIcon } from 'lucide-react';

const Snail = () => (
  <>
    <div className="snail-container bottom-1/4 left-0 z-50">
      <div className="snail-wrapper snail-left">
        <SnailIcon className="h-8 w-8 text-pink-400" />
      </div>
    </div>
    <div className="snail-container bottom-1/2 left-0 z-50">
      <div className="snail-wrapper snail-left">
        <SnailIcon className="h-12 w-12 text-purple-400" />
      </div>
    </div>
    <div className="snail-container snail-container-right bottom-1/3 right-0 z-50">
      <div className="snail-wrapper snail-right">
        <SnailIcon className="h-16 w-16 text-blue-400" />
      </div>
    </div>
  </>
);

export { Snail };
