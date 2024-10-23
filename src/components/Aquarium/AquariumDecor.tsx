import { Shell } from 'lucide-react';

const AquariumDecor = () => (
  <>
    <Shell className="absolute bottom-[calc(0.5rem_+_env(safe-area-inset-bottom))] left-[18%] z-10 h-8 w-8 rotate-45 transform text-amber-200" />
    <Shell className="-rotate-15 absolute bottom-[calc(2.25rem_+_env(safe-area-inset-bottom))] left-[60%] z-10 h-10 w-10 transform text-amber-300" />
    <Shell className="rotate-30 absolute bottom-[calc(1.25rem_+_env(safe-area-inset-bottom))] left-[80%] z-10 h-12 w-12 transform text-amber-100" />
    <div className="sandy-ground absolute bottom-[env(safe-area-inset-bottom)] left-0 right-0 h-10"></div>
    <div className="stone stone-1 absolute bottom-[calc(3.75rem_+_env(safe-area-inset-bottom))] left-[15%]"></div>
    <div className="stone stone-2 absolute bottom-[calc(3.75rem_+_env(safe-area-inset-bottom))] left-[55%]"></div>
    <div className="stone stone-3 absolute bottom-[calc(3.75rem_+_env(safe-area-inset-bottom))] left-[80%]"></div>
  </>
);

export { AquariumDecor };
