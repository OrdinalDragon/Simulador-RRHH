import { useState } from 'react';
import {
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Mail,
  Printer,
  RotateCcw,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from 'lucide-react';
import { COMPETENCY_META } from './CompetencyBars.jsx';

const SUBJECT_LINE = 'Búsqueda laboral – Auxiliar Administrativo/a de RR. HH.';

function CompetencyRadar({ competencies }) {
  const width = 320;
  const height = 220;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = 64;
  const values = COMPETENCY_META.map((c) => Math.max(10, Math.min(100, competencies?.[c.key] ?? 50)));

  // 4 ejes: arriba, derecha, abajo, izquierda
  const angles = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];

  const getPoint = (value, angle) => {
    const r = (value / 100) * maxRadius;
    return [centerX + r * Math.cos(angle), centerY + r * Math.sin(angle)];
  };

  const dataPoints = values.map((v, i) => getPoint(v, angles[i]).join(',')).join(' ');

  return (
    <div className="flex w-full flex-col items-center">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full max-w-[320px]">
        {[25, 50, 75, 100].map((level) => {
          const pts = angles.map((a) => getPoint(level, a).join(',')).join(' ');
          return (
            <polygon
              key={level}
              points={pts}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="1"
            />
          );
        })}

        {angles.map((angle, idx) => {
          const [x, y] = getPoint(100, angle);
          return (
            <line
              key={idx}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke="#E2E8F0"
              strokeWidth="1"
            />
          );
        })}

        <polygon
          points={dataPoints}
          fill="rgba(13, 148, 136, 0.22)"
          stroke="#0D9488"
          strokeWidth="2.5"
        />

        {values.map((v, i) => {
          const [cx, cy] = getPoint(v, angles[i]);
          return <circle key={i} cx={cx} cy={cy} r="4" fill="#0F172A" stroke="#fff" strokeWidth="1.5" />;
        })}

        {/* Etiquetas con amplio margen lateral para que nunca se recorten */}
        <text x={centerX} y={28} textAnchor="middle" className="fill-slate-600 text-[10px] font-semibold">
          Organización
        </text>
        <text x={centerX + maxRadius + 12} y={centerY + 3} textAnchor="start" className="fill-slate-600 text-[10px] font-semibold">
          Datos
        </text>
        <text x={centerX} y={height - 16} textAnchor="middle" className="fill-slate-600 text-[10px] font-semibold">
          Confidencialidad
        </text>
        <text x={centerX - maxRadius - 12} y={centerY + 3} textAnchor="end" className="fill-slate-600 text-[10px] font-semibold">
          Comunicación
        </text>
      </svg>
    </div>
  );
}

export function ResultReport({ result, onRestart }) {
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [showDecisions, setShowDecisions] = useState(false);

  if (!result) return null;

  const {
    candidateName,
    mode,
    finalScore,
    competencies,
    stats,
    answers = [],
    finalReport,
    cvAnalysis,
  } = result;

  const circumference = 2 * Math.PI * 44;
  const strokeDashoffset =
    circumference - (Math.min(100, Math.max(0, finalScore)) / 100) * circumference;

  const formattedDate = new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'long',
  }).format(new Date());

  const handleCopySubject = async () => {
    try {
      await navigator.clipboard.writeText(SUBJECT_LINE);
      setCopiedSubject(true);
      setTimeout(() => setCopiedSubject(false), 2200);
    } catch {
      // Fallback silencioso si el navegador bloquea clipboard
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-10 animate-fade-slide-up">
      {/* Encabezado Ejecutivo */}
      <div className="rounded-3xl border border-slate-200/90 bg-slate-900 p-6 text-white shadow-sm sm:p-8 print:border-slate-300 print:bg-white print:text-slate-900">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/20 px-3 py-1 text-xs font-semibold text-teal-300 ring-1 ring-inset ring-teal-400/30 print:bg-teal-50 print:text-teal-800 print:ring-teal-200">
                <Award className="h-3.5 w-3.5" />
                Reporte Ejecutivo · IZET S.A.
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-slate-200 print:bg-slate-100 print:text-slate-700">
                {mode === 'cv' ? 'Simulación personalizada con CV' : 'Simulación modo estándar'}
              </span>
              <span className="text-[11px] text-slate-400 print:text-slate-500">
                {formattedDate}
              </span>
            </div>

            <h1 className="font-display text-2xl font-extrabold sm:text-3xl">
              {candidateName}
            </h1>
            <p className="text-sm font-medium text-teal-300 print:text-teal-700">
              {finalReport?.performanceLevel || 'Evaluación completada'}
            </p>
            <p className="text-xs text-slate-300 print:text-slate-600">
              Decisiones óptimas:{' '}
              <strong className="text-white print:text-slate-900">
                {stats?.optimalCount ?? 0} de {stats?.totalScenarios ?? 10}
              </strong>
              {mode === 'cv' && cvAnalysis?.requirementsFit?.fitScore != null && (
                <>
                  {' '}
                  · Encaje inicial CV:{' '}
                  <strong className="text-white print:text-slate-900">
                    {cvAnalysis.requirementsFit.fitScore}/100
                  </strong>
                </>
              )}
            </p>
          </div>

          {/* Gauge circular */}
          <div className="flex items-center gap-4 self-start sm:self-center">
            <div className="relative flex h-28 w-28 items-center justify-center">
              <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="rgba(148,163,184,0.25)"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="#14B8A6"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-3xl font-extrabold text-white print:text-slate-900">
                  {finalScore}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-300 print:text-slate-500">
                  / 100
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desglose por competencias */}
      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm lg:col-span-7">
          <h2 className="font-display text-lg font-bold text-slate-900">
            Desglose por competencia clave
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Resultados consolidados tras los 10 escenarios del Departamento de RR.HH.
          </p>

          <div className="mt-5 space-y-4">
            {COMPETENCY_META.map(({ key, label, icon: Icon, barColor, softBg }) => {
              const value = competencies?.[key] ?? 0;
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${softBg}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-semibold text-slate-800">{label}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{value}/100</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${barColor}`}
                      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm lg:col-span-5">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
            Mapa de competencias
          </h3>
          <CompetencyRadar competencies={competencies} />
        </div>
      </div>

      {/* Dictamen personalizado */}
      <div className="mt-6 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">
              Dictamen personalizado
            </h2>
            <p className="text-xs text-slate-500">
              {finalReport?.usedAi
                ? 'Generado con Gemini Flash cruzando tu CV y tu desempeño en la simulación'
                : 'Generado con motor de evaluación institucional de IZET S.A.'}
            </p>
          </div>
        </div>

        <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
          {finalReport?.executiveSummary}
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {/* Coincidencias */}
          <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-900">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              {mode === 'cv' ? 'Coincidencias CV vs. Simulación' : 'Fortalezas demostradas'}
            </h3>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-700">
              {(finalReport?.cvCoincidences || []).map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Brechas */}
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/40 p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-amber-900">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              Brechas y áreas de fortalecimiento
            </h3>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-700">
              {(finalReport?.gaps || []).map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recomendaciones */}
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Lightbulb className="h-4 w-4 text-teal-600" />
            Recomendaciones concretas para el puesto en IZET S.A.
          </h3>
          <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-700">
            {(finalReport?.recommendations || []).map((rec, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-[10px] font-bold text-teal-800">
                  {i + 1}
                </span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Acordeón: Detalle de las 10 decisiones */}
      {answers.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setShowDecisions((prev) => !prev)}
            className="flex w-full items-center justify-between gap-3 px-6 py-4 text-left hover:bg-slate-50/70 transition no-print"
          >
            <div>
              <h2 className="font-display text-base font-bold text-slate-900">
                Detalle de tus {answers.length} decisiones
              </h2>
              <p className="text-xs text-slate-500">
                Revisá caso por caso qué decisiones fueron óptimas y los aprendizajes clave
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 shrink-0">
              {showDecisions ? 'Ocultar detalle' : 'Ver detalle'}
              {showDecisions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </span>
          </button>

          {showDecisions && (
            <div className="divide-y divide-slate-100 border-t border-slate-100 px-6 pb-4">
              {answers.map((ans, idx) => (
                <div key={`${ans.scenarioCode}-${idx}`} className="py-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {ans.isOptimal ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                      )}
                      <span className="text-xs font-bold text-slate-900">
                        {idx + 1}. {ans.scenarioTitle}
                      </span>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        ans.isOptimal
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {ans.isOptimal ? 'Óptima' : 'A fortalecer'} · Opción {ans.selectedOptionId}
                    </span>
                  </div>
                  <p className="mt-1.5 pl-6 text-xs leading-relaxed text-slate-600">
                    {ans.feedback}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Postulación oficial y acciones */}
      <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-teal-200 bg-teal-50/60 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">¿Querés postularte a IZET S.A.?</h3>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-700">
              Enviá tu CV actualizado a través del canal oficial de contacto de IZET indicando en
              el asunto:{' '}
              <strong className="text-slate-900">“{SUBJECT_LINE}”</strong>
            </p>
            <button
              type="button"
              onClick={handleCopySubject}
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-teal-800 ring-1 ring-inset ring-teal-200 transition hover:bg-teal-50 no-print"
            >
              {copiedSubject ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  Asunto copiado
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copiar asunto de postulación
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2.5 no-print">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 transition hover:bg-slate-50"
          >
            <Printer className="h-4 w-4" />
            Imprimir / PDF
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
          >
            <RotateCcw className="h-4 w-4 text-teal-400" />
            Nueva simulación
          </button>
        </div>
      </div>
    </section>
  );
}
