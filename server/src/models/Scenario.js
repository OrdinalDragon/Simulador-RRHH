import mongoose from 'mongoose';

export const COMPETENCY_KEYS = [
  'organizacionDetalle',
  'gestionDatos',
  'confidencialidadEtica',
  'comunicacionServicio',
];

const optionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      enum: ['A', 'B', 'C', 'D'],
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    feedback: {
      type: String,
      required: true,
      trim: true,
    },
    isOptimal: {
      type: Boolean,
      default: false,
    },
    scoreDelta: {
      type: Number,
      required: true,
    },
    impact: {
      organizacionDetalle: { type: Number, default: 0 },
      gestionDatos: { type: Number, default: 0 },
      confidencialidadEtica: { type: Number, default: 0 },
      comunicacionServicio: { type: Number, default: 0 },
    },
  },
  { _id: false }
);

const scenarioSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    area: {
      type: String,
      required: true,
      trim: true,
    },
    primaryCompetency: {
      type: String,
      required: true,
      enum: COMPETENCY_KEYS,
    },
    context: {
      type: String,
      required: true,
      trim: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [optionSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length >= 3 && arr.length <= 4,
        message: 'Cada escenario debe tener entre 3 y 4 opciones.',
      },
    },
  },
  { timestamps: true }
);

export const Scenario = mongoose.model('Scenario', scenarioSchema);
