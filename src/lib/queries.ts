import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, TreatmentWithDetails } from './types';

type Client = SupabaseClient<Database>;

const TREATMENT_SELECT_WITH_DETAILS = `
  *,
  Patient(*),
  Facultatiu(*),
  Dispositiu_Rellotge(*),
  Radioisotope(*),
  UnitCatalog(*)
`;

// --- Treatments ---

export async function getActiveTreatments(client: Client): Promise<TreatmentWithDetails[]> {
  const { data, error } = await client
    .from('Treatment')
    .select(TREATMENT_SELECT_WITH_DETAILS)
    .eq('status', 'ACTIVE')
    .order('start_date', { ascending: false });

  if (error) throw new Error(`Failed to fetch active treatments: ${error.message}`);
  return (data ?? []) as unknown as TreatmentWithDetails[];
}

export async function getTreatmentById(client: Client, id: number): Promise<TreatmentWithDetails | null> {
  const { data, error } = await client
    .from('Treatment')
    .select(TREATMENT_SELECT_WITH_DETAILS)
    .eq('id', id)
    .single();

  if (error) throw new Error(`Failed to fetch treatment ${id}: ${error.message}`);
  return data as unknown as TreatmentWithDetails;
}

export async function getCompletedTreatments(client: Client): Promise<TreatmentWithDetails[]> {
  const { data, error } = await client
    .from('Treatment')
    .select(TREATMENT_SELECT_WITH_DETAILS)
    .neq('status', 'ACTIVE')
    .order('start_date', { ascending: false });

  if (error) throw new Error(`Failed to fetch completed treatments: ${error.message}`);
  return (data ?? []) as unknown as TreatmentWithDetails[];
}

export async function createTreatment(
  client: Client,
  treatment: {
    patient_id: number;
    facultatiu_id: number;
    rellotge_id: number;
    radioisotope_id: number;
    unit_id: number;
    initial_radiation: number;
    isolation_days: number;
    start_date: string;
    expected_end_date: string;
  },
): Promise<void> {
  const { error: treatmentError } = await client
    .from('Treatment')
    .insert({ ...treatment, status: 'ACTIVE' });

  if (treatmentError) throw new Error(`Failed to create treatment: ${treatmentError.message}`);

  // Mark the watch as in use
  const { error: watchError } = await client
    .from('Dispositiu_Rellotge')
    .update({ estat: 'EN_US' })
    .eq('id', treatment.rellotge_id);

  if (watchError) throw new Error(`Failed to update watch status: ${watchError.message}`);
}

// --- Patients ---

export async function getPatients(client: Client): Promise<Database['public']['Tables']['Patient']['Row'][]> {
  const { data, error } = await client
    .from('Patient')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw new Error(`Failed to fetch patients: ${error.message}`);
  return data ?? [];
}

export async function getPatientById(client: Client, id: number): Promise<Database['public']['Tables']['Patient']['Row'] | null> {
  const { data, error } = await client
    .from('Patient')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(`Failed to fetch patient ${id}: ${error.message}`);
  return data;
}

export async function createPatient(
  client: Client,
  patient: { name: string; phone?: string; address?: string },
): Promise<Database['public']['Tables']['Patient']['Row']> {
  const { data, error } = await client
    .from('Patient')
    .insert(patient)
    .select()
    .single();

  if (error) throw new Error(`Failed to create patient: ${error.message}`);
  return data;
}

export async function updatePatient(
  client: Client,
  id: number,
  updates: { name?: string; phone?: string; address?: string },
): Promise<void> {
  const { error } = await client
    .from('Patient')
    .update(updates)
    .eq('id', id);

  if (error) throw new Error(`Failed to update patient ${id}: ${error.message}`);
}

export async function deletePatient(client: Client, id: number): Promise<void> {
  const { error } = await client
    .from('Patient')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Failed to delete patient ${id}: ${error.message}`);
}

// --- Alerts ---

export async function getUnresolvedAlerts(client: Client): Promise<Database['public']['Tables']['Alerta_Metge']['Row'][]> {
  const { data, error } = await client
    .from('Alerta_Metge')
    .select(`
      *,
      Treatment(id, Patient(name))
    `)
    .eq('resolta', false)
    .order('creada_el', { ascending: false });

  if (error) throw new Error(`Failed to fetch unresolved alerts: ${error.message}`);

  return data ?? [];
}

export async function resolveAlert(client: Client, alertId: number): Promise<void> {
  const { error } = await client
    .from('Alerta_Metge')
    .update({ resolta: true })
    .eq('id', alertId);

  if (error) throw new Error(`Failed to resolve alert ${alertId}: ${error.message}`);
}

// --- Health Metrics ---

export async function getHealthMetrics(
  client: Client,
  treatmentId: number,
  limit = 100,
): Promise<Database['public']['Tables']['HealthMetrics']['Row'][]> {
  const { data, error } = await client
    .from('HealthMetrics')
    .select('*')
    .eq('treatment_id', treatmentId)
    .order('recorded_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to fetch health metrics: ${error.message}`);
  return data ?? [];
}

// --- Catalogues ---

export async function getRadioisotopes(client: Client): Promise<Database['public']['Tables']['Radioisotope']['Row'][]> {
  const { data, error } = await client.from('Radioisotope').select('*').order('name');
  if (error) throw new Error(`Failed to fetch radioisotopes: ${error.message}`);
  return data ?? [];
}

export async function getUnitCatalog(client: Client): Promise<Database['public']['Tables']['UnitCatalog']['Row'][]> {
  const { data, error } = await client.from('UnitCatalog').select('*').order('name');
  if (error) throw new Error(`Failed to fetch unit catalog: ${error.message}`);
  return data ?? [];
}

export async function getAvailableWatches(client: Client): Promise<Database['public']['Tables']['Dispositiu_Rellotge']['Row'][]> {
  const { data, error } = await client
    .from('Dispositiu_Rellotge')
    .select('*')
    .eq('estat', 'DISPONIBLE')
    .order('mac_address');

  if (error) throw new Error(`Failed to fetch available watches: ${error.message}`);
  return data ?? [];
}

export async function getFacultatiu(client: Client): Promise<Database['public']['Tables']['Facultatiu']['Row'][]> {
  const { data, error } = await client.from('Facultatiu').select('*').order('nom');
  if (error) throw new Error(`Failed to fetch doctors: ${error.message}`);
  return data ?? [];
}
