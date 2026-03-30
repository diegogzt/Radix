/**
 * All data access goes through the Spring Boot API at api.raddix.pro.
 * No Supabase dependency — zero direct DB connections from the frontend.
 */

import {
  apiGet, apiPost, apiPut, apiDelete,
  parseFhirPatient, toFhirPatient,
  type FhirPatient, type Patient,
} from './api';
import type { TreatmentWithDetails, AlertWithTreatment, HealthMetrics } from './types';
import type { Database } from './types';

// ─── Patients (FHIR API) ─────────────────────────────────────────────────────

export async function getPatients(): Promise<Patient[]> {
  const fhirList = await apiGet<FhirPatient[]>('/fhir/Patient');
  return (fhirList ?? []).map(parseFhirPatient).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getPatientById(id: number): Promise<Patient | null> {
  try {
    const fhir = await apiGet<FhirPatient>(`/fhir/Patient/${id}`);
    return parseFhirPatient(fhir);
  } catch {
    return null;
  }
}

export async function createPatient(
  patient: { name: string; phone?: string | null; address?: string | null },
): Promise<Patient> {
  const fhir = await apiPost<FhirPatient>('/fhir/Patient', toFhirPatient(patient));
  return parseFhirPatient(fhir);
}

export async function updatePatient(
  id: number,
  updates: { name?: string; phone?: string | null; address?: string | null },
): Promise<void> {
  const current = await getPatientById(id);
  const merged = { name: current?.name ?? '', phone: current?.phone, address: current?.address, ...updates };
  await apiPut<FhirPatient>(`/fhir/Patient/${id}`, toFhirPatient(merged));
}

export async function deletePatient(id: number): Promise<void> {
  await apiDelete(`/fhir/Patient/${id}`);
}

// ─── Treatments ───────────────────────────────────────────────────────────────

export async function getActiveTreatments(): Promise<TreatmentWithDetails[]> {
  return apiGet<TreatmentWithDetails[]>('/api/treatments/active');
}

export async function getTreatmentById(id: number): Promise<TreatmentWithDetails | null> {
  try {
    return await apiGet<TreatmentWithDetails>(`/api/treatments/${id}`);
  } catch {
    return null;
  }
}

export async function getCompletedTreatments(): Promise<TreatmentWithDetails[]> {
  return apiGet<TreatmentWithDetails[]>('/api/treatments/history');
}

export async function createTreatment(treatment: {
  patient_id: number;
  facultatiu_id: number;
  rellotge_id: number;
  radioisotope_id: number;
  unit_id: number;
  initial_radiation: number;
  isolation_days: number;
  start_date: string;
  expected_end_date: string;
}): Promise<void> {
  await apiPost('/api/treatments', treatment);
}

// ─── Alerts ───────────────────────────────────────────────────────────────────

export async function getUnresolvedAlerts(): Promise<AlertWithTreatment[]> {
  return apiGet<AlertWithTreatment[]>('/api/alerts');
}

export async function resolveAlert(alertId: number): Promise<void> {
  await apiPatch(`/api/alerts/${alertId}/resolve`);
}

// ─── Health Metrics ───────────────────────────────────────────────────────────

export async function getHealthMetrics(
  treatmentId: number,
  limit = 100,
): Promise<HealthMetrics[]> {
  return apiGet<HealthMetrics[]>(`/api/health-metrics/${treatmentId}?limit=${limit}`);
}

// ─── Catalogues ───────────────────────────────────────────────────────────────

export async function getRadioisotopes(): Promise<Database['public']['Tables']['Radioisotope']['Row'][]> {
  return apiGet('/api/radioisotopes');
}

export async function getUnitCatalog(): Promise<Database['public']['Tables']['UnitCatalog']['Row'][]> {
  return apiGet('/api/units');
}

export async function getAvailableWatches(): Promise<Database['public']['Tables']['Dispositiu_Rellotge']['Row'][]> {
  return apiGet('/api/watches');
}

export async function getFacultatiu(): Promise<Database['public']['Tables']['Facultatiu']['Row'][]> {
  return apiGet('/api/doctors');
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function apiPatch(path: string): Promise<void> {
  const API_BASE = (import.meta.env.PUBLIC_API_URL as string | undefined) ?? '';
  const res = await fetch(`${API_BASE}${path}`, { method: 'PATCH' });
  if (!res.ok && res.status !== 204) {
    throw new Error(`PATCH ${path} → ${res.status}`);
  }
}
