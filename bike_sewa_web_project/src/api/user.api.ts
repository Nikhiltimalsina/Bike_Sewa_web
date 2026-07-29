import apiClient from "@/utils/axios";
import { AuthUser } from "./auth.api";

export type WhoamiResponse = {
  user: AuthUser;
};

export type UpdateProfilePayload = {
  fullName?: string;
  phone?: string;
  currentPassword?: string;
  newPassword?: string;
  avatar?: File | null;
};

export type UpdateProfileResponse = {
  message?: string;
  user?: AuthUser;
};

export const whoamiApi = async (): Promise<WhoamiResponse> => {
  const response = await apiClient.get<WhoamiResponse>("/api/v1/auth/whoami");
  return response.data;
};

export const updateProfileApi = async (
  payload: UpdateProfilePayload
): Promise<UpdateProfileResponse> => {
  const formData = new FormData();

  if (payload.fullName !== undefined) formData.append("fullName", payload.fullName);
  if (payload.phone !== undefined) formData.append("phone", payload.phone);
  if (payload.currentPassword) formData.append("currentPassword", payload.currentPassword);
  if (payload.newPassword) formData.append("newPassword", payload.newPassword);
  if (payload.avatar) formData.append("avatar", payload.avatar);

  const response = await apiClient.put<UpdateProfileResponse>("/api/v1/auth/update", formData);

  return response.data;
};