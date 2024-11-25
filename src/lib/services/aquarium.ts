import { supabase } from '../supabase'
import type { Aquarium, Parameter, ParameterLog } from '@/types/app'

export async function getAquariums() {
  const { data: aquariums, error } = await supabase
    .from('aquariums')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return aquariums
}

export async function getParameters() {
  const { data: parameters, error } = await supabase
    .from('parameters')
    .select('*')
    .order('name')

  if (error) throw error
  return parameters
}

export async function getParameterLogs(aquariumId: string, days: number = 7) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data: logs, error } = await supabase
    .from('parameter_logs')
    .select(`
      *,
      parameters (name, unit)
    `)
    .eq('aquarium_id', aquariumId)
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: false })

  if (error) throw error
  return logs
}

export async function addAquarium(name: string) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error('User not authenticated');

  const { data: aquarium, error } = await supabase
    .from('aquariums')
    .insert([{ name, user_id: user.id }])
    .select()
    .single();

  if (error) throw error;
  return aquarium;
}

export async function addParameterLog(
  aquariumId: string,
  parameterId: string,
  value: number,
  createdAt?: string
) {
  const { data: log, error } = await supabase
    .from('parameter_logs')
    .insert([
      {
        aquarium_id: aquariumId,
        parameter_id: parameterId,
        value,
        created_at: createdAt || new Date().toISOString()
      }
    ])
    .select('id, aquarium_id, parameter_id, value, created_at')
    .single()

  if (error) throw error
  return log
}

export async function getLatestParameterLogs(aquariumId: string) {
  const { data: logs, error } = await supabase
    .from('parameter_logs')
    .select(`
      *,
      parameters (name, unit)
    `)
    .eq('aquarium_id', aquariumId)
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) throw error
  return logs
}

export async function deleteAquarium(aquariumId: string) {
  const { error } = await supabase
    .from('aquariums')
    .delete()
    .eq('id', aquariumId)

  if (error) throw error
}
