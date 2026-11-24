import { GoogleGenAI, Type } from '@google/genai';
import { matchSampleCv } from '../data/sampleCvsData.js';

const GEMINI_FALLBACK_MODELS = ['gemini-3.8-flash', 'gemini-3.5-flash-lite'];
const GEMINI_MODEL = (process.env.GEMINI_MODEL || GEMINI_FALLBACK_MODELS[0]).trim();
const GROQ_MODEL = (process.env.GROQ_MODEL || 'llama-3.3-70b-versatile').trim();
const MISTRAL_MODEL = (process.env.MISTRAL_MODEL || 'mistral-small-latest').trim();
const OPENROUTER_MODEL = (
  process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free'
).trim();

const JOB_PROFILE_CONTEXT = `
Institución: IZET S.A. (atención educativa y terapéutica a niños, niñas y jóvenes con discapacidad a través del Centro Educativo Terapéutico - CET - y el Servicio de Apoyo a la Integración Escolar - SAIE).
Puesto: Auxiliar Administrativo/a de Recursos Humanos (Presencial, reporta a la Responsable del Departamento de RR.HH.).
Objetivo: Brindar asistencia administrativa al Departamento de RR.HH., colaborando en la organización, actualización y control de documentación del personal, seguimiento de registros y gestión de información.
Responsabilidades:
- Organizar, actualizar y mantener legajos del personal.
- Recibir, controlar y archivar documentación presentada por los profesionales.
- Seguimiento de registros mensuales y planillas de actividades.
- Colaborar con la preparación y organización de documentación para liquidación de honorarios y remuneraciones.
- Cargar y actualizar información en bases de datos y sistemas digitales de gestión.
- Elaborar planillas, informes administrativos y reportes del área.
- Colaborar en publicación de búsquedas laborales y recepción de currículums.
- Brindar apoyo administrativo en procesos de selección e incorporación de nuevos profesionales.
- Atender consultas del personal y orientar sobre procedimientos administrativos.
- Colaborar en organización de reuniones, capacitaciones y actividades internas.
- Comunicación fluida con coordinadores y responsables de las distintas áreas.
Requisitos estrictos:
- Secundario completo (excluyente).
- Estudiante de RR.HH., Administración, Relaciones Laborales o carreras afines (deseable).
- Experiencia previa en tareas administrativas o departamentos de RR.HH. (valorada).
- Manejo de Microsoft Office, especialmente Excel y Word.
- Conocimientos básicos de administración de personal y organización de documentación.
- Capacidad para trabajar con sistemas digitales y bases de datos.
Competencias evaluadas:
1. organizacionDetalle (Organización, planificación y atención al detalle)
2. gestionDatos (Gestión administrativa, planillas, Excel y bases de datos)
3. confidencialidadEtica (Discreción, confidencialidad y responsabilidad)
4. comunicacionServicio (Comunicación interpersonal, trabajo en equipo, buen trato y orientación al servicio)
`;

const COMPETENCY_LABELS = {
  organizacionDetalle: 'Organización y Detalle',
  gestionDatos: 'Gestión Administrativa y Datos',
  confidencialidadEtica: 'Confidencialidad y Ética',
  comunicacionServicio: 'Comunicación y Servicio',
};

const VALID_COMPETENCIES = Object.keys(COMPETENCY_LABELS);

function getKey(name) {
  const val = process.env[name]?.trim();
  if (!val || val.startsWith('tu_api_key')) return null;
  return val;
}

export function getConfiguredProviders() {
  return {
    gemini: Boolean(getKey('GEMINI_API_KEY')),
    groq: Boolean(getKey('GROQ_API_KEY')),
    mistral: Boolean(getKey('MISTRAL_API_KEY')),
    openrouter: Boolean(getKey('OPENROUTER_API_KEY')),
  };
}

function parseJsonSafe(rawText) {
  const cleaned = String(rawText || '')
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  return JSON.parse(cleaned);
}

function pickEnum(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

function toStringArray(value, fallback = []) {
  if (!Array.isArray(value)) return fallback;
  return value.map((item) => String(item || '').trim()).filter(Boolean);
}

function normalizeCvAnalysis(parsed, aiProvider) {
  const fit = parsed?.requirementsFit || {};
  const focus = toStringArray(parsed?.focusCompetencies).filter((c) =>
    VALID_COMPETENCIES.includes(c)
  );

  return {
    usedAi: true,
    aiProvider,
    fallbackReason: null,
    candidate: {
      fullName: String(parsed?.candidate?.fullName || 'Postulante').trim(),
      currentRoleOrStudies: String(
        parsed?.candidate?.currentRoleOrStudies || 'Postulante a Auxiliar Administrativo/a'
      ).trim(),
      summary: String(parsed?.candidate?.summary || '').trim(),
    },
    requirementsFit: {
      secondaryComplete: pickEnum(
        fit.secondaryComplete,
        ['si', 'no', 'no_especificado'],
        'no_especificado'
      ),
      relatedStudies: pickEnum(
        fit.relatedStudies,
        ['si', 'en_curso', 'no', 'no_especificado'],
        'no_especificado'
      ),
      adminExperience: pickEnum(
        fit.adminExperience,
        ['alta', 'media', 'basica', 'ninguna'],
        'basica'
      ),
      officeExcel: pickEnum(
        fit.officeExcel,
        ['avanzado', 'intermedio', 'basico', 'no_especificado'],
        'no_especificado'
      ),
      overallFitLevel: pickEnum(
        fit.overallFitLevel,
        ['alto', 'medio', 'en_desarrollo'],
        'medio'
      ),
      fitScore: Math.min(100, Math.max(0, Math.round(Number(fit.fitScore ?? 50)))),
    },
    strengths: toStringArray(parsed?.strengths, [
      'Interés en incorporarse al Departamento de Recursos Humanos de IZET S.A.',
    ]),
    challengeAreas: toStringArray(parsed?.challengeAreas, [
      'Validar criterio administrativo y confidencialidad en escenarios prácticos.',
    ]),
    focusCompetencies: focus.length > 0 ? focus : ['organizacionDetalle', 'confidencialidadEtica'],
  };
}

function normalizeFinalReport(parsed, aiProvider) {
  return {
    usedAi: true,
    aiProvider,
    performanceLevel: String(parsed?.performanceLevel || 'Evaluación completada').trim(),
    executiveSummary: String(parsed?.executiveSummary || '').trim(),
    cvCoincidences: toStringArray(parsed?.cvCoincidences),
    gaps: toStringArray(parsed?.gaps),
    recommendations: toStringArray(parsed?.recommendations),
    closingNote: String(
      parsed?.closingNote ||
        'Este reporte es orientativo y refleja el desempeño simulado frente a situaciones cotidianas del Departamento de RR.HH. de IZET S.A.'
    ).trim(),
  };
}

const cvAnalysisResponseSchema = {
  type: Type.OBJECT,
  properties: {
    candidate: {
      type: Type.OBJECT,
      properties: {
        fullName: { type: Type.STRING },
        currentRoleOrStudies: { type: Type.STRING },
        summary: { type: Type.STRING },
      },
      required: ['fullName', 'currentRoleOrStudies', 'summary'],
    },
    requirementsFit: {
      type: Type.OBJECT,
      properties: {
        secondaryComplete: { type: Type.STRING, enum: ['si', 'no', 'no_especificado'] },
        relatedStudies: { type: Type.STRING, enum: ['si', 'en_curso', 'no', 'no_especificado'] },
        adminExperience: { type: Type.STRING, enum: ['alta', 'media', 'basica', 'ninguna'] },
        officeExcel: {
          type: Type.STRING,
          enum: ['avanzado', 'intermedio', 'basico', 'no_especificado'],
        },
        overallFitLevel: { type: Type.STRING, enum: ['alto', 'medio', 'en_desarrollo'] },
        fitScore: { type: Type.INTEGER },
      },
      required: [
        'secondaryComplete',
        'relatedStudies',
        'adminExperience',
        'officeExcel',
        'overallFitLevel',
        'fitScore',
      ],
    },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    challengeAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
    focusCompetencies: {
      type: Type.ARRAY,
      items: { type: Type.STRING, enum: VALID_COMPETENCIES },
    },
  },
  required: ['candidate', 'requirementsFit', 'strengths', 'challengeAreas', 'focusCompetencies'],
};

const finalReportResponseSchema = {
  type: Type.OBJECT,
  properties: {
    performanceLevel: { type: Type.STRING },
    executiveSummary: { type: Type.STRING },
    cvCoincidences: { type: Type.ARRAY, items: { type: Type.STRING } },
    gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
    recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
    closingNote: { type: Type.STRING },
  },
  required: [
    'performanceLevel',
    'executiveSummary',
    'cvCoincidences',
    'gaps',
    'recommendations',
    'closingNote',
  ],
};

/**
 * Extrae texto de PDFs escaneados (como CamScanner) usando Mistral OCR si MISTRAL_API_KEY existe.
 */
export async function extractPdfTextWithOcr(pdfBuffer) {
  const mistralKey = getKey('MISTRAL_API_KEY');
  if (!mistralKey || !pdfBuffer) return '';

  try {
    const base64 = pdfBuffer.toString('base64');
    const response = await fetch('https://api.mistral.ai/v1/ocr', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${mistralKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral-ocr-latest',
        document: {
          type: 'document_url',
          document_url: `data:application/pdf;base64,${base64}`,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`[AIService] Mistral OCR falló (${response.status}):`, errText.slice(0, 200));
      return '';
    }

    const data = await response.json();
    const extracted = (data?.pages || [])
      .map((p) => p.markdown || '')
      .join('\n\n')
      .trim();

    if (extracted) {
      console.log(`[AIService] Mistral OCR extrajo ${extracted.length} caracteres del PDF escaneado.`);
    }
    return extracted;
  } catch (error) {
    console.warn('[AIService] Error en Mistral OCR:', error.message);
    return '';
  }
}

async function callGemini({ prompt, responseSchema, temperature, pdfBuffer }) {
  const apiKey = getKey('GEMINI_API_KEY');
  if (!apiKey) throw new Error('GEMINI_API_KEY no configurada');

  const ai = new GoogleGenAI({ apiKey });
  const modelsToTry = Array.from(new Set([GEMINI_MODEL, ...GEMINI_FALLBACK_MODELS]));

  const contents = pdfBuffer
    ? [
        {
          inlineData: {
            mimeType: 'application/pdf',
            data: pdfBuffer.toString('base64'),
          },
        },
        prompt,
      ]
    : prompt;

  let lastError;
  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          responseMimeType: 'application/json',
          responseSchema,
          temperature,
        },
      });
      console.log(`[AIService] Respuesta exitosa con Gemini (${model})`);
      return { data: parseJsonSafe(response.text), provider: `Gemini (${model})` };
    } catch (error) {
      lastError = error;
      console.warn(`[AIService] Gemini ${model} falló:`, error?.status || error?.message);
    }
  }
  throw lastError;
}

async function callOpenAiCompatible({
  providerName,
  endpoint,
  apiKey,
  model,
  prompt,
  temperature,
  extraHeaders = {},
  pdfBase64 = null,
}) {
  const userContent = pdfBase64
    ? [
        { type: 'text', text: prompt },
        {
          type: 'file',
          file: {
            filename: 'cv.pdf',
            file_data: `data:application/pdf;base64,${pdfBase64}`,
          },
        },
      ]
    : prompt;

  const body = {
    model,
    temperature,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'Sos un especialista en selección de RR.HH. de IZET S.A. Respondé SIEMPRE con un único objeto JSON válido en español rioplatense, sin texto adicional ni markdown.',
      },
      { role: 'user', content: userContent },
    ],
  };

  if (pdfBase64 && providerName === 'OpenRouter') {
    body.plugins = [{ id: 'file-parser', pdf: { engine: 'mistral-ocr' } }];
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`${providerName} HTTP ${response.status}: ${errText.slice(0, 220)}`);
  }

  const json = await response.json();
  const content = json?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error(`${providerName} devolvió una respuesta vacía.`);
  }

  console.log(`[AIService] Respuesta exitosa con ${providerName} (${model})`);
  return { data: parseJsonSafe(content), provider: providerName };
}

async function runProviderCascade({ prompt, responseSchema, temperature, pdfBuffer = null, hasText = true }) {
  const providers = [];

  if (getKey('GEMINI_API_KEY')) {
    providers.push({
      name: 'Gemini',
      fn: () => callGemini({ prompt, responseSchema, temperature, pdfBuffer: hasText ? null : pdfBuffer }),
    });
  }

  if (getKey('GROQ_API_KEY') && hasText) {
    providers.push({
      name: 'Groq',
      fn: () =>
        callOpenAiCompatible({
          providerName: 'Groq',
          endpoint: 'https://api.groq.com/openai/v1/chat/completions',
          apiKey: getKey('GROQ_API_KEY'),
          model: GROQ_MODEL,
          prompt,
          temperature,
        }),
    });
  }

  if (getKey('MISTRAL_API_KEY') && hasText) {
    providers.push({
      name: 'Mistral',
      fn: () =>
        callOpenAiCompatible({
          providerName: 'Mistral',
          endpoint: 'https://api.mistral.ai/v1/chat/completions',
          apiKey: getKey('MISTRAL_API_KEY'),
          model: MISTRAL_MODEL,
          prompt,
          temperature,
        }),
    });
  }

  if (getKey('OPENROUTER_API_KEY')) {
    providers.push({
      name: 'OpenRouter',
      fn: () =>
        callOpenAiCompatible({
          providerName: 'OpenRouter',
          endpoint: 'https://openrouter.ai/api/v1/chat/completions',
          apiKey: getKey('OPENROUTER_API_KEY'),
          model: OPENROUTER_MODEL,
          prompt,
          temperature,
          pdfBase64: !hasText && pdfBuffer ? pdfBuffer.toString('base64') : null,
          extraHeaders: {
            'HTTP-Referer': process.env.CLIENT_ORIGIN || 'https://simulador-rrhh.vercel.app',
            'X-Title': 'IZET S.A. Simulador RRHH',
          },
        }),
    });
  }

  let lastError = new Error('No hay proveedores de IA configurados.');
  for (const provider of providers) {
    try {
      return await provider.fn();
    } catch (error) {
      lastError = error;
      console.warn(`[AIService] Falló ${provider.name}, pasando al siguiente proveedor:`, error.message);
    }
  }
  throw lastError;
}

function heuristicCvAnalysis(cvText, fallbackReason) {
  const matchedSample = matchSampleCv(cvText);
  if (matchedSample) {
    return {
      usedAi: false,
      aiProvider: null,
      fallbackReason,
      ...matchedSample.fallbackAnalysis,
    };
  }

  const normalized = cvText.toLowerCase();
  const firstLine =
    cvText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .find((l) => l.length >= 3 && l.length <= 60 && !l.includes('@')) || 'Postulante';

  const hasSecondary = /secundario|bachiller|polimodal|t[eé]cnico|universidad|licenciatura|terciario/.test(
    normalized
  );
  const hasRelatedStudies = /recursos humanos|rr\.?\s*hh|administraci[oó]n|relaciones laborales|contador|contabilidad/.test(
    normalized
  );
  const hasInProgress = /en curso|estudiante|cursando|actualidad/.test(normalized);
  const hasAdminExp = /administrativ|legajo|archivo|facturaci[oó]n|liquidaci[oó]n|secretar|recepci[oó]n|rrhh|recursos humanos/.test(
    normalized
  );
  const hasExcelAdvanced = /excel avanzado|tablas din[aá]micas|macros|power bi|buscarv/.test(normalized);
  const hasExcel = /excel|office|word|planillas|google sheets/.test(normalized);

  const secondaryComplete = hasSecondary ? 'si' : 'no_especificado';
  const relatedStudies = hasRelatedStudies ? (hasInProgress ? 'en_curso' : 'si') : 'no_especificado';
  const adminExperience = hasAdminExp ? 'media' : 'basica';
  const officeExcel = hasExcelAdvanced ? 'avanzado' : hasExcel ? 'intermedio' : 'no_especificado';

  let fitScore = 45;
  if (secondaryComplete === 'si') fitScore += 15;
  if (relatedStudies === 'si' || relatedStudies === 'en_curso') fitScore += 15;
  if (adminExperience === 'media') fitScore += 15;
  if (officeExcel === 'avanzado') fitScore += 10;
  else if (officeExcel === 'intermedio') fitScore += 7;

  const overallFitLevel = fitScore >= 75 ? 'alto' : fitScore >= 55 ? 'medio' : 'en_desarrollo';

  const strengths = [];
  const challengeAreas = [];
  const focusCompetencies = [];

  if (relatedStudies !== 'no_especificado') {
    strengths.push('Formación académica alineada con Recursos Humanos o Administración.');
  } else {
    challengeAreas.push('Profundizar en prácticas y documentación específica de administración de personal.');
    focusCompetencies.push('organizacionDetalle');
  }

  if (officeExcel === 'avanzado' || officeExcel === 'intermedio') {
    strengths.push('Manejo declarado de herramientas ofimáticas (Office/Excel) para planillas y registros.');
  } else {
    challengeAreas.push('Validar dominio práctico de Excel, planillas de seguimiento y bases de datos.');
    focusCompetencies.push('gestionDatos');
  }

  if (adminExperience === 'media') {
    strengths.push('Antecedentes vinculados a tareas administrativas, soporte documental o gestión operativa.');
  } else {
    challengeAreas.push('Poner a prueba criterio administrativo ante situaciones cotidianas del área de RR.HH.');
    focusCompetencies.push('comunicacionServicio');
  }

  if (strengths.length === 0) {
    strengths.push('Interés en incorporarse al equipo interdisciplinario de IZET S.A.');
  }
  if (challengeAreas.length === 0) {
    challengeAreas.push(
      'Validar criterio práctico en confidencialidad de legajos y articulación diaria entre CET y SAIE.'
    );
  }
  if (focusCompetencies.length === 0) {
    focusCompetencies.push('confidencialidadEtica', 'organizacionDetalle');
  }

  return {
    usedAi: false,
    aiProvider: null,
    fallbackReason,
    candidate: {
      fullName: firstLine,
      currentRoleOrStudies: hasRelatedStudies
        ? 'Perfil orientado a Administración / RR.HH.'
        : 'Perfil en evaluación para Auxiliar Administrativo/a',
      summary:
        'Análisis preliminar automático generado en modo resiliente sobre el texto del CV cargado.',
    },
    requirementsFit: {
      secondaryComplete,
      relatedStudies,
      adminExperience,
      officeExcel,
      overallFitLevel,
      fitScore: Math.min(100, Math.max(20, fitScore)),
    },
    strengths,
    challengeAreas,
    focusCompetencies,
  };
}

function deterministicFinalReport(session, competencyScores, finalScore) {
  const entries = Object.entries(competencyScores).sort((a, b) => b[1] - a[1]);
  const topComp = entries[0];
  const lowComp = entries[entries.length - 1];

  const performanceLevel =
    finalScore >= 85
      ? 'Sobresaliente — Listo/a para el rol'
      : finalScore >= 70
      ? 'Sólido — Buen encaje operativo'
      : finalScore >= 55
      ? 'En desarrollo — Potencial con acompañamiento'
      : 'Inicial — Requiere fortalecimiento administrativo';

  const optimalCount = session.answers.filter((a) => a.isOptimal).length;
  const totalCount = session.answers.length || 10;

  const cvCoincidences = [];
  const gaps = [];
  const matchedSample = matchSampleCv(session.cvRawText || session.candidateName);

  if (matchedSample?.id === 'sofia_martinez') {
    if (competencyScores.organizacionDetalle >= 65) {
      cvCoincidences.push(
        'Su experiencia administrativa en Centro Integral Plus y el Estudio Contable Gómez & Asociados se confirmó con criterio sólido en legajos y control documental.'
      );
    } else {
      gaps.push(
        'A pesar de declarar experiencia en gestión de documentación y archivos, en la simulación hubo margen para reforzar controles preventivos de legajos y liquidación.'
      );
    }
    if (competencyScores.gestionDatos >= 65) {
      cvCoincidences.push(
        'El curso de Excel aplicado a la administración (2024) y manejo intermedio-avanzado de Office se reflejaron en un buen manejo de planillas y bases de datos.'
      );
    } else {
      gaps.push(
        'Declaró Office intermedio-avanzado y curso de Excel (2024), pero se detectaron desvíos en la depuración de bases de datos y control de planillas mensuales.'
      );
    }
    if (competencyScores.confidencialidadEtica >= 70) {
      cvCoincidences.push(
        'Validó en la práctica la competencia de confidencialidad y responsabilidad declarada en su CV frente a solicitudes sensibles de legajos.'
      );
    } else {
      gaps.push(
        'Reforzar el resguardo estricto de datos personales en legajos y reportes compartidos con otras áreas, clave para su formación en Tecnicatura en RR.HH.'
      );
    }
  } else if (matchedSample?.id === 'camila_rodriguez') {
    if (competencyScores.comunicacionServicio >= 65) {
      cvCoincidences.push(
        'Su trayectoria como Profesional de Apoyo a la Integración Escolar y Acompañante Terapéutica se reflejó en una muy buena comunicación y trabajo interdisciplinario con CET y SAIE.'
      );
    } else {
      gaps.push(
        'Aunque su perfil destaca empatía y trabajo interdisciplinario, en la simulación conviene estructurar aún más la comunicación operativa y los plazos con coordinadores.'
      );
    }
    if (competencyScores.gestionDatos < 70 || competencyScores.organizacionDetalle < 70) {
      gaps.push(
        'Se confirmó la brecha prevista en su CV (Office básico y sin experiencia previa en RR.HH.): será prioritario capacitarse en Excel, bases de datos y armado de legajos.'
      );
    } else {
      cvCoincidences.push(
        'Superó las expectativas iniciales en tareas administrativas y de datos pese a declarar Office básico y un recorrido previo puramente educativo-terapéutico.'
      );
    }
  } else if (session.mode === 'cv' && session.cvAnalysis) {
    if (
      session.cvAnalysis.requirementsFit?.officeExcel !== 'no_especificado' &&
      competencyScores.gestionDatos >= 65
    ) {
      cvCoincidences.push(
        'El manejo de herramientas informáticas declarado en el CV se reflejó positivamente en la gestión de planillas y bases de datos.'
      );
    }
    if (
      session.cvAnalysis.requirementsFit?.adminExperience !== 'ninguna' &&
      competencyScores.organizacionDetalle >= 65
    ) {
      cvCoincidences.push(
        'La experiencia administrativa previa se validó en el criterio para controlar legajos y documentación mensual.'
      );
    }
  } else {
    cvCoincidences.push(
      `Desempeño destacado en ${COMPETENCY_LABELS[topComp[0]]} (${topComp[1]}/100) a lo largo de la simulación estándar.`
    );
    cvCoincidences.push(
      `Se eligió la alternativa óptima en ${optimalCount} de ${totalCount} escenarios laborales del Departamento de RR.HH.`
    );
  }

  if (cvCoincidences.length === 0) {
    cvCoincidences.push(
      `Desempeño destacado en ${COMPETENCY_LABELS[topComp[0]]} (${topComp[1]}/100) durante los escenarios prácticos de IZET S.A.`
    );
  }

  if (gaps.length === 0) {
    gaps.push(
      `Oportunidad de mejora principal en ${COMPETENCY_LABELS[lowComp[0]]} (${lowComp[1]}/100), clave para la operatoria diaria entre RR.HH., CET y SAIE.`
    );
  }
  if (optimalCount < totalCount) {
    gaps.push(
      `En ${totalCount - optimalCount} escenario(s) hubo margen para aplicar controles más rigurosos o una comunicación más estructurada con coordinadores y profesionales.`
    );
  }

  const recommendations = [
    'Mantener checklists de control documental antes del cierre mensual de planillas de actividades y liquidación de honorarios.',
    'Reforzar el resguardo de datos personales y documentación de legajos bajo criterios estrictos de confidencialidad.',
    'Sostener comunicación proactiva y clara con la Responsable de RR.HH. y las coordinaciones de CET y SAIE ante cualquier desvío o consulta.',
  ];

  return {
    usedAi: false,
    aiProvider: null,
    performanceLevel,
    executiveSummary: `${session.candidateName} completó la simulación del puesto de Auxiliar Administrativo/a de RR.HH. en IZET S.A. con un puntaje global de ${finalScore}/100 (${optimalCount}/${totalCount} decisiones óptimas). Su punto más fuerte fue ${COMPETENCY_LABELS[topComp[0]]} y el área prioritaria a seguir fortaleciendo es ${COMPETENCY_LABELS[lowComp[0]]}.`,
    cvCoincidences,
    gaps,
    recommendations,
    closingNote:
      'Este reporte es orientativo y refleja el desempeño simulado frente a situaciones cotidianas del Departamento de Recursos Humanos de IZET S.A.',
  };
}

export async function analyzeCV(cvText, { pdfBuffer = null } = {}) {
  const cleanText = String(cvText || '').trim().slice(0, 12000);
  const hasText = cleanText.length >= 25;

  if (!hasText && !pdfBuffer) {
    return heuristicCvAnalysis('', 'Texto de CV vacío.');
  }

  const prompt = `
Actuá como especialista senior de selección de Recursos Humanos de IZET S.A.
Analizá el siguiente CV en función ESTRICTA del perfil del puesto provisto. No inventes requisitos ni beneficios que no estén en el perfil.

PERFIL DEL PUESTO:
${JOB_PROFILE_CONTEXT}

${
  hasText
    ? `CV DEL POSTULANTE:\n"""\n${cleanText}\n"""`
    : 'El CV del postulante se adjunta como documento PDF. Extraé toda su información directamente del archivo.'
}

Devolvé ÚNICAMENTE un objeto JSON válido con esta estructura exacta:
{
  "candidate": {
    "fullName": "Nombre y apellido detectados",
    "currentRoleOrStudies": "Rol actual o estudios principales",
    "summary": "Resumen ejecutivo de 2 oraciones sobre el encaje con IZET S.A."
  },
  "requirementsFit": {
    "secondaryComplete": "si | no | no_especificado",
    "relatedStudies": "si | en_curso | no | no_especificado",
    "adminExperience": "alta | media | basica | ninguna",
    "officeExcel": "avanzado | intermedio | basico | no_especificado",
    "overallFitLevel": "alto | medio | en_desarrollo",
    "fitScore": 0
  },
  "strengths": ["2 a 4 fortalezas concretas detectadas en el CV"],
  "challengeAreas": ["2 a 3 áreas a desafiar durante la simulación práctica"],
  "focusCompetencies": ["1 o 2 claves exactas entre: organizacionDetalle, gestionDatos, confidencialidadEtica, comunicacionServicio"]
}
`;

  try {
    const { data, provider } = await runProviderCascade({
      prompt,
      responseSchema: cvAnalysisResponseSchema,
      temperature: 0.2,
      pdfBuffer,
      hasText,
    });
    return normalizeCvAnalysis(data, provider);
  } catch (error) {
    console.warn('[AIService] Todos los proveedores de IA fallaron en analyzeCV:', error.message);
    return heuristicCvAnalysis(
      cleanText,
      'Servicios de IA temporalmente no disponibles; se utilizó análisis institucional de respaldo.'
    );
  }
}

export async function generateFinalReport({ session, competencyScores, finalScore }) {
  const answersSummary = session.answers.map((a, idx) => ({
    ronda: idx + 1,
    escenario: a.scenarioTitle,
    competenciaPrincipal: COMPETENCY_LABELS[a.primaryCompetency] || a.primaryCompetency,
    decisionOptima: a.isOptimal,
    eleccion: a.selectedOptionText,
  }));

  const cvBlock =
    session.mode === 'cv' && session.cvAnalysis
      ? JSON.stringify(
          {
            perfilDetectado: session.cvAnalysis.candidate,
            encajeRequisitos: session.cvAnalysis.requirementsFit,
            fortalezasCV: session.cvAnalysis.strengths,
            areasADesafiarCV: session.cvAnalysis.challengeAreas,
          },
          null,
          2
        )
      : 'El usuario jugó en modo estándar (sin cargar CV).';

  const prompt = `
Actuá como Tech Lead de Evaluación de Talento y Responsable de Selección de IZET S.A.
Redactá un dictamen ejecutivo personalizado, constructivo y riguroso para el postulante que finalizó la simulación de Auxiliar Administrativo/a de Recursos Humanos.

PERFIL DEL PUESTO:
${JOB_PROFILE_CONTEXT}

DATOS DEL CV:
${cvBlock}

RESULTADOS EN LA SIMULACIÓN:
- Puntaje global: ${finalScore}/100
- Puntajes por competencia (0 a 100):
  * Organización y Detalle: ${competencyScores.organizacionDetalle}
  * Gestión Administrativa y Datos: ${competencyScores.gestionDatos}
  * Confidencialidad y Ética: ${competencyScores.confidencialidadEtica}
  * Comunicación y Servicio: ${competencyScores.comunicacionServicio}
- Decisiones tomadas:
${JSON.stringify(answersSummary, null, 2)}

Reglas estrictas:
- No inventes políticas, beneficios ni requisitos ajenos al perfil de IZET S.A.
- No incluyas llamados a enviar CV ni a postularse por correo.
- Si hubo CV, cruzá explícitamente lo declarado en el CV con el desempeño real en los escenarios (coincidencias confirmadas y brechas).
- Si fue modo estándar, detallá hallazgos clave del desempeño en cvCoincidences y oportunidades en gaps.

Devolvé ÚNICAMENTE un objeto JSON válido con esta estructura exacta:
{
  "performanceLevel": "Etiqueta breve del nivel alcanzado",
  "executiveSummary": "Resumen ejecutivo de 3 a 4 oraciones",
  "cvCoincidences": ["2 a 3 puntos concretos"],
  "gaps": ["2 a 3 brechas u oportunidades concretas"],
  "recommendations": ["3 recomendaciones prácticas aplicables al día a día en RR.HH. de IZET S.A."],
  "closingNote": "Breve nota de cierre orientativa"
}
`;

  try {
    const { data, provider } = await runProviderCascade({
      prompt,
      responseSchema: finalReportResponseSchema,
      temperature: 0.35,
      hasText: true,
    });
    return normalizeFinalReport(data, provider);
  } catch (error) {
    console.warn(
      '[AIService] Todos los proveedores de IA fallaron en generateFinalReport:',
      error.message
    );
    return deterministicFinalReport(session, competencyScores, finalScore);
  }
}
