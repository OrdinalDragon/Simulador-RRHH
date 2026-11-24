const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Error de comunicación con el servidor.');
  }
  return data;
}

export async function startSession({ mode, candidateName, cvText, cvFile }) {
  if (mode === 'cv' && cvFile) {
    const formData = new FormData();
    formData.append('mode', 'cv');
    if (candidateName) formData.append('candidateName', candidateName);
    formData.append('cvFile', cvFile);

    const response = await fetch(`${API_BASE}/session/start`, {
      method: 'POST',
      body: formData,
    });
    return parseResponse(response);
  }

  const response = await fetch(`${API_BASE}/session/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode,
      candidateName: candidateName || '',
      cvText: mode === 'cv' ? cvText || '' : '',
    }),
  });
  return parseResponse(response);
}

export async function submitAnswer({ sessionId, scenarioId, optionId }) {
  const response = await fetch(`${API_BASE}/session/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, scenarioId, optionId }),
  });
  return parseResponse(response);
}

export async function finishSession({ sessionId }) {
  const response = await fetch(`${API_BASE}/session/finish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  });
  return parseResponse(response);
}
