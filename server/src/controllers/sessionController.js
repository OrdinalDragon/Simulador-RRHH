import crypto from 'crypto';
import { createRequire } from 'module';
import { isDbConnected } from '../config/db.js';
import { Scenario } from '../models/Scenario.js';
import { Session } from '../models/Session.js';
import { SCENARIOS_DATA } from '../data/scenariosData.js';
import {
  analyzeCV,
  extractPdfTextWithOcr,
  generateCustomScenarios,
  generateFinalReport,
} from '../services/geminiService.js';
import { seedScenarios } from '../seed.js';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse/lib/pdf-parse.js');

const clamp = (val, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(val)));

// Respaldo en memoria solo cuando MongoDB no está disponible localmente
const memoryScenarios = SCENARIOS_DATA.map((item) => ({
  ...item,
  _id: item.code,
}));
const memorySessions = new Map();

async function getAllScenarios() {
  if (!isDbConnected()) {
    return memoryScenarios;
  }
  let scenarios = await Scenario.find().sort({ order: 1 });
  if (scenarios.length === 0) {
    await seedScenarios();
    scenarios = await Scenario.find().sort({ order: 1 });
  }
  return scenarios;
}

async function createSessionRecord(payload) {
  if (!isDbConnected()) {
    const _id = `mem_${crypto.randomUUID()}`;
    const doc = { _id, ...payload, createdAt: new Date(), updatedAt: new Date() };
    memorySessions.set(_id, doc);
    return doc;
  }
  return Session.create(payload);
}

async function findSessionById(id) {
  if (!isDbConnected()) {
    return memorySessions.get(String(id)) || null;
  }
  return Session.findById(id);
}

async function saveSessionRecord(session) {
  if (!isDbConnected()) {
    session.updatedAt = new Date();
    memorySessions.set(String(session._id), session);
    return session;
  }
  return session.save();
}

function getCompetenciesPlain(session) {
  return typeof session.competencies?.toObject === 'function'
    ? session.competencies.toObject()
    : { ...session.competencies };
}

/**
 * Mezcla aleatoriamente las opciones A/B/C evitando repetir la misma letra óptima
 * en escenarios consecutivos para que la posición correcta nunca sea predecible.
 */
function shuffleScenarioOptions(rawOptions, prevOptimalLetter = null) {
  const letters = ['A', 'B', 'C', 'D'];
  const items = rawOptions.map((opt) => ({
    text: opt.text,
    feedback: opt.feedback,
    isOptimal: Boolean(opt.isOptimal),
    scoreDelta: opt.scoreDelta ?? (opt.isOptimal ? 10 : -3),
    impact: {
      organizacionDetalle: opt.impact?.organizacionDetalle ?? 0,
      gestionDatos: opt.impact?.gestionDatos ?? 0,
      confidencialidadEtica: opt.impact?.confidencialidadEtica ?? 0,
      comunicacionServicio: opt.impact?.comunicacionServicio ?? 0,
    },
  }));

  let bestShuffle = items;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = crypto.randomInt(0, i + 1);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    const optIdx = copy.findIndex((o) => o.isOptimal);
    const optLetter = letters[optIdx];
    bestShuffle = copy;
    if (!prevOptimalLetter || optLetter !== prevOptimalLetter) {
      break;
    }
  }

  const labeled = bestShuffle.map((opt, idx) => ({
    ...opt,
    id: letters[idx],
  }));

  const optimalLetter = labeled.find((o) => o.isOptimal)?.id || null;
  return { options: labeled, optimalLetter };
}

function toEmbeddedScenario(rawDoc, prevOptimalLetter) {
  const { options, optimalLetter } = shuffleScenarioOptions(rawDoc.options || [], prevOptimalLetter);
  return {
    scenario: {
      scenarioKey: String(rawDoc.scenarioKey || rawDoc._id || rawDoc.code),
      code: rawDoc.code,
      title: rawDoc.title,
      area: rawDoc.area,
      primaryCompetency: rawDoc.primaryCompetency,
      isAiGenerated: Boolean(rawDoc.isAiGenerated),
      aiProvider: rawDoc.aiProvider || null,
      context: rawDoc.context,
      question: rawDoc.question,
      options,
    },
    optimalLetter,
  };
}

function sanitizeScenarioForClient(scenarioObj, focusCompetencies = []) {
  if (!scenarioObj) return null;
  return {
    id: scenarioObj.scenarioKey || String(scenarioObj._id),
    code: scenarioObj.code,
    title: scenarioObj.title,
    area: scenarioObj.area,
    primaryCompetency: scenarioObj.primaryCompetency,
    isAiGenerated: Boolean(scenarioObj.isAiGenerated),
    aiProvider: scenarioObj.aiProvider || null,
    isFocusChallenge: focusCompetencies.includes(scenarioObj.primaryCompetency),
    context: scenarioObj.context,
    question: scenarioObj.question,
    options: (scenarioObj.options || []).map((opt) => ({
      id: opt.id,
      text: opt.text,
    })),
  };
}

export async function startSession(req, res) {
  try {
    const requestedMode = req.body?.mode === 'cv' ? 'cv' : 'standard';
    const rawCandidateName = (req.body?.candidateName || '').trim();
    let cvText = (req.body?.cvText || '').trim();
    let cvSource = 'none';
    let pdfBuffer = null;

    if (req.file) {
      pdfBuffer = req.file.buffer;
      cvSource = 'pdf';
      try {
        const parsedPdf = await pdfParse(req.file.buffer);
        const rawPdfText = (parsedPdf?.text || '').trim();
        const meaningfulText = rawPdfText.replace(/camscanner/gi, '').trim();
        if (meaningfulText.length >= 40) {
          cvText = rawPdfText;
        } else {
          console.log(
            '[PDF] PDF escaneado detectado (sin texto seleccionable). Intentando Mistral OCR...'
          );
          const ocrText = await extractPdfTextWithOcr(req.file.buffer);
          if (ocrText.length >= 40) {
            cvText = ocrText;
          }
        }
      } catch (pdfError) {
        console.warn('[PDF] Error en pdf-parse, intentando Mistral OCR / IA multimodal:', pdfError.message);
        const ocrText = await extractPdfTextWithOcr(req.file.buffer);
        if (ocrText.length >= 40) {
          cvText = ocrText;
        }
      }
    } else if (cvText) {
      cvSource = 'text';
    }

    const effectiveMode =
      requestedMode === 'cv' && (cvText.length >= 20 || Boolean(pdfBuffer)) ? 'cv' : 'standard';
    const baseScenarios = await getAllScenarios();

    let cvAnalysis = null;
    let candidateName = rawCandidateName || 'Postulante';
    let customAiScenarios = [];

    if (effectiveMode === 'cv') {
      cvAnalysis = await analyzeCV(cvText, { pdfBuffer });
      if (!cvText && !cvAnalysis.usedAi) {
        return res.status(400).json({
          error:
            'El PDF cargado parece estar escaneado como imagen y los servicios de OCR/IA no estuvieron disponibles en este momento. Probá con un PDF con texto seleccionable, pegá el texto o elegí uno de los CVs de muestra.',
        });
      }
      if (!rawCandidateName && cvAnalysis?.candidate?.fullName) {
        candidateName = cvAnalysis.candidate.fullName;
      }

      // Modelo híbrido: genera hasta 2 escenarios dinámicos con IA basados en el CV
      customAiScenarios = await generateCustomScenarios({ cvText, cvAnalysis });
    }

    const focusCompetencies = cvAnalysis?.focusCompetencies || [];

    const orderedBase =
      focusCompetencies.length > 0
        ? [
            ...baseScenarios.filter((s) => focusCompetencies.includes(s.primaryCompetency)),
            ...baseScenarios.filter((s) => !focusCompetencies.includes(s.primaryCompetency)),
          ]
        : baseScenarios;

    // Combinamos 8 escenarios base + 2 generados por IA (si existen), intercalando los de IA en rondas 3 y 7
    const targetTotal = 10;
    const baseCountNeeded = Math.max(0, targetTotal - customAiScenarios.length);
    const combinedRaw = [...orderedBase.slice(0, baseCountNeeded)];

    if (customAiScenarios[0]) {
      combinedRaw.splice(Math.min(2, combinedRaw.length), 0, customAiScenarios[0]);
    }
    if (customAiScenarios[1]) {
      combinedRaw.splice(Math.min(6, combinedRaw.length), 0, customAiScenarios[1]);
    }

    // Mezclamos opciones A/B/C en cada escenario evitando patrones repetitivos
    let prevOptimalLetter = null;
    const sessionScenarios = combinedRaw.map((raw) => {
      const { scenario, optimalLetter } = toEmbeddedScenario(raw, prevOptimalLetter);
      prevOptimalLetter = optimalLetter;
      return scenario;
    });

    const session = await createSessionRecord({
      mode: effectiveMode,
      status: 'in_progress',
      candidateName,
      cvSource: effectiveMode === 'cv' ? cvSource : 'none',
      cvRawText: effectiveMode === 'cv' ? cvText.slice(0, 12000) : '',
      cvAnalysis,
      scenarioIds: [],
      sessionScenarios,
      currentIndex: 0,
      competencies: {
        organizacionDetalle: 50,
        gestionDatos: 50,
        confidencialidadEtica: 50,
        comunicacionServicio: 50,
      },
      answers: [],
      finalScore: null,
      finalReport: null,
    });

    return res.status(201).json({
      sessionId: session._id,
      mode: session.mode,
      candidateName: session.candidateName,
      cvAnalysis: session.cvAnalysis,
      totalScenarios: sessionScenarios.length,
      aiScenariosCount: customAiScenarios.length,
      currentIndex: 0,
      competencies: getCompetenciesPlain(session),
      currentScenario: sanitizeScenarioForClient(sessionScenarios[0], focusCompetencies),
    });
  } catch (error) {
    console.error('[startSession] Error:', error);
    return res.status(500).json({
      error: 'Ocurrió un error al iniciar la simulación. Intentá nuevamente.',
    });
  }
}

export async function submitAnswer(req, res) {
  try {
    const { sessionId, scenarioId, optionId } = req.body || {};

    if (!sessionId || !scenarioId || !optionId) {
      return res.status(400).json({
        error: 'Faltan datos obligatorios (sessionId, scenarioId, optionId).',
      });
    }

    const session = await findSessionById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Sesión no encontrada.' });
    }
    if (session.status === 'completed') {
      return res.status(400).json({ error: 'La simulación ya fue finalizada.' });
    }

    const scenario = session.sessionScenarios?.[session.currentIndex];
    if (!scenario || String(scenario.scenarioKey) !== String(scenarioId)) {
      return res.status(409).json({
        error: 'El escenario enviado no corresponde a la ronda actual de la sesión.',
      });
    }

    const chosenOption = scenario.options.find((opt) => opt.id === optionId);
    if (!chosenOption) {
      return res.status(400).json({ error: 'Opción seleccionada inválida.' });
    }

    const impact = {
      organizacionDetalle: chosenOption.impact?.organizacionDetalle ?? 0,
      gestionDatos: chosenOption.impact?.gestionDatos ?? 0,
      confidencialidadEtica: chosenOption.impact?.confidencialidadEtica ?? 0,
      comunicacionServicio: chosenOption.impact?.comunicacionServicio ?? 0,
    };

    const currentComp = getCompetenciesPlain(session);
    session.competencies = {
      organizacionDetalle: clamp(currentComp.organizacionDetalle + impact.organizacionDetalle),
      gestionDatos: clamp(currentComp.gestionDatos + impact.gestionDatos),
      confidencialidadEtica: clamp(
        currentComp.confidencialidadEtica + impact.confidencialidadEtica
      ),
      comunicacionServicio: clamp(currentComp.comunicacionServicio + impact.comunicacionServicio),
    };

    session.answers.push({
      scenarioId: scenario.scenarioKey,
      scenarioCode: scenario.code,
      scenarioTitle: scenario.title,
      primaryCompetency: scenario.primaryCompetency,
      selectedOptionId: chosenOption.id,
      selectedOptionText: chosenOption.text,
      isOptimal: chosenOption.isOptimal,
      scoreDelta: chosenOption.scoreDelta,
      feedback: chosenOption.feedback,
      impact,
      answeredAt: new Date(),
    });

    session.currentIndex += 1;
    await saveSessionRecord(session);

    const totalScenarios = session.sessionScenarios.length;
    const isFinished = session.currentIndex >= totalScenarios;
    const nextScenario = isFinished
      ? null
      : sanitizeScenarioForClient(
          session.sessionScenarios[session.currentIndex],
          session.cvAnalysis?.focusCompetencies || []
        );

    return res.json({
      feedback: chosenOption.feedback,
      isOptimal: chosenOption.isOptimal,
      impact,
      competencies: getCompetenciesPlain(session),
      answeredCount: session.answers.length,
      totalScenarios,
      isFinished,
      nextScenario,
    });
  } catch (error) {
    console.error('[submitAnswer] Error:', error);
    return res.status(500).json({
      error: 'No pudimos registrar tu respuesta. Intentá nuevamente.',
    });
  }
}

export async function finishSession(req, res) {
  try {
    const { sessionId } = req.body || {};
    if (!sessionId) {
      return res.status(400).json({ error: 'Se requiere sessionId.' });
    }

    const session = await findSessionById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Sesión no encontrada.' });
    }

    if (session.status === 'completed' && session.finalReport) {
      return res.json(buildFinishPayload(session));
    }

    const compObj = getCompetenciesPlain(session);
    const compValues = Object.values(compObj);
    const avgCompetency = compValues.reduce((acc, v) => acc + v, 0) / compValues.length;
    const totalAnswered = Math.max(1, session.answers.length);
    const optimalRatio =
      (session.answers.filter((a) => a.isOptimal).length / totalAnswered) * 100;

    const finalScore = clamp(avgCompetency * 0.65 + optimalRatio * 0.35);

    const report = await generateFinalReport({
      session,
      competencyScores: compObj,
      finalScore,
    });

    session.finalScore = finalScore;
    session.finalReport = report;
    session.status = 'completed';
    await saveSessionRecord(session);

    return res.json(buildFinishPayload(session));
  } catch (error) {
    console.error('[finishSession] Error:', error);
    return res.status(500).json({
      error: 'No se pudo generar el reporte final. Intentá nuevamente.',
    });
  }
}

export async function getSession(req, res) {
  try {
    const session = await findSessionById(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Sesión no encontrada.' });
    }

    if (session.status === 'completed') {
      return res.json(buildFinishPayload(session));
    }

    const currentScenarioObj = session.sessionScenarios?.[session.currentIndex];
    return res.json({
      sessionId: session._id,
      mode: session.mode,
      status: session.status,
      candidateName: session.candidateName,
      cvAnalysis: session.cvAnalysis,
      totalScenarios: session.sessionScenarios?.length || 10,
      currentIndex: session.currentIndex,
      competencies: getCompetenciesPlain(session),
      currentScenario: sanitizeScenarioForClient(
        currentScenarioObj,
        session.cvAnalysis?.focusCompetencies || []
      ),
    });
  } catch (error) {
    console.error('[getSession] Error:', error);
    return res.status(500).json({ error: 'Error al consultar la sesión.' });
  }
}

function buildFinishPayload(session) {
  const optimalCount = session.answers.filter((a) => a.isOptimal).length;
  const totalScenarios = session.sessionScenarios?.length || session.scenarioIds?.length || 10;
  return {
    sessionId: session._id,
    mode: session.mode,
    status: session.status,
    candidateName: session.candidateName,
    cvAnalysis: session.cvAnalysis,
    finalScore: session.finalScore,
    competencies: getCompetenciesPlain(session),
    stats: {
      totalScenarios,
      answeredCount: session.answers.length,
      optimalCount,
    },
    answers: session.answers.map((a) => ({
      scenarioCode: a.scenarioCode,
      scenarioTitle: a.scenarioTitle,
      primaryCompetency: a.primaryCompetency,
      selectedOptionId: a.selectedOptionId,
      isOptimal: a.isOptimal,
      feedback: a.feedback,
    })),
    finalReport: session.finalReport,
  };
}
