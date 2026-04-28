const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

function getToken(): string | null {
  return localStorage.getItem('cg_token');
}

export function setToken(token: string): void {
  localStorage.setItem('cg_token', token);
}

export function clearToken(): void {
  localStorage.removeItem('cg_token');
}

export function hasToken(): boolean {
  return !!localStorage.getItem('cg_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Error ${res.status}`);
  }

  // Handle 204 No Content
  if (res.status === 204) return {} as T;

  return res.json();
}

// ---- Auth ----

export interface AuthResponse {
  access_token: string;
  farmer: {
    id: string;
    name: string;
    email: string;
    farmName: string;
  };
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
  farmName: string;
  municipality: string;
  department: string;
  hectares: number;
  cooperative?: string;
}): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ---- Farmers ----

export async function getMe(): Promise<any> {
  return request('/farmers/me');
}

export async function updateMe(data: Record<string, any>): Promise<any> {
  return request('/farmers/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// ---- Traps ----

export async function getTraps(): Promise<any[]> {
  return request('/traps');
}

export async function getTrap(id: string): Promise<any> {
  return request(`/traps/${id}`);
}

export async function createTrap(data: { name: string; location: string }): Promise<any> {
  return request('/traps', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateTrap(id: string, data: Record<string, any>): Promise<any> {
  return request(`/traps/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteTrap(id: string): Promise<void> {
  return request(`/traps/${id}`, { method: 'DELETE' });
}

// ---- Alerts ----

export async function getAlerts(): Promise<any[]> {
  return request('/alerts');
}

export async function markAlertRead(id: string): Promise<any> {
  return request(`/alerts/${id}/read`, { method: 'PATCH' });
}

// ---- Reports ----

export async function createReport(data: {
  trapId: string;
  trapName: string;
  description: string;
}): Promise<any> {
  return request('/reports', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ---- Simulator ----

export async function simulateDetection(trapId: string, level: 'low' | 'medium' | 'high'): Promise<any> {
  return request('/traps/simulate-detection', {
    method: 'POST',
    body: JSON.stringify({ trapId, level }),
  });
}
