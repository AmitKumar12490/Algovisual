const BASE = import.meta.env.VITE_API_URL || '/api';

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  run:          body => request('POST', '/run', body),
  compare:      body => request('POST', '/compare', body),
  history:      (params = '') => request('GET', `/history/runs${params}`),
  runById:      id => request('GET', `/history/runs/${id}`),
  deleteRun:    id => request('DELETE', `/history/runs/${id}`),
  comparisons:  () => request('GET', '/history/comparisons'),
  algorithms:   () => request('GET', '/algorithms'),
  health:       () => request('GET', '/health'),
};
