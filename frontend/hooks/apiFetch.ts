import { API_BASE_URL } from '../lib/config';

export interface ApiOptions extends RequestInit {}

export const apiFetch = async (path: string, options: ApiOptions = {}) => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};
