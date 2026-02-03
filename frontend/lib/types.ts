// User types
export interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
}

// Bag types
export interface Bag {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: BagCategory;
  image: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export type BagCategory =
  | 'handbag'
  | 'backpack'
  | 'crossbody'
  | 'tote'
  | 'clutch'
  | 'messenger'
  | 'duffel'
  | 'laptop';

export interface BagFormData {
  name: string;
  description: string;
  price: number;
  category: BagCategory;
  image: string;
  stock: number;
}

// Pagination types
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  user?: User;
  pagination?: Pagination;
  errors?: Array<{ msg: string; path: string }>;
}

export interface BagsResponse extends ApiResponse<Bag[]> {
  pagination: Pagination;
}

export interface BagResponse extends ApiResponse<Bag> {}

export interface UsersResponse extends ApiResponse<User[]> {
  pagination: Pagination;
}

export interface UserStatsResponse extends ApiResponse<{
  total: number;
  admins: number;
  users: number;
}> {}

// Query params
export interface BagQueryParams {
  page?: number;
  limit?: number;
  category?: BagCategory;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price' | '-price' | 'name' | '-name' | 'createdAt' | '-createdAt';
}

// Auth types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface ProfileUpdateData {
  name?: string;
  email?: string;
}

export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
}
