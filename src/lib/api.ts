const getApiBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;

  // If a live remote API URL is specified (e.g. https://api.wedplan.com/api)
  if (envUrl && !envUrl.includes('localhost')) {
    return envUrl.replace(/\/$/, '');
  }

  // Client-side in browser
  if (typeof window !== 'undefined') {
    // If deployed on Vercel or any non-localhost host, use same-origin relative /api
    if (!window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
      return '/api';
    }
    return (envUrl || '/api').replace(/\/$/, '');
  }

  // Server-side default
  return (envUrl || 'http://localhost:5000/api').replace(/\/$/, '');
};

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiError extends Error {
  statusCode: number;
  data: any;

  constructor(message: string, statusCode: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

async function request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...customConfig } = options;
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // Avoid duplicate /api/api
  let url = '';
  if (baseUrl === '/api') {
    url = cleanEndpoint.startsWith('/api') ? cleanEndpoint : `/api${cleanEndpoint}`;
  } else if (baseUrl.endsWith('/api') && cleanEndpoint.startsWith('/api')) {
    url = `${baseUrl.slice(0, -4)}${cleanEndpoint}`;
  } else {
    url = `${baseUrl}${cleanEndpoint}`;
  }

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  // Retrieve token from localStorage if available (client-side)
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('wedplan_token');
  }

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...customConfig,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    cache: 'no-store',
  });

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      responseData?.error || responseData?.message || `Request failed with status ${response.status}`;

    // If unauthorized or account blocked, handle appropriately
    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('wedplan_token');
      localStorage.removeItem('wedplan_user');
    }

    throw new ApiError(errorMessage, response.status, responseData);
  }

  return responseData;
}

export const api = {
  get: <T = any>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: 'GET', ...options }),
  post: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),
  put: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),
  patch: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),
  delete: <T = any>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: 'DELETE', ...options }),
};

export { ApiError };
