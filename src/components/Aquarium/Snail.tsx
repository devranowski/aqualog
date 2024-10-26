import { Snail as SnailIcon } from 'lucide-react';

const Snail = () => (
  <>
    <div
      className="snail-container bottom-1/4 left-0 z-50"
      style={{
        animationDuration: '20s',
        animationDelay: '-2s'
      }}
    >
      <div
        className="snail-wrapper snail-left"
        style={{
          animationDuration: '20s',
          animationDelay: '-2s'
        }}
      >
        <SnailIcon className="h-8 w-8 text-pink-400" />
      </div>
    </div>

    <div
      className="snail-container bottom-1/2 left-0 z-50"
      style={{
        animationDuration: '25s',
        animationDelay: '-10s'
      }}
    >
      <div
        className="snail-wrapper snail-left"
        style={{
          animationDuration: '25s',
          animationDelay: '-10s'
        }}
      >
        <SnailIcon className="h-12 w-12 text-purple-400" />
      </div>
    </div>

    <div
      className="snail-container snail-container-right bottom-1/3 right-0 z-50"
      style={{
        animationDuration: '30s',
        animationDelay: '-5s'
      }}
    >
      <div
        className="snail-wrapper snail-right"
        style={{
          animationDuration: '30s',
          animationDelay: '-5s'
        }}
      >
        <SnailIcon className="h-16 w-16 text-blue-400" />
      </div>
    </div>
  </>
);

export { Snail };
