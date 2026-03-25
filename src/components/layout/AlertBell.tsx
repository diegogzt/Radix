import { useState, useEffect, useRef } from 'react';
import { getSupabaseBrowserClient } from '@lib/supabase';
import { subscribeToAlerts, subscribeToAlertUpdates } from '@lib/realtime';
import { formatDateTime } from '@lib/utils';
import type { AlertaMetge, AlertWithTreatment } from '@lib/types';

export default function AlertBell() {
  const [alerts, setAlerts] = useState<AlertWithTreatment[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = getSupabaseBrowserClient();

  const unresolvedCount = alerts.filter((a) => !a.resolta).length;

  useEffect(() => {
    async function fetchAlerts() {
      const { data } = await supabase
        .from('Alerta_Metge')
        .select('*, Treatment(id, Patient(name))')
        .eq('resolta', false)
        .order('creada_el', { ascending: false })
        .limit(20);

      if (data) setAlerts(data as unknown as AlertWithTreatment[]);
    }

    fetchAlerts();

    const alertChannel = subscribeToAlerts(supabase, (newAlert: AlertaMetge) => {
      const alertWithTreatment = { ...newAlert, Treatment: null } as unknown as AlertWithTreatment;
      setAlerts((prev) => [alertWithTreatment, ...prev]);
      if (!newAlert.resolta) {
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 5000);
      }
    });

    const updateChannel = subscribeToAlertUpdates(supabase, (updated: AlertaMetge) => {
      setAlerts((prev) =>
        prev.map((a) => (a.id === updated.id ? { ...a, resolta: updated.resolta } : a)),
      );
    });

    return () => {
      supabase.removeChannel(alertChannel);
      supabase.removeChannel(updateChannel);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleResolve(alertId: number) {
    await supabase.from('Alerta_Metge').update({ resolta: true }).eq('id', alertId);
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, resolta: true } : a)));
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative rounded-lg p-2 transition-colors hover:bg-gray-100 ${
          isFlashing ? 'animate-pulse bg-red-50' : ''
        }`}
        aria-label={`Alertas: ${unresolvedCount} sin resolver`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${unresolvedCount > 0 ? 'text-alert-red' : 'text-gray-500'}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unresolvedCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-alert-red text-xs font-bold text-white">
            {unresolvedCount > 9 ? '9+' : unresolvedCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-96 rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Alertas Medicas ({unresolvedCount})
            </h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {alerts.filter((a) => !a.resolta).length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                No hay alertas pendientes
              </div>
            ) : (
              alerts
                .filter((a) => !a.resolta)
                .map((alert) => (
                  <div
                    key={alert.id}
                    className="border-b border-gray-50 px-4 py-3 last:border-0 hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 shrink-0 rounded-full bg-alert-red" />
                          <span className="text-sm font-medium text-gray-900">
                            {alert.tipus_alerta ?? 'Alerta'}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{alert.missatge}</p>
                        {alert.Treatment?.Patient && (
                          <p className="mt-0.5 text-xs text-radix-600">
                            Paciente: {alert.Treatment.Patient.name}
                          </p>
                        )}
                        <p className="mt-0.5 text-xs text-gray-400">
                          {formatDateTime(alert.creada_el)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleResolve(alert.id)}
                        className="shrink-0 rounded-md bg-radix-50 px-2 py-1 text-xs font-medium text-radix-700 transition-colors hover:bg-radix-100"
                      >
                        Resolver
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
