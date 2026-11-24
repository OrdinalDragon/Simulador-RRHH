import {
  Sparkles,
  CheckCircle2,
  Target,
  ArrowRight,
  GraduationCap,
  Briefcase,
  FileSpreadsheet,
  BookOpen,
} from 'lucide-react';

const FIT_STYLES = {
  alto: {
    badge: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    label: 'Encaje inicial alto',
  },
  medio: {
    badge: 'bg-amber-50 text-amber-800 ring-amber-200',
    label: 'Encaje inicial medio',
  },
  en_desarrollo: {
    badge: 'bg-slate-100 text-slate-800 ring-slate-300',
    label: 'Perfil en desarrollo',
  },
};

const LABELS = {
  secondaryComplete: {
    si: { text: 'Cumplido', tone: 'text-emerald-700 bg-emerald-50' },
    no: { text: 'No acreditado', tone: 'text-rose-700 bg-rose-50' },
    no_especificado: { text: 'Sin especificar', tone: 'text-slate-600 bg-slate-100' },
  },
  relatedStudies: {
    si: { text: 'Finalizados', tone: 'text-emerald-700 bg-emerald-50' },
    en_curso: { text: 'En curso', tone: 'text-teal-700 bg-teal-50' },
    no: { text: 'Otra orientación', tone: 'text-amber-700 bg-amber-50' },
    no_especificado: { text: 'Sin especificar', tone: 'text-slate-600 bg-slate-100' },
  },
  adminExperience: {
    alta: { text: 'Sólida', tone: 'text-emerald-700 bg-emerald-50' },
    media: { text: 'Intermedia', tone: 'text-teal-700 bg-teal-50' },
    basica: { text: 'Básica / Inicial', tone: 'text-amber-700 bg-amber-50' },
    ninguna: { text: 'Sin experiencia', tone: 'text-slate-600 bg-slate-100' },
  },
  officeExcel: {
    avanzado: { text: 'Intermedio / Avanzado', tone: 'text-emerald-700 bg-emerald-50' },
    intermedio: { text: 'Intermedio', tone: 'text-teal-700 bg-teal-50' },
    basico: { text: 'Básico', tone: 'text-amber-700 bg-amber-50' },
    no_especificado: { text: 'Sin especificar', tone: 'text-slate-600 bg-slate-100' },
  },
};

export function CvDiagnosticStep({ candidateName, cvAnalysis, totalScenarios, onContinue }) {
  if (!cvAnalysis) return null;

  const fit = cvAnalysis.requirementsFit || {};
  const fitStyle = FIT_STYLES[fit.overallFitLevel] || FIT_STYLES.medio;

  const checklist = [
    {
      label: 'Secundario completo',
      sub: 'Excluyente',
      icon: GraduationCap,
      status: LABELS.secondaryComplete[fit.secondaryComplete] || LABELS.secondaryComplete.no_especificado,
    },
    {
      label: 'Estudios afines (RR.HH. / Adm.)',
      sub: 'Deseable',
      icon: BookOpen,
      status: LABELS.relatedStudies[fit.relatedStudies] || LABELS.relatedStudies.no_especificado,
    },
    {
      label: 'Experiencia administrativa',
      sub: 'Valorada',
      icon: Briefcase,
      status: LABELS.adminExperience[fit.adminExperience] || LABELS.adminExperience.basica,
    },
    {
      label: 'Microsoft Office / Excel',
      sub: 'Herramientas',
      icon: FileSpreadsheet,
      status: LABELS.officeExcel[fit.officeExcel] || LABELS.officeExcel.no_especificado,
    },
  ];

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-10 animate-fade-slide-up">
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 ring-1 ring-inset ring-teal-200">
                <Sparkles className="h-3.5 w-3.5" />
                {cvAnalysis.usedAi
                  ? `Análisis con ${cvAnalysis.aiProvider || 'IA'}`
                  : 'Diagnóstico inicial del perfil'}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${fitStyle.badge}`}
              >
                {fitStyle.label} · {fit.fitScore ?? 50}/100
              </span>
            </div>
            <h1 className="font-display text-2xl font-extrabold text-slate-900">
              {candidateName}
            </h1>
            <p className="text-xs font-medium text-slate-500">
              {cvAnalysis.candidate?.currentRoleOrStudies}
            </p>
          </div>

          <button
            type="button"
            onClick={onContinue}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
          >
            Comenzar mi jornada laboral
            <ArrowRight className="h-4 w-4 text-teal-400" />
          </button>
        </div>

        {/* Resumen */}
        {cvAnalysis.candidate?.summary && (
          <p className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
            {cvAnalysis.candidate.summary}
          </p>
        )}

        {/* Checklist de requisitos IZET S.A. */}
        <div className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Contraste inicial con los requisitos de IZET S.A.
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {checklist.map(({ label, sub, icon: Icon, status }) => (
              <div
                key={label}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-900">{label}</p>
                    <p className="text-[11px] text-slate-400">{sub}</p>
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${status.tone}`}
                >
                  {status.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Fortalezas y Áreas a desafiar */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-5">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-900">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Fortalezas detectadas en tu CV
            </h3>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-700">
              {(cvAnalysis.strengths || []).map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/40 p-5">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-amber-900">
              <Target className="h-4 w-4 text-amber-600" />
              Qué vamos a poner a prueba
            </h3>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-700">
              {(cvAnalysis.challengeAreas || []).map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pie */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row">
          <p className="text-xs text-slate-500">
            A continuación resolverás <strong className="text-slate-800">{totalScenarios} situaciones reales</strong> del Departamento de RR.HH. de IZET S.A.
          </p>
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-teal-800 sm:w-auto"
          >
            Iniciar Escenario 1
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
