import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { Scenario } from './models/Scenario.js';
import { SCENARIOS_DATA } from './data/scenariosData.js';

export async function seedScenarios({ closeConnection = false } = {}) {
  for (const item of SCENARIOS_DATA) {
    await Scenario.findOneAndUpdate(
      { code: item.code },
      { $set: item },
      { upsert: true, new: true, runValidators: true }
    );
  }
  console.log(`[Seed] ${SCENARIOS_DATA.length} escenarios de IZET S.A. sincronizados correctamente.`);
  if (closeConnection) {
    await mongoose.disconnect();
  }
}

const isDirectRun = process.argv[1]?.endsWith('seed.js');
if (isDirectRun) {
  connectDB({ required: true })
    .then(() => seedScenarios({ closeConnection: true }))
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Seed] Error:', err);
      process.exit(1);
    });
}
