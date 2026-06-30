import apiClient from "@/utils/axios";

export type RegisterPayload = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthUser = {
  _id?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
  avatar?: string;
};

export type AuthResponse = {
  message?: string;
  token?: string;
  user?: AuthUser;
};

export const registerApi = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/api/v1/auth/register", payload);
  return response.data;
};

export const loginApi = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/api/v1/auth/login", payload);
  return response.data;
};