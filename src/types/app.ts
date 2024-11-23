import type { Database } from './supabase'

export type DBTables = Database['public']['Tables']

export type Aquarium = DBTables['aquariums']['Row']
export type Parameter = DBTables['parameters']['Row']
export type ParameterLog = DBTables['parameter_logs']['Row']

export type ParameterData = {
  current: number;
  unit: string;
  data: Array<{
    date: string;
    value: number;
  }>;
};

export type AquariumParameters = {
  [parameterName: string]: ParameterData;
};

export type AquariumState = {
  parameters: AquariumParameters;
  lastUpdated: string;
};

export type AquariumData = {
  [aquariumId: string]: AquariumState;
};

export type AquariumDataState = {
  [aquariumId: string]: AquariumState;
};

export type NewLog = {
  [parameterName: string]: string;
};

export type ParameterWithLogs = Parameter & {
  parameter_logs: ParameterLog[];
};
