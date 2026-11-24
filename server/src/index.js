import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB, isDbConnected } from './config/db.js';
import { getConfiguredProviders } from './services/geminiService.js';
import { seedScenarios } from './seed.js';
import sessionRoutes from './routes/sessionRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
const ALLOWED_ORIGINS = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim().replace(/\/+$/, ''))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/+$/, '');
      if (ALLOWED_ORIGINS.includes(cleanOrigin) || ALLOWED_ORIGINS.includes('*')) {
        return callback(null, true);
      }
      return callback(new Error(`Origen no permitido por CORS: ${origin}`));
    },
    credentials: false,
  })
);
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  const aiProviders = getConfiguredProviders();
  res.json({
    status: 'ok',
    service: 'IZET S.A. - Simulador Auxiliar Administrativo/a de RR.HH.',
    storage: isDbConnected() ? 'mongodb' : 'memory-fallback',
    aiProviders,
    geminiConfigured: aiProviders.gemini,
  });
});

app.use('/api/session', sessionRoutes);

app.use((err, _req, res, _next) => {
  console.error('[Server] Error no controlado:', err);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

async function bootstrap() {
  const connected = await connectDB();
  if (connected) {
    await seedScenarios();
  }
  app.listen(PORT, () => {
    console.log(`[Server] API IZET RR.HH. escuchando en http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('[Server] No se pudo iniciar el servidor:', err.message);
  process.exit(1);
});
