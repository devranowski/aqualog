import { type Aquarium, type AquariumDataState } from "./types"

export const initialAquariums: Aquarium[] = [
  { id: 1, name: "Main Tank" },
  { id: 2, name: "Reef Tank" },
  { id: 3, name: "Quarantine Tank" },
]

export const aquariumData: AquariumDataState = {
  1: {
    temperature: { current: 78, unit: "°F", data: [
      { date: "2024-02-28", value: 76 },
      { date: "2024-02-29", value: 77 },
      { date: "2024-03-01", value: 75 },
      { date: "2024-03-02", value: 76 },
      { date: "2024-03-03", value: 77 },
      { date: "2024-03-04", value: 78 },
    ]},
    ph: { current: 7.2, unit: "", data: [
      { date: "2024-02-28", value: 7.0 },
      { date: "2024-02-29", value: 7.1 },
      { date: "2024-03-01", value: 7.2 },
      { date: "2024-03-02", value: 7.1 },
      { date: "2024-03-03", value: 7.3 },
      { date: "2024-03-04", value: 7.2 },
    ]},
    ammonia: { current: 0.25, unit: "ppm", data: [
      { date: "2024-02-28", value: 0.5 },
      { date: "2024-02-29", value: 0.4 },
      { date: "2024-03-01", value: 0.3 },
      { date: "2024-03-02", value: 0.25 },
      { date: "2024-03-03", value: 0.5 },
      { date: "2024-03-04", value: 0.25 },
    ]},
    nitrate: { current: 10, unit: "ppm", data: [
      { date: "2024-02-28", value: 20 },
      { date: "2024-02-29", value: 18 },
      { date: "2024-03-01", value: 15 },
      { date: "2024-03-02", value: 20 },
      { date: "2024-03-03", value: 15 },
      { date: "2024-03-04", value: 10 },
    ]},
  },
  2: {
    temperature: { current: 80, unit: "°F", data: [
      { date: "2024-02-28", value: 79 },
      { date: "2024-02-29", value: 80 },
      { date: "2024-03-01", value: 80 },
      { date: "2024-03-02", value: 81 },
      { date: "2024-03-03", value: 80 },
      { date: "2024-03-04", value: 80 },
    ]},
    ph: { current: 8.1, unit: "", data: [
      { date: "2024-02-28", value: 8.0 },
      { date: "2024-02-29", value: 8.1 },
      { date: "2024-03-01", value: 8.2 },
      { date: "2024-03-02", value: 8.1 },
      { date: "2024-03-03", value: 8.0 },
      { date: "2024-03-04", value: 8.1 },
    ]},
    ammonia: { current: 0, unit: "ppm", data: [
      { date: "2024-02-28", value: 0 },
      { date: "2024-02-29", value: 0 },
      { date: "2024-03-01", value: 0.1 },
      { date: "2024-03-02", value: 0 },
      { date: "2024-03-03", value: 0 },
      { date: "2024-03-04", value: 0 },
    ]},
    nitrate: { current: 5, unit: "ppm", data: [
      { date: "2024-02-28", value: 8 },
      { date: "2024-02-29", value: 7 },
      { date: "2024-03-01", value: 6 },
      { date: "2024-03-02", value: 6 },
      { date: "2024-03-03", value: 5 },
      { date: "2024-03-04", value: 5 },
    ]},
  },
  3: {
    temperature: { current: 76, unit: "°F", data: [
      { date: "2024-02-28", value: 75 },
      { date: "2024-02-29", value: 75 },
      { date: "2024-03-01", value: 76 },
      { date: "2024-03-02", value: 76 },
      { date: "2024-03-03", value: 76 },
      { date: "2024-03-04", value: 76 },
    ]},
    ph: { current: 7.0, unit: "", data: [
      { date: "2024-02-28", value: 7.1 },
      { date: "2024-02-29", value: 7.0 },
      { date: "2024-03-01", value: 7.0 },
      { date: "2024-03-02", value: 7.0 },
      { date: "2024-03-03", value: 7.1 },
      { date: "2024-03-04", value: 7.0 },
    ]},
    ammonia: { current: 0.5, unit: "ppm", data: [
      { date: "2024-02-28", value: 1.0 },
      { date: "2024-02-29", value: 0.8 },
      { date: "2024-03-01", value: 0.7 },
      { date: "2024-03-02", value: 0.6 },
      { date: "2024-03-03", value: 0.5 },
      { date: "2024-03-04", value: 0.5 },
    ]},
    nitrate: { current: 20, unit: "ppm", data: [
      { date: "2024-02-28", value: 30 },
      { date: "2024-02-29", value: 28 },
      { date: "2024-03-01", value: 25 },
      { date: "2024-03-02", value: 22 },
      { date: "2024-03-03", value: 20 },
      { date: "2024-03-04", value: 20 },
    ]},
  },
}
