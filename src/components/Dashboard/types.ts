import { type Database } from '@/types/supabase'

export type DBTables = Database['public']['Tables']

export type Aquarium = DBTables['aquariums']['Row']

export type AquariumParameter = {
  current: number
  unit: string
  data: Array<{
    date: string
    value: number
  }>
}

export type AquariumData = {
  [parameterName: string]: AquariumParameter
}

export type AquariumDataState = {
  [key: string]: AquariumData
}

export type NewLog = {
  [parameterName: string]: string
}

export type DashboardSidebarProps = {
  aquariums: Aquarium[]
  selectedAquarium: Aquarium | null
  onAquariumSelect: (aquarium: Aquarium) => void
  onAddAquarium: (name: string) => Promise<void>
}
