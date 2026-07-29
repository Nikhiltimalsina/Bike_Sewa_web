import apiClient from "@/utils/axios";

// ===================== USER MANAGEMENT =====================

export type AdminUser = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  avatar?: string;
  createdAt?: string;
};

export type AdminUsersResponse = {
  users: AdminUser[];
};

export type AdminStats = {
  totalUsers: number;
  totalBikes: number;
  totalBookings: number;
};

export const adminGetUsersApi = async (): Promise<AdminUsersResponse> => {
  const response = await apiClient.get<AdminUsersResponse>("/api/v1/admin/users");
  return response.data;
};

export const adminGetStatsApi = async (): Promise<AdminStats> => {
  const response = await apiClient.get<AdminStats>("/api/v1/admin/users/stats");
  return response.data;
};

export const adminUpdateUserRoleApi = async (
  userId: string,
  role: "user" | "admin"
): Promise<{ message: string; user: AdminUser }> => {
  const response = await apiClient.patch<{ message: string; user: AdminUser }>(
    `/api/v1/admin/users/${userId}/role`,
    { role }
  );
  return response.data;
};

export const adminDeleteUserApi = async (userId: string): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(
    `/api/v1/admin/users/${userId}`
  );
  return response.data;
};

export type AdminCreateUserPayload = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role?: "user" | "admin";
};

export const adminCreateUserApi = async (
  data: AdminCreateUserPayload
): Promise<{ message: string; user: AdminUser }> => {
  const response = await apiClient.post<{ message: string; user: AdminUser }>(
    "/api/v1/admin/users",
    data
  );
  return response.data;
};

export type AdminUpdateUserPayload = Partial<{
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: "user" | "admin";
}>;

export const adminUpdateUserApi = async (
  userId: string,
  data: AdminUpdateUserPayload
): Promise<{ message: string; user: AdminUser }> => {
  const response = await apiClient.put<{ message: string; user: AdminUser }>(
    `/api/v1/admin/users/${userId}`,
    data
  );
  return response.data;
};

// ===================== BIKE MANAGEMENT =====================

export type AdminBike = {
  id: string;
  name: string;
  model: string;
  location: string;
  latitude: number;
  longitude: number;
  isAvailable: boolean;
  pricePerHour: number;
  imageUrl: string | null;
};

export type AdminBikeListResponse = {
  bikes: AdminBike[];
};

export type AdminBikeResponse = {
  message?: string;
  bike: AdminBike;
};

export const adminCreateBikeApi = async (data: {
  name: string;
  modelName: string;
  location: string;
  latitude: number;
  longitude: number;
  pricePerHour: number;
  imageUrl?: string;
}): Promise<AdminBikeResponse> => {
  const response = await apiClient.post<AdminBikeResponse>("/api/v1/admin/bikes", data);
  return response.data;
};

export const adminUpdateBikeApi = async (
  id: string,
  data: Partial<{
    name: string;
    modelName: string;
    location: string;
    latitude: number;
    longitude: number;
    pricePerHour: number;
    imageUrl: string;
    isAvailable: boolean;
  }>
): Promise<AdminBikeResponse> => {
  const response = await apiClient.put<AdminBikeResponse>(`/api/v1/admin/bikes/${id}`, data);
  return response.data;
};

export const adminDeleteBikeApi = async (id: string): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(`/api/v1/admin/bikes/${id}`);
  return response.data;
};

// ===================== BOOKING MANAGEMENT =====================

export type AdminBooking = {
  id: string;
  bikeId: string;
  bikeName: string;
  bikeImageUrl: string | null;
  userId?: string;
  user?: { fullName?: string; email?: string; phone?: string };
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  pickupLocation: string;
  createdAt?: string;
};

export type AdminBookingsResponse = {
  bookings: AdminBooking[];
};

export const adminGetAllBookingsApi = async (): Promise<AdminBookingsResponse> => {
  const response = await apiClient.get<AdminBookingsResponse>("/api/v1/admin/bookings");
  return response.data;
};

export const adminUpdateBookingStatusApi = async (
  id: string,
  status: string
): Promise<{ message: string; booking: AdminBooking }> => {
  const response = await apiClient.patch<{ message: string; booking: AdminBooking }>(
    `/api/v1/admin/bookings/${id}/status`,
    { status }
  );
  return response.data;
};