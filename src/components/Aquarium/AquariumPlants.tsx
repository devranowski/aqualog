import { Leaf, Sprout, LeafyGreen } from 'lucide-react';

const AquariumPlants = () => (
  <>
    <Leaf className="animate-sway-reverse absolute bottom-4 left-[3%] z-10 h-16 w-16 origin-bottom text-green-500" />
    <Sprout className="absolute bottom-6 left-[23%] z-10 h-20 w-20 text-yellow-400" />
    <LeafyGreen className="animate-sway absolute bottom-3 left-[32%] z-10 h-28 w-28 origin-bottom text-green-700" />
    <Leaf className="animate-sway absolute bottom-5 left-[48%] z-10 h-20 w-20 origin-bottom text-green-400" />
    <Sprout className="absolute bottom-2 left-[67%] z-10 h-24 w-24 text-red-500" />
    <LeafyGreen className="animate-sway-reverse absolute bottom-6 left-[88%] z-10 h-20 w-20 origin-bottom text-yellow-500" />
    <Sprout className="absolute bottom-5 left-[97%] z-10 h-16 w-16 text-emerald-500" />
    <LeafyGreen className="animate-sway absolute bottom-8 left-[12%] z-10 h-24 w-24 origin-bottom text-green-600" />
    <Leaf className="w-18 h-18 animate-sway-reverse absolute bottom-2 left-[42%] z-10 origin-bottom text-green-300" />
    <Sprout className="w-22 h-22 absolute bottom-9 left-[73%] z-10 text-teal-500" />
    <LeafyGreen className="w-26 h-26 animate-sway absolute bottom-1 left-[65%] z-10 origin-bottom text-lime-500" />
  </>
);

export { AquariumPlants };
