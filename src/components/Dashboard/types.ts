export type AquariumParameter = {
  current: number
  unit: string
  data: Array<{
    date: string
    value: number
  }>
}

export type AquariumData = {
  temperature: AquariumParameter
  ph: AquariumParameter
  ammonia: AquariumParameter
  nitrate: AquariumParameter
}

export type AquariumDataState = {
  [key: number]: AquariumData
}

export type Aquarium = {
  id: number
  name: string
}

export type NewLog = {
  temperature: string
  ph: string
  ammonia: string
  nitrate: string
}
