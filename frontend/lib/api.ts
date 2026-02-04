import type {
  ApiResponse,
  BagsResponse,
  BagResponse,
  UsersResponse,
  UserStatsResponse,
  BagQueryParams,
  BagFormData,
  LoginData,
  RegisterData,
  ProfileUpdateData,
  PasswordUpdateData,
  User,
} from './types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Include cookies
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data.message || 'Something went wrong', response.status);
  }

  return data;
}

// Auth API
export const authApi = {
  register: (data: RegisterData) =>
    fetchApi<ApiResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: LoginData) =>
    fetchApi<ApiResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    fetchApi<ApiResponse>('/auth/logout', {
      method: 'POST',
    }),

  getMe: () => fetchApi<ApiResponse>('/auth/me'),

  updateProfile: (data: ProfileUpdateData) =>
    fetchApi<ApiResponse>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updatePassword: (data: PasswordUpdateData) =>
    fetchApi<ApiResponse>('/auth/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Bags API
export const bagsApi = {
  getAll: (params?: BagQueryParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return fetchApi<BagsResponse>(`/bags${query ? `?${query}` : ''}`);
  },

  getOne: (id: string) => fetchApi<BagResponse>(`/bags/${id}`),

  getCategories: () => fetchApi<ApiResponse<string[]>>('/bags/categories'),

  create: (data: BagFormData) =>
    fetchApi<BagResponse>('/bags', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<BagFormData>) =>
    fetchApi<BagResponse>(`/bags/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi<ApiResponse>(`/bags/${id}`, {
      method: 'DELETE',
    }),
};

// Users API (Admin only)
export const usersApi = {
  getAll: (params?: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.limit) searchParams.append('limit', String(params.limit));
    const query = searchParams.toString();
    return fetchApi<UsersResponse>(`/users${query ? `?${query}` : ''}`);
  },

  getOne: (id: string) => fetchApi<ApiResponse<User>>(`/users/${id}`),

  getStats: () => fetchApi<UserStatsResponse>('/users/stats'),

  updateRole: (id: string, role: 'user' | 'admin') =>
    fetchApi<ApiResponse<User>>(`/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    }),

  delete: (id: string) =>
    fetchApi<ApiResponse>(`/users/${id}`, {
      method: 'DELETE',
    }),
};

export { ApiError };
