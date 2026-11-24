import { Building2, RotateCcw } from 'lucide-react';

export function Header({ phase, candidateName, onReset }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md no-print">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-teal-400 shadow-sm">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-base font-bold tracking-tight text-slate-900">
                IZET S.A.
              </span>
              <span className="hidden rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 ring-1 ring-inset ring-teal-200 sm:inline-block">
                Departamento de RR.HH.
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Simulador de Selección · Auxiliar Administrativo/a
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {phase !== 'landing' && candidateName && (
            <span className="hidden text-xs font-medium text-slate-600 md:inline-block">
              Postulante: <strong className="text-slate-900">{candidateName}</strong>
            </span>
          )}
          {phase !== 'landing' && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reiniciar
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
