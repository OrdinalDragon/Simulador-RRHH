import { GoogleGenAI, Type } from '@google/genai';

const DEFAULT_MODEL = 'gemini-3.8-flash';
const MODEL_NAME = process.env.GEMINI_MODEL || DEFAULT_MODEL;

async function generateJsonWithFallback(ai, { contents, responseSchema, temperature }) {
  const modelsToTry =
    MODEL_NAME === DEFAULT_MODEL ? [MODEL_NAME] : [MODEL_NAME, DEFAULT_MODEL];

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
      return JSON.parse(response.text);
    } catch (error) {
      lastError = error;
      const isModelNotFound =
        error?.status === 404 || String(error?.message || '').includes('NOT_FOUND');
      if (!isModelNotFound) {
        throw error;
      }
      console.warn(`[GeminiService] Modelo ${model} no disponible, intentando fallback...`);
    }
  }
  throw lastError;
}

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

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'tu_api_key_de_gemini_aqui') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
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
        secondaryComplete: {
          type: Type.STRING,
          enum: ['si', 'no', 'no_especificado'],
        },
        relatedStudies: {
          type: Type.STRING,
          enum: ['si', 'en_curso', 'no', 'no_especificado'],
        },
        adminExperience: {
          type: Type.STRING,
          enum: ['alta', 'media', 'basica', 'ninguna'],
        },
        officeExcel: {
          type: Type.STRING,
          enum: ['avanzado', 'intermedio', 'basico', 'no_especificado'],
        },
        overallFitLevel: {
          type: Type.STRING,
          enum: ['alto', 'medio', 'en_desarrollo'],
        },
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
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    challengeAreas: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    focusCompetencies: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
        enum: [
          'organizacionDetalle',
          'gestionDatos',
          'confidencialidadEtica',
          'comunicacionServicio',
        ],
      },
    },
  },
  required: [
    'candidate',
    'requirementsFit',
    'strengths',
    'challengeAreas',
    'focusCompetencies',
  ],
};

const finalReportResponseSchema = {
  type: Type.OBJECT,
  properties: {
    performanceLevel: { type: Type.STRING },
    executiveSummary: { type: Type.STRING },
    cvCoincidences: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    gaps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    recommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
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

function heuristicCvAnalysis(cvText, fallbackReason) {
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
  if (session.mode === 'cv' && session.cvAnalysis) {
    if (session.cvAnalysis.requirementsFit?.officeExcel !== 'no_especificado' && competencyScores.gestionDatos >= 65) {
      cvCoincidences.push(
        'El manejo de herramientas informáticas declarado en el CV se reflejó positivamente en la gestión de planillas y bases de datos.'
      );
    }
    if (session.cvAnalysis.requirementsFit?.adminExperience !== 'ninguna' && competencyScores.organizacionDetalle >= 65) {
      cvCoincidences.push(
        'La experiencia administrativa previa se validó en el criterio para controlar legajos y documentación mensual.'
      );
    }
    if (cvCoincidences.length === 0) {
      cvCoincidences.push(
        `Se confirmó solidez principal en ${COMPETENCY_LABELS[topComp[0]]} (${topComp[1]}/100) durante los casos prácticos de IZET S.A.`
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

  const gaps = [
    `Oportunidad de mejora principal en ${COMPETENCY_LABELS[lowComp[0]]} (${lowComp[1]}/100), clave para la operatoria diaria entre RR.HH., CET y SAIE.`,
  ];
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
    performanceLevel,
    executiveSummary: `${session.candidateName} completó la simulación del puesto de Auxiliar Administrativo/a de RR.HH. en IZET S.A. con un puntaje global de ${finalScore}/100 (${optimalCount}/${totalCount} decisiones óptimas). Su punto más fuerte fue ${COMPETENCY_LABELS[topComp[0]]} y el área prioritaria a seguir fortaleciendo es ${COMPETENCY_LABELS[lowComp[0]]}.`,
    cvCoincidences,
    gaps,
    recommendations,
    closingNote:
      'Este reporte es orientativo y busca acercarte a las situaciones reales del Departamento de Recursos Humanos de IZET S.A. Podés postularte formalmente enviando tu CV por el canal oficial con el asunto “Búsqueda laboral – Auxiliar Administrativo/a de RR. HH.”.',
  };
}

export async function analyzeCV(cvText) {
  const cleanText = String(cvText || '').trim().slice(0, 12000);
  if (!cleanText) {
    return heuristicCvAnalysis('', 'Texto de CV vacío.');
  }

  const ai = getClient();
  if (!ai) {
    return heuristicCvAnalysis(
      cleanText,
      'GEMINI_API_KEY no configurada; se utilizó análisis automático local.'
    );
  }

  const prompt = `
Actuá como especialista senior de selección de Recursos Humanos de IZET S.A.
Analizá el siguiente CV en función ESTRICTA del perfil del puesto provisto. No inventes requisitos ni beneficios que no estén en el perfil.

PERFIL DEL PUESTO:
${JOB_PROFILE_CONTEXT}

CV DEL POSTULANTE:
"""
${cleanText}
"""

Instrucciones:
- Respondé exclusivamente en español rioplatense profesional y claro.
- Evaluá de manera objetiva: secundario completo, estudios afines, experiencia administrativa y manejo de Office/Excel.
- Indicá 2 a 4 fortalezas concretas detectadas en el CV.
- Indicá 2 a 3 áreas a desafiar o validar durante la simulación práctica.
- En focusCompetencies devolvé 1 o 2 claves exactas de competencias prioritarias a poner a prueba.
- fitScore debe ser un entero entre 0 y 100 coherente con los requisitos del puesto.
`;

  try {
    const parsed = await generateJsonWithFallback(ai, {
      contents: prompt,
      responseSchema: cvAnalysisResponseSchema,
      temperature: 0.2,
    });
    return {
      usedAi: true,
      fallbackReason: null,
      ...parsed,
      requirementsFit: {
        ...parsed.requirementsFit,
        fitScore: Math.min(100, Math.max(0, Number(parsed.requirementsFit?.fitScore ?? 50))),
      },
    };
  } catch (error) {
    console.warn('[GeminiService] Falló analyzeCV, activando fallback:', error.message);
    return heuristicCvAnalysis(
      cleanText,
      'Servicio de IA temporalmente no disponible; se utilizó análisis local de respaldo.'
    );
  }
}

export async function generateFinalReport({ session, competencyScores, finalScore }) {
  const ai = getClient();
  if (!ai) {
    return deterministicFinalReport(session, competencyScores, finalScore);
  }

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
- Si hubo CV, cruzá explícitamente lo declarado en el CV con el desempeño real en los escenarios (coincidencias confirmadas y brechas).
- Si fue modo estándar, detallá hallazgos clave del desempeño en cvCoincidences y oportunidades en gaps.
- Incluí 3 recomendaciones prácticas y concretas aplicables al día a día en el Depto. de RR.HH. de IZET S.A.
- Tono: profesional, empático, institucional y directo (español rioplatense).
`;

  try {
    const parsed = await generateJsonWithFallback(ai, {
      contents: prompt,
      responseSchema: finalReportResponseSchema,
      temperature: 0.35,
    });
    return {
      usedAi: true,
      ...parsed,
    };
  } catch (error) {
    console.warn('[GeminiService] Falló generateFinalReport, activando fallback:', error.message);
    return deterministicFinalReport(session, competencyScores, finalScore);
  }
}
