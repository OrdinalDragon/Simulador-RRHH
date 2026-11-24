import { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  FileText,
  Upload,
  Play,
  CheckCircle2,
  MapPin,
  Users,
  Briefcase,
  AlertCircle,
  X,
  ClipboardList,
} from 'lucide-react';

const LOADING_STEPS = [
  'Procesando información del postulante...',
  'Contrastando experiencia y requisitos con el perfil de IZET S.A...',
  'Configurando los 10 escenarios prácticos del Departamento de RR.HH...',
];

export function LandingCV({ onStart, isLoading, error }) {
  const [selectedMode, setSelectedMode] = useState('cv'); // 'cv' | 'standard'
  const [cvInputType, setCvInputType] = useState('pdf'); // 'pdf' | 'text'
  const [candidateName, setCandidateName] = useState('');
  const [cvText, setCvText] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState('');
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isLoading) {
      setLoadingStepIndex(0);
      return;
    }
    const timer = setInterval(() => {
      setLoadingStepIndex((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 1400);
    return () => clearInterval(timer);
  }, [isLoading]);

  const handleFilePick = (file) => {
    setLocalError('');
    if (!file) return;
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setLocalError('Por favor seleccioná un archivo en formato PDF.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setLocalError('El archivo supera el límite de 5 MB.');
      return;
    }
    setCvFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');

    if (selectedMode === 'cv') {
      if (cvInputType === 'pdf' && !cvFile) {
        setLocalError('Subí tu CV en PDF o cambiá a la pestaña "Pegar texto" / "Modo estándar".');
        return;
      }
      if (cvInputType === 'text' && cvText.trim().length < 25) {
        setLocalError('Pegá al menos un breve resumen de tu CV (25 caracteres o más).');
        return;
      }
    }

    onStart({
      mode: selectedMode,
      candidateName: candidateName.trim(),
      cvText: selectedMode === 'cv' && cvInputType === 'text' ? cvText.trim() : '',
      cvFile: selectedMode === 'cv' && cvInputType === 'pdf' ? cvFile : null,
    });
  };

  if (isLoading) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 animate-fade-slide-up">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {selectedMode === 'cv'
                  ? 'Analizando tu CV con Gemini Flash'
                  : 'Preparando tu simulación en IZET S.A.'}
              </h2>
              <p className="text-xs text-slate-500">
                Esto tomará solo unos segundos...
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {LOADING_STEPS.map((step, idx) => {
              const active = idx === loadingStepIndex;
              const done = idx < loadingStepIndex;
              return (
                <div
                  key={step}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                    done
                      ? 'border-teal-200 bg-teal-50/60 text-teal-900'
                      : active
                      ? 'border-slate-300 bg-slate-50 font-medium text-slate-900'
                      : 'border-slate-100 bg-white text-slate-400'
                  }`}
                >
                  <CheckCircle2
                    className={`h-4 w-4 shrink-0 ${
                      done
                        ? 'text-teal-600'
                        : active
                        ? 'animate-pulse text-slate-700'
                        : 'text-slate-300'
                    }`}
                  />
                  <span>{step}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 space-y-2.5">
            <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10 animate-fade-slide-up">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        {/* Columna izquierda: Presentación institucional + Resumen del puesto */}
        <div className="space-y-6 lg:col-span-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3.5 py-1.5 text-xs font-semibold text-teal-800 ring-1 ring-inset ring-teal-200">
            <Briefcase className="h-3.5 w-3.5" />
            Búsqueda laboral · Auxiliar Administrativo/a de RR.HH.
          </div>

          <div className="space-y-3">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Viví el día a día de Recursos Humanos en{' '}
              <span className="text-teal-700">IZET S.A.</span>
            </h1>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              Somos una institución dedicada a brindar atención educativa y terapéutica a
              niños, niñas y jóvenes con discapacidad a través del{' '}
              <strong className="font-semibold text-slate-800">
                Centro Educativo Terapéutico (CET)
              </strong>{' '}
              y el{' '}
              <strong className="font-semibold text-slate-800">
                Servicio de Apoyo a la Integración Escolar (SAIE)
              </strong>
              .
            </p>
          </div>

          {/* Tarjeta de condiciones y requisitos */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Modalidad y sede
                  </p>
                  <p className="text-xs font-semibold text-slate-900">
                    Presencial · IZET S.A.
                  </p>
                  <p className="text-[11px] text-slate-500">Jornada laboral: a definir</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-3">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Dependencia
                  </p>
                  <p className="text-xs font-semibold text-slate-900">
                    Depto. de Recursos Humanos
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Reporta a la Responsable de RR.HH.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-700">
                <ClipboardList className="h-3.5 w-3.5 text-teal-700" />
                Requisitos clave del puesto
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" />
                  <span>
                    <strong className="text-slate-800">Secundario completo</strong> (excluyente).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" />
                  <span>
                    Estudiante de RR.HH., Administración, Relaciones Laborales o afines (deseable).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" />
                  <span>
                    Manejo de Microsoft Office (especialmente Excel y Word) y sistemas digitales.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" />
                  <span>
                    Se valora experiencia administrativa o en RR.HH., organización documental y confidencialidad.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-4 rounded-xl bg-slate-900 p-3.5 text-xs text-slate-200">
              <p className="font-semibold text-teal-300">¿Qué ofrecemos?</p>
              <p className="mt-1 leading-relaxed text-slate-300">
                Incorporación a un equipo interdisciplinario, espacio de aprendizaje y desarrollo
                profesional, experiencia en gestión de RR.HH. y participación en una institución en
                crecimiento.
              </p>
            </div>
          </div>
        </div>

        {/* Columna derecha: Selector de modo y carga de CV */}
        <div className="lg:col-span-6">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-7"
          >
            <div className="mb-5">
              <h2 className="font-display text-xl font-bold text-slate-900">
                Elegí cómo iniciar la simulación
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                10 escenarios prácticos reales · Feedback inmediato · Reporte ejecutivo al finalizar
              </p>
            </div>

            {/* Selector de modo */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedMode('cv');
                  setLocalError('');
                }}
                className={`flex flex-col items-start rounded-2xl border p-4 text-left transition ${
                  selectedMode === 'cv'
                    ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-600/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      selectedMode === 'cv'
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800">
                    IA Personalizada
                  </span>
                </div>
                <span className="mt-3 text-sm font-bold text-slate-900">
                  Iniciar con mi CV
                </span>
                <span className="mt-0.5 text-[11px] leading-snug text-slate-500">
                  Gemini analiza tu perfil y cruza tu CV con tu desempeño real.
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedMode('standard');
                  setLocalError('');
                }}
                className={`flex flex-col items-start rounded-2xl border p-4 text-left transition ${
                  selectedMode === 'standard'
                    ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/15'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    selectedMode === 'standard'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Play className="h-4 w-4" />
                </span>
                <span className="mt-3 text-sm font-bold text-slate-900">
                  Modo estándar
                </span>
                <span className="mt-0.5 text-[11px] leading-snug text-slate-500">
                  Jugá directo los 10 casos sin cargar CV, con reporte completo.
                </span>
              </button>
            </div>

            {/* Nombre opcional */}
            <div className="mt-5">
              <label
                htmlFor="candidateName"
                className="block text-xs font-semibold text-slate-700"
              >
                Tu nombre o alias <span className="font-normal text-slate-400">(opcional)</span>
              </label>
              <input
                id="candidateName"
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="Ej: Sofía Martínez"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/20"
              />
            </div>

            {/* Panel CV */}
            {selectedMode === 'cv' && (
              <div className="mt-5 space-y-3">
                <div className="flex rounded-xl bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setCvInputType('pdf');
                      setLocalError('');
                    }}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                      cvInputType === 'pdf'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Subir CV en PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCvInputType('text');
                      setLocalError('');
                    }}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                      cvInputType === 'text'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Pegar texto del CV
                  </button>
                </div>

                {cvInputType === 'pdf' ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      handleFilePick(e.dataTransfer.files?.[0]);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition ${
                      dragOver
                        ? 'border-teal-500 bg-teal-50/60'
                        : cvFile
                        ? 'border-teal-300 bg-teal-50/30'
                        : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={(e) => handleFilePick(e.target.files?.[0])}
                    />
                    {cvFile ? (
                      <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 text-left shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="h-5 w-5 shrink-0 text-teal-600" />
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-slate-900">
                              {cvFile.name}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {(cvFile.size / 1024).toFixed(0)} KB · Listo para analizar
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCvFile(null);
                          }}
                          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                          aria-label="Quitar archivo"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm ring-1 ring-slate-200">
                          <Upload className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-semibold text-slate-800">
                          Arrastrá tu CV en PDF o hacé clic para buscarlo
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Formato PDF con texto seleccionable · Máx. 5 MB
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <textarea
                      rows={5}
                      value={cvText}
                      onChange={(e) => setCvText(e.target.value)}
                      placeholder="Pegá aquí tu formación (secundario, estudios en RR.HH./Administración), experiencia administrativa y herramientas (Excel, Word, sistemas)..."
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                    />
                  </div>
                )}
              </div>
            )}

            {(localError || error) && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-800">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                <span>{localError || error}</span>
              </div>
            )}

            <button
              type="submit"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            >
              {selectedMode === 'cv' ? (
                <>
                  <Sparkles className="h-4 w-4 text-teal-400" />
                  Analizar CV y comenzar simulación
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 text-teal-400" />
                  Comenzar en modo estándar
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
