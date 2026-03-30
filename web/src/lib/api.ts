/**
 * Cliente HTTP para el backend Spring Boot (api.raddix.pro).
 * La URL base se lee de PUBLIC_API_URL (configurable por .env sin tocar código).
 */

const API_BASE = (import.meta.env.PUBLIC_API_URL as string | undefined) ?? '';

export async function apiFetch<T = unknown>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, options);

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`API ${res.status} — ${text} (${url})`);
  }

  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;

  return res.json() as Promise<T>;
}

export const apiGet = <T>(path: string) => apiFetch<T>(path);

export const apiPost = <T>(path: string, body: unknown) =>
  apiFetch<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

export const apiPut = <T>(path: string, body: unknown) =>
  apiFetch<T>(path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

export const apiDelete = (path: string) =>
  apiFetch<void>(path, { method: 'DELETE' });

// ─── FHIR R4 Patient ────────────────────────────────────────────────────────

interface FhirHumanName {
  family?: string;
  given?: string[];
}
interface FhirTelecom {
  system?: string;
  use?: string;
  value?: string;
}
interface FhirAddress {
  line?: string[];
}
export interface FhirPatient {
  resourceType: 'Patient';
  id?: string;
  name?: FhirHumanName[];
  telecom?: FhirTelecom[];
  address?: FhirAddress[];
}

export interface Patient {
  id: number;
  name: string;
  phone: string | null;
  address: string | null;
  created_at: string | null;
}

/** Convert a FHIR Patient resource to the internal Patient shape. */
export function parseFhirPatient(fhir: FhirPatient): Patient {
  return {
    id: parseInt(fhir.id ?? '0', 10),
    name: fhir.name?.[0]?.family ?? '',
    phone: fhir.telecom?.find((t) => t.system === 'phone')?.value ?? null,
    address: fhir.address?.[0]?.line?.[0] ?? null,
    created_at: null,
  };
}

/** Build a FHIR Patient JSON body for POST / PUT requests. */
export function toFhirPatient(data: {
  name: string;
  phone?: string | null;
  address?: string | null;
}): FhirPatient {
  const fhir: FhirPatient = {
    resourceType: 'Patient',
    name: [{ family: data.name, given: [data.name] }],
  };

  if (data.phone) {
    fhir.telecom = [{ system: 'phone', use: 'mobile', value: data.phone }];
  }

  if (data.address) {
    fhir.address = [{ line: [data.address] }];
  }

  return fhir;
}
