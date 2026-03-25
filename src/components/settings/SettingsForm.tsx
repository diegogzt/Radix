import { useState, type FormEvent } from 'react';

interface Props {
  currentSettings?: {
    unit: string;
    theme: string;
    notifications_enabled: boolean;
  };
}

export default function SettingsForm({ currentSettings }: Props) {
  const [form, setForm] = useState({
    unit: currentSettings?.unit ?? 'MBq',
    theme: currentSettings?.theme ?? 'light',
    notifications_enabled: currentSettings?.notifications_enabled ?? true,
  });
  const [saved, setSaved] = useState(false);

  function handleChange(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Settings saved client-side (localStorage) since the Settings table is per-patient
    localStorage.setItem('radix-settings', JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const selectClass =
    'w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm transition-colors focus:border-radix-500 focus:outline-none focus:ring-2 focus:ring-radix-200';

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg">
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">Ajustes del Sistema</h2>

        {saved && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            Ajustes guardados correctamente
          </div>
        )}

        <div className="space-y-5">
          {/* Unit preference */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Unidad de Radiacion por Defecto
            </label>
            <select
              value={form.unit}
              onChange={(e) => handleChange('unit', e.target.value)}
              className={selectClass}
            >
              <option value="MBq">MBq (Megabecquerel)</option>
              <option value="mCi">mCi (Milicurie)</option>
              <option value="GBq">GBq (Gigabecquerel)</option>
            </select>
          </div>

          {/* Theme */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Tema Visual</label>
            <select
              value={form.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
              className={selectClass}
            >
              <option value="light">Modo Claro</option>
              <option value="dark">Modo Oscuro</option>
            </select>
          </div>

          {/* Notifications */}
          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.notifications_enabled}
                onChange={(e) => handleChange('notifications_enabled', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-radix-600 focus:ring-radix-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Notificaciones de Alertas
                </span>
                <p className="text-xs text-gray-500">
                  Recibir notificaciones visuales y sonoras ante alertas medicas
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* About section */}
        <div className="mt-8 border-t border-gray-200 pt-5">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Sobre RADIX</h3>
          <div className="space-y-1 text-xs text-gray-500">
            <p>Rellotge de Decaiment Radioactiu</p>
            <p>Panel Medico de Monitoreo - Version 1.0</p>
            <p>Radiofarmacia - Aislamiento Domiciliario</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-radix-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-radix-700"
          >
            Guardar Ajustes
          </button>
        </div>
      </div>
    </form>
  );
}
