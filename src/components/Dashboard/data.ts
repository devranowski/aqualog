import { type Aquarium, type AquariumData, type Parameter } from '@/types/app';

export const aquariums: Aquarium[] = [
  { 
    id: '1', 
    name: "Main Tank",
    user_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  { 
    id: '2', 
    name: "Reef Tank",
    user_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  { 
    id: '3', 
    name: "Quarantine Tank",
    user_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const parameters: Parameter[] = [
  {
    id: '1',
    name: 'pH',
    unit: '',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Temperature',
    unit: '°C',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Ammonia',
    unit: 'ppm',
    created_at: new Date().toISOString()
  }
];

export const aquariumData: AquariumData = {
  '1': {
    parameters: {
      temperature: {
        current: 78,
        unit: "°F",
        data: [
          { date: "2024-02-28", value: 76 },
          { date: "2024-02-29", value: 77 },
          { date: "2024-03-01", value: 78 }
        ]
      }
    },
    lastUpdated: new Date().toISOString()
  }
};
