import { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Target,
  Loader2,
  Award,
  Clock,
} from 'lucide-react';
import { CompetencyBars, COMPETENCY_META } from './CompetencyBars.jsx';

const FIT_BADGE = {
  alto: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  medio: 'bg-amber-50 text-amber-800 ring-amber-200',
  en_desarrollo: 'bg-slate-100 text-slate-700 ring-slate-200',
};

const FIT_LABEL = {
  alto: 'Encaje inicial alto',
  medio: 'Encaje inicial medio',
  en_desarrollo: 'Perfil en desarrollo',
};

const WORKDAY_TIMES = [
  '09:15 hs',
  '09:50 hs',
  '10:30 hs',
  '11:15 hs',
  '12:05 hs',
  '13:20 hs',
  '14:10 hs',
  '14:55 hs',
  '15:40 hs',
  '16:25 hs',
];

export function GameBoard({
  mode,
  cvAnalysis,
  scenario,
  currentRound,
  totalScenarios,
  competencies,
  feedbackState,
  selectedOptionId,
  isSubmitting,
  isFinishing,
  error,
  onAnswer,
  onNext,
}) {
  const [showCvCard, setShowCvCard] = useState(false);

  const primaryMeta = COMPETENCY_META.find((c) => c.key === scenario?.primaryCompetency);
  const simulatedTime = WORKDAY_TIMES[(currentRound - 1) % WORKDAY_TIMES.length];

  const impactBadges = feedbackState?.impact
    ? COMPETENCY_META.map((meta) => ({
        ...meta,
        delta: feedbackState.impact[meta.key] ?? 0,
      })).filter((item) => item.delta !== 0)
    : [];

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
      {/* Banner colapsable del análisis de CV */}
      {mode === 'cv' && cvAnalysis && (
        <div className="mb-6 rounded-2xl border border-teal-200/80 bg-white shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setShowCvCard((prev) => !prev)}
            className="flex w-full items-center justify-between gap-3 px-5 py-3 text-left hover:bg-slate-50/70 transition"
          >
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold text-slate-900">
                Diagnóstico del CV (
                {cvAnalysis.usedAi ? cvAnalysis.aiProvider || 'IA' : 'Análisis institucional'})
              </span>
              {cvAnalysis.requirementsFit?.overallFitLevel && (
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${
                    FIT_BADGE[cvAnalysis.requirementsFit.overallFitLevel] || FIT_BADGE.medio
                  }`}
                >
                  {FIT_LABEL[cvAnalysis.requirementsFit.overallFitLevel] || 'Encaje medio'} ·{' '}
                  {cvAnalysis.requirementsFit.fitScore}/100
                </span>
              )}
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 shrink-0">
              {showCvCard ? 'Ocultar' : 'Ver resumen'}
              {showCvCard ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </span>
          </button>

          {showCvCard && (
            <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 text-xs">
              <p className="text-slate-600 leading-relaxed">{cvAnalysis.candidate?.summary}</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="font-bold text-slate-800 mb-1.5">Fortalezas detectadas</p>
                  <ul className="space-y-1 text-slate-600">
                    {(cvAnalysis.strengths || []).map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-bold text-slate-800 mb-1.5">Áreas a desafiar en el juego</p>
                  {(cvAnalysis.challengeAreas || []).length > 0 ? (
                    <ul className="space-y-1 text-slate-600">
                      {cvAnalysis.challengeAreas.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500">
                      Validar en la práctica el criterio integral en todos los escenarios del área.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        {/* Columna principal: Escenario */}
        <div className="lg:col-span-8">
          {scenario && (
            <div
              key={scenario.id}
              className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm animate-fade-slide-up"
            >
              {/* Barra de contexto laboral simulada */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/80 px-6 py-3 sm:px-8">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <Clock className="h-3.5 w-3.5 text-teal-700" />
                  <span>{simulatedTime}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-800">{scenario.area}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[11px] font-bold text-white">
                    Caso {currentRound} / {totalScenarios}
                  </span>
                  {primaryMeta && (
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${primaryMeta.softBg}`}>
                      {primaryMeta.shortLabel}
                    </span>
                  )}
                  {scenario.isFocusChallenge && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 ring-1 ring-inset ring-amber-200">
                      <Target className="h-3 w-3" />
                      Desafío priorizado por tu CV
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {/* Título y contexto */}
                <h2 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">
                  {scenario.title}
                </h2>

                <div className="mt-4 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 sm:p-5">
                  <p className="text-sm leading-relaxed text-slate-700">{scenario.context}</p>
                </div>

                <p className="mt-5 text-sm font-bold text-slate-900">{scenario.question}</p>

                {/* Opciones */}
                <div className="mt-4 space-y-3">
                  {scenario.options.map((option) => {
                    const isSelected = selectedOptionId === option.id;
                    const locked = Boolean(feedbackState) || isSubmitting;

                    let cardStyle =
                      'border-slate-200 bg-white hover:border-teal-500 hover:bg-teal-50/20';
                    if (isSelected && feedbackState) {
                      cardStyle = feedbackState.isOptimal
                        ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                        : 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20';
                    } else if (isSelected) {
                      cardStyle = 'border-slate-900 bg-slate-50';
                    } else if (locked) {
                      cardStyle = 'border-slate-100 bg-slate-50/50 opacity-65';
                    }

                    return (
                      <button
                        key={option.id}
                        type="button"
                        disabled={locked}
                        onClick={() => onAnswer(option.id)}
                        className={`group flex w-full items-start gap-3.5 rounded-2xl border p-4 text-left transition ${cardStyle} ${
                          locked ? 'cursor-default' : 'cursor-pointer'
                        }`}
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition ${
                            isSelected
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-700 group-hover:bg-teal-600 group-hover:text-white'
                          }`}
                        >
                          {option.id}
                        </span>
                        <span className="text-sm leading-relaxed text-slate-800">
                          {option.text}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {isSubmitting && (
                  <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
                    Registrando tu decisión...
                  </div>
                )}

                {error && (
                  <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800">
                    {error}
                  </div>
                )}

                {/* Feedback inmediato + píldoras de impacto */}
                {feedbackState && (
                  <div
                    className={`mt-6 rounded-2xl border p-5 animate-fade-slide-up ${
                      feedbackState.isOptimal
                        ? 'border-emerald-200 bg-emerald-50/70'
                        : 'border-amber-200 bg-amber-50/70'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {feedbackState.isOptimal ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                      )}
                      <div className="flex-1">
                        <p
                          className={`text-xs font-bold uppercase tracking-wide ${
                            feedbackState.isOptimal ? 'text-emerald-800' : 'text-amber-800'
                          }`}
                        >
                          {feedbackState.isOptimal
                            ? 'Decisión alineada al estándar de IZET S.A.'
                            : 'Oportunidad de mejora administrativa'}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-800">
                          {feedbackState.feedback}
                        </p>

                        {impactBadges.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {impactBadges.map((item) => (
                              <span
                                key={item.key}
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                                  item.delta > 0
                                    ? 'bg-white/90 text-emerald-700 ring-1 ring-inset ring-emerald-200'
                                    : 'bg-white/90 text-rose-700 ring-1 ring-inset ring-rose-200'
                                }`}
                              >
                                {item.delta > 0 ? `+${item.delta}` : item.delta} {item.shortLabel}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        disabled={isFinishing}
                        onClick={onNext}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-70"
                      >
                        {isFinishing ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin text-teal-400" />
                            Generando dictamen ejecutivo...
                          </>
                        ) : feedbackState.isFinished ? (
                          <>
                            <Award className="h-4 w-4 text-teal-400" />
                            Ver reporte ejecutivo
                          </>
                        ) : (
                          <>
                            Siguiente escenario
                            <ArrowRight className="h-4 w-4 text-teal-400" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Columna derecha: Métricas en vivo */}
        <div className="lg:col-span-4 lg:sticky lg:top-20">
          <CompetencyBars
            competencies={competencies}
            lastImpact={feedbackState?.impact || null}
            currentRound={currentRound}
            totalScenarios={totalScenarios}
          />
        </div>
      </div>
    </section>
  );
}
