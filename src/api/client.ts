/// <reference types="vite/client" />
const API_URL = import.meta.env.VITE_API_URL || 'https://ora-production-0850.up.railway.app'

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token')
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  return response.json()
}

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  register: (email: string, password: string, name: string) =>
    apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),
}

// Readings API
export const readingsAPI = {
  generate: (data: any) =>
    apiFetch('/readings/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getHistory: () =>
    apiFetch('/readings/history'),
  
  getStats: () =>
    apiFetch('/readings/stats'),
}

// Admin API
export const adminAPI = {
  getUsers: () =>
    apiFetch('/admin/users/detailed'),
  
  getStats: () =>
    apiFetch('/admin/stats'),
  
  getConfig: () =>
    apiFetch('/admin/config'),
}

// Wallet API
export const walletAPI = {
  getStatus: () =>
    apiFetch('/wallet/status'),
  
  spendCredits: (amount: number) =>
    apiFetch('/wallet/spend', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),
}

// Feedback API
export const feedbackAPI = {
  submit: (data: { type: string; message: string; rating?: number }) =>
    apiFetch('/feedback', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}
