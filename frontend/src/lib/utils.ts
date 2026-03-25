/**
 * Calculate current theoretical radiation using exponential decay.
 * Formula: A(t) = A_0 * (1/2)^(t / t_half)
 *
 * @param initialRadiation - A_0 in MBq (or whatever unit)
 * @param halfLifeHours - Half-life of the radioisotope in hours
 * @param startDate - ISO string of when treatment started
 * @returns Current theoretical radiation level
 */
export function calculateCurrentRadiation(
  initialRadiation: number,
  halfLifeHours: number,
  startDate: string,
): number {
  const elapsedMs = Date.now() - new Date(startDate).getTime();
  const elapsedHours = elapsedMs / (1000 * 60 * 60);
  return initialRadiation * Math.pow(0.5, elapsedHours / halfLifeHours);
}

/**
 * Calculate radiation decay percentage (how much has decayed).
 * Returns 0-100 where 100 means fully decayed.
 */
export function radiationDecayPercentage(
  initialRadiation: number,
  halfLifeHours: number,
  startDate: string,
): number {
  const current = calculateCurrentRadiation(initialRadiation, halfLifeHours, startDate);
  return Math.min(100, ((initialRadiation - current) / initialRadiation) * 100);
}

/**
 * Calculate days remaining until isolation ends.
 * Returns negative if past expected end date.
 */
export function daysRemaining(expectedEndDate: string | null): number | null {
  if (!expectedEndDate) return null;
  const diffMs = new Date(expectedEndDate).getTime() - Date.now();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Format ISO date string for display.
 */
export function formatDate(isoString: string | null): string {
  if (!isoString) return '-';
  return new Date(isoString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Format ISO date with time.
 */
export function formatDateTime(isoString: string | null): string {
  if (!isoString) return '-';
  return new Date(isoString).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get battery level color class.
 */
export function batteryColor(level: number): string {
  if (level > 50) return 'text-success';
  if (level > 20) return 'text-alert-amber';
  return 'text-alert-red';
}

/**
 * Get BPM status color.
 * Normal resting heart rate: 60-100 bpm.
 */
export function bpmColor(bpm: number): string {
  if (bpm >= 60 && bpm <= 100) return 'text-success';
  if (bpm > 100 && bpm <= 120) return 'text-alert-amber';
  return 'text-alert-red';
}
