const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

async function request<T>(
  path: string,
  options: { method?: Method; body?: unknown; credentials?: RequestCredentials } = {}
): Promise<T> {
  const { method = 'GET', body, credentials = 'include' } = options;
  const headers: Record<string, string> = {};
  if (body && method !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error ?? res.statusText ?? 'Request failed');
  }
  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
