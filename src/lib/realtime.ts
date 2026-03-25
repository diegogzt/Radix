import type { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import type { Database, AlertaMetge, HealthMetrics } from './types';

type Client = SupabaseClient<Database>;

/**
 * Subscribe to new alerts (INSERT on Alerta_Metge).
 * Returns the channel for cleanup.
 */
export function subscribeToAlerts(
  client: Client,
  onNewAlert: (alert: AlertaMetge) => void,
): RealtimeChannel {
  return client
    .channel('alerts-realtime')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'Alerta_Metge',
      },
      (payload) => {
        onNewAlert(payload.new as AlertaMetge);
      },
    )
    .subscribe();
}

/**
 * Subscribe to health metrics for a specific treatment.
 * Returns the channel for cleanup.
 */
export function subscribeToHealthMetrics(
  client: Client,
  treatmentId: number,
  onNewMetric: (metric: HealthMetrics) => void,
): RealtimeChannel {
  return client
    .channel(`health-metrics-${treatmentId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'HealthMetrics',
        filter: `treatment_id=eq.${treatmentId}`,
      },
      (payload) => {
        onNewMetric(payload.new as HealthMetrics);
      },
    )
    .subscribe();
}

/**
 * Subscribe to alert resolution updates.
 */
export function subscribeToAlertUpdates(
  client: Client,
  onAlertUpdate: (alert: AlertaMetge) => void,
): RealtimeChannel {
  return client
    .channel('alerts-updates')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'Alerta_Metge',
      },
      (payload) => {
        onAlertUpdate(payload.new as AlertaMetge);
      },
    )
    .subscribe();
}
