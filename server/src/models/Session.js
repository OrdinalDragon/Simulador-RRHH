import mongoose from 'mongoose';
import { COMPETENCY_KEYS } from './Scenario.js';

const answerSchema = new mongoose.Schema(
  {
    scenarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scenario',
      required: true,
    },
    scenarioCode: { type: String, required: true },
    scenarioTitle: { type: String, required: true },
    primaryCompetency: {
      type: String,
      enum: COMPETENCY_KEYS,
      required: true,
    },
    selectedOptionId: { type: String, required: true },
    selectedOptionText: { type: String, required: true },
    isOptimal: { type: Boolean, default: false },
    scoreDelta: { type: Number, required: true },
    feedback: { type: String, required: true },
    impact: {
      organizacionDetalle: { type: Number, default: 0 },
      gestionDatos: { type: Number, default: 0 },
      confidencialidadEtica: { type: Number, default: 0 },
      comunicacionServicio: { type: Number, default: 0 },
    },
    answeredAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const cvAnalysisSchema = new mongoose.Schema(
  {
    usedAi: { type: Boolean, default: false },
    aiProvider: { type: String, default: null },
    fallbackReason: { type: String, default: null },
    candidate: {
      fullName: { type: String, default: 'Postulante' },
      currentRoleOrStudies: { type: String, default: 'No especificado' },
      summary: { type: String, default: '' },
    },
    requirementsFit: {
      secondaryComplete: {
        type: String,
        enum: ['si', 'no', 'no_especificado'],
        default: 'no_especificado',
      },
      relatedStudies: {
        type: String,
        enum: ['si', 'en_curso', 'no', 'no_especificado'],
        default: 'no_especificado',
      },
      adminExperience: {
        type: String,
        enum: ['alta', 'media', 'basica', 'ninguna'],
        default: 'basica',
      },
      officeExcel: {
        type: String,
        enum: ['avanzado', 'intermedio', 'basico', 'no_especificado'],
        default: 'no_especificado',
      },
      overallFitLevel: {
        type: String,
        enum: ['alto', 'medio', 'en_desarrollo'],
        default: 'medio',
      },
      fitScore: { type: Number, min: 0, max: 100, default: 50 },
    },
    strengths: { type: [String], default: [] },
    challengeAreas: { type: [String], default: [] },
    focusCompetencies: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const finalReportSchema = new mongoose.Schema(
  {
    usedAi: { type: Boolean, default: false },
    aiProvider: { type: String, default: null },
    performanceLevel: { type: String, default: '' },
    executiveSummary: { type: String, default: '' },
    cvCoincidences: { type: [String], default: [] },
    gaps: { type: [String], default: [] },
    recommendations: { type: [String], default: [] },
    closingNote: { type: String, default: '' },
  },
  { _id: false }
);

const sessionSchema = new mongoose.Schema(
  {
    mode: {
      type: String,
      enum: ['cv', 'standard'],
      required: true,
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed'],
      default: 'in_progress',
    },
    candidateName: {
      type: String,
      default: 'Postulante',
      trim: true,
    },
    cvSource: {
      type: String,
      enum: ['pdf', 'text', 'none'],
      default: 'none',
    },
    cvRawText: {
      type: String,
      default: '',
    },
    cvAnalysis: {
      type: cvAnalysisSchema,
      default: null,
    },
    scenarioIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scenario',
      },
    ],
    currentIndex: {
      type: Number,
      default: 0,
    },
    competencies: {
      organizacionDetalle: { type: Number, default: 50, min: 0, max: 100 },
      gestionDatos: { type: Number, default: 50, min: 0, max: 100 },
      confidencialidadEtica: { type: Number, default: 50, min: 0, max: 100 },
      comunicacionServicio: { type: Number, default: 50, min: 0, max: 100 },
    },
    answers: {
      type: [answerSchema],
      default: [],
    },
    finalScore: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },
    finalReport: {
      type: finalReportSchema,
      default: null,
    },
  },
  { timestamps: true }
);

export const Session = mongoose.model('Session', sessionSchema);
