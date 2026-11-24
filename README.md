# IZET S.A. — Simulador Interactivo de Selección (Auxiliar Administrativo/a de RR.HH.)

Aplicación web gamificada en **MERN (MongoDB, Express.js, React + Vite + Tailwind CSS, Node.js)** con integración de **Gemini Flash (`@google/genai`)** para lectura de CV (PDF o texto) y generación de dictamen ejecutivo personalizado.

## Estructura del proyecto

```text
Yaniproyecto/
├── server/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── index.js
│       ├── seed.js
│       ├── config/db.js
│       ├── data/scenariosData.js
│       ├── models/
│       │   ├── Scenario.js
│       │   └── Session.js
│       ├── services/geminiService.js
│       ├── controllers/sessionController.js
│       └── routes/sessionRoutes.js
└── client/
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── postcss.config.js
    ├── tailwind.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── services/api.js
        └── components/
            ├── Header.jsx
            ├── LandingCV.jsx
            ├── CompetencyBars.jsx
            ├── GameBoard.jsx
            └── ResultReport.jsx
```

## Puesta en marcha local

### 1. Configurar Backend (`server/`)
```bash
cd server
npm install
cp .env.example .env
```
Completá `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/izet_rrhh_simulator
GEMINI_API_KEY=tu_api_key_de_gemini
GEMINI_MODEL=gemini-2.5-flash
CLIENT_ORIGIN=http://localhost:5173
```
*(Si `GEMINI_API_KEY` no está configurada o la API falla, el sistema activa automáticamente el modo resiliente sin bloquear la simulación.)*

Cargar los 10 escenarios de IZET S.A. en MongoDB e iniciar el servidor:
```bash
npm run seed
npm run dev
```

### 2. Configurar Frontend (`client/`)
```bash
cd client
npm install
npm run dev
```
Abrí `http://localhost:5173` en tu navegador.

## Endpoints REST principales
- `GET /api/health` — Estado del servidor y configuración de Gemini.
- `POST /api/session/start` — Inicia una partida en modo `cv` (PDF multipart o texto) o `standard`.
- `POST /api/session/answer` — Evalúa una decisión, actualiza competencias en vivo y devuelve feedback inmediato.
- `POST /api/session/finish` — Calcula el puntaje global y genera el dictamen ejecutivo personalizado.
- `GET /api/session/:id` — Recupera el estado o reporte de una sesión.
