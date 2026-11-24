import mongoose from 'mongoose';

let dbConnected = false;

export function isDbConnected() {
  return dbConnected && mongoose.connection.readyState === 1;
}

export async function connectDB({ required = false } = {}) {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/izet_rrhh_simulator';
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3500,
    });
    dbConnected = true;
    console.log(`[MongoDB] Conectado a ${mongoose.connection.name}`);
    return true;
  } catch (error) {
    dbConnected = false;
    if (required) {
      console.error('[MongoDB] Error de conexión:', error.message);
      throw error;
    }
    console.warn(
      `[MongoDB] No disponible (${error.message}). Iniciando en modo memoria temporal para pruebas locales.`
    );
    return false;
  }
}
