import { RotateCcw, Check } from 'lucide-react';

const STEPS = [
  { id: 'landing', label: 'Perfil', order: 1 },
  { id: 'playing', label: 'Simulación', order: 2 },
  { id: 'results', label: 'Reporte', order: 3 },
];

function getStepIndex(phase) {
  if (phase === 'landing') return 1;
  if (phase === 'diagnostic' || phase === 'playing') return 2;
  return 3;
}

export function Header({ phase, candidateName, onReset }) {
  const activeStep = getStepIndex(phase);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md no-print">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Identidad IZET S.A. */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-sm ring-1 ring-slate-900/10">
            <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" aria-hidden="true">
              <rect x="4" y="6" width="4" height="20" rx="2" fill="#2DD4BF" />
              <path
                d="M12 8H27L14 24H27"
                stroke="#F8FAFC"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-base font-extrabold tracking-tight text-slate-900">
                IZET S.A.
              </span>
              <span className="hidden rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-semibold text-teal-800 ring-1 ring-inset ring-teal-200 sm:inline-block">
                CET · SAIE
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Evaluación de Talento · Auxiliar Administrativo/a de RR.HH.
            </p>
          </div>
        </div>

        {/* Stepper de 3 fases (Desktop) */}
        <nav aria-label="Progreso" className="hidden items-center gap-2 md:flex">
          {STEPS.map((step, idx) => {
            const done = activeStep > step.order;
            const current = activeStep === step.order;
            return (
              <div key={step.id} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition ${
                      done
                        ? 'bg-teal-600 text-white'
                        : current
                        ? 'bg-slate-900 text-white ring-4 ring-slate-100'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : step.order}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      current ? 'text-slate-900' : done ? 'text-teal-700' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`h-px w-6 ${done ? 'bg-teal-400' : 'bg-slate-200'}`}
                  />
                )}
              </div>
            );
          })}
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-3">
          {phase !== 'landing' && candidateName && (
            <span className="hidden text-xs font-medium text-slate-600 lg:inline-block">
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
