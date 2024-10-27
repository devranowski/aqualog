import { Shell } from 'lucide-react';

const AquariumDecor = () => (
  <div className="pb-safe absolute inset-x-0 bottom-0">
    <Shell className="absolute bottom-2 left-[18%] z-10 h-8 w-8 rotate-45 transform text-amber-200" />
    <Shell className="-rotate-15 absolute bottom-9 left-[60%] z-10 h-10 w-10 transform text-amber-300" />
    <Shell className="rotate-30 absolute bottom-5 left-[80%] z-10 h-12 w-12 transform text-amber-100" />
    <div className="sandy-ground"></div>
    <div className="stone stone-1"></div>
    <div className="stone stone-2"></div>
    <div className="stone stone-3"></div>
  </div>
);

export { AquariumDecor };
