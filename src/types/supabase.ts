export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ParameterUnit = '°C' | 'ppm' | ''

export interface Database {
  public: {
    Tables: {
      aquariums: {
        Row: {
          id: string
          name: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      parameters: {
        Row: {
          id: string
          name: string
          unit: ParameterUnit
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          unit: ParameterUnit
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          unit?: ParameterUnit
          created_at?: string
        }
      }
      parameter_logs: {
        Row: {
          id: string
          aquarium_id: string
          parameter_id: string
          value: number
          created_at: string
        }
        Insert: {
          id?: string
          aquarium_id: string
          parameter_id: string
          value: number
          created_at?: string
        }
        Update: {
          id?: string
          aquarium_id?: string
          parameter_id?: string
          value?: number
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      parameter_unit: ParameterUnit
    }
  }
}
