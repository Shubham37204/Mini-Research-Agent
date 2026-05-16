import { z } from 'zod';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

interface RequestOptions extends RequestInit {
  schema?: z.ZodTypeAny;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { schema, ...init } = options;
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    throw new ApiError(response.status, (data.message as string) || 'API Request Failed', data);
  }

  const data = await response.json();

  if (schema) {
    try {
      return schema.parse(data) as T;
    } catch (error) {
      console.error('Schema Validation Error:', error);
      throw new Error('Invalid API Response Schema', { cause: error });
    }
  }

  return data as T;
}

export const apiClient = {
  request,
  get: <T>(endpoint: string, options?: RequestOptions) => 
    request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body: unknown, options?: RequestOptions) => 
    request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
};
