import {
  ClipboardCheck,
  Database,
  ShieldCheck,
  MessageSquareHeart,
} from 'lucide-react';

export const COMPETENCY_META = [
  {
    key: 'organizacionDetalle',
    label: 'Organización y Detalle',
    shortLabel: 'Organización',
    icon: ClipboardCheck,
    barColor: 'bg-slate-800',
    softBg: 'bg-slate-100 text-slate-700',
  },
  {
    key: 'gestionDatos',
    label: 'Gestión Administrativa y Datos',
    shortLabel: 'Gestión y Datos',
    icon: Database,
    barColor: 'bg-teal-600',
    softBg: 'bg-teal-50 text-teal-700',
  },
  {
    key: 'confidencialidadEtica',
    label: 'Confidencialidad y Ética',
    shortLabel: 'Confidencialidad',
    icon: ShieldCheck,
    barColor: 'bg-indigo-600',
    softBg: 'bg-indigo-50 text-indigo-700',
  },
  {
    key: 'comunicacionServicio',
    label: 'Comunicación y Servicio',
    shortLabel: 'Comunicación',
    icon: MessageSquareHeart,
    barColor: 'bg-amber-600',
    softBg: 'bg-amber-50 text-amber-700',
  },
];

export function CompetencyBars({
  competencies,
  lastImpact = null,
  currentRound,
  totalScenarios,
}) {
  const progressPct = Math.round(((currentRound - 1) / Math.max(1, totalScenarios)) * 100);

  return (
    <aside className="space-y-4">
      {/* Progreso general */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span>Avance de la simulación</span>
          <span className="text-slate-900">
            Ronda {Math.min(currentRound, totalScenarios)} de {totalScenarios}
          </span>
        </div>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-slate-800 to-teal-600 transition-all duration-500 ease-out"
            style={{ width: `${Math.max(8, progressPct)}%` }}
          />
        </div>
      </div>

      {/* Competencias clave */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Competencias en vivo</h3>
          <span className="text-[11px] font-medium text-slate-400">Escala 0–100</span>
        </div>

        <div className="space-y-4">
          {COMPETENCY_META.map(({ key, label, icon: Icon, barColor, softBg }) => {
            const value = competencies?.[key] ?? 50;
            const delta = lastImpact?.[key] ?? 0;

            return (
              <div key={key} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${softBg}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="truncate text-xs font-semibold text-slate-700">
                      {label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {delta !== 0 && (
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                          delta > 0
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {delta > 0 ? `+${delta}` : delta}
                      </span>
                    )}
                    <span className="w-7 text-right text-xs font-bold text-slate-900">
                      {value}
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
                    style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
