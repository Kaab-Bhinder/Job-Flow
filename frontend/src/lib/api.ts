const BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function getToken() {
  return localStorage.getItem('jobflow_token');
}
function setToken(t: string) {
  localStorage.setItem('jobflow_token', t);
}
function clearToken() {
  localStorage.removeItem('jobflow_token');
}

async function request(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as Record<string, string> || {}) };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(BASE + path, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

export const api = {
  get: (p: string) => request(p, { method: 'GET' }),
  post: (p: string, body?: any) => request(p, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: (p: string, body?: any) => request(p, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  del: (p: string) => request(p, { method: 'DELETE' }),
  setToken,
  getToken,
  clearToken,
};
