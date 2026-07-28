import apiClient from "@/utils/axios";

export interface Booking {
  id: string;
  bikeId: string;
  bikeName: string;
  bikeImageUrl: string | null;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  pickupLocation?: string;
  createdAt: string;
}

export interface CreateBookingPayload {
  bikeId: string;
  startDate: string;
  endDate: string;
  pickupLocation?: string;
  paymentMethod?: string;
}

export const createBookingApi = async (data: CreateBookingPayload) => {
  const response = await apiClient.post("/api/v1/bookings", data);
  return response.data;
};

export const getMyBookingsApi = async (): Promise<{ bookings: Booking[] }> => {
  const response = await apiClient.get<{ bookings: Booking[] }>("/api/v1/bookings/me");
  return response.data;
};

export const getBookingByIdApi = async (id: string): Promise<{ booking: Booking }> => {
  const response = await apiClient.get<{ booking: Booking }>(`/api/v1/bookings/${id}`);
  return response.data;
};

export const cancelBookingApi = async (id: string): Promise<{ message: string; booking: Booking }> => {
  const response = await apiClient.post<{ message: string; booking: Booking }>(`/api/v1/bookings/${id}/cancel`);
  return response.data;
};

export const completeBookingApi = async (id: string): Promise<{ message: string; booking: Booking }> => {
  const response = await apiClient.post<{ message: string; booking: Booking }>(
    `/api/v1/bookings/${id}/complete`
  );
  return response.data;
};

export const returnBikeApi = async (
  bookingId: string
): Promise<{ message: string; booking: Booking }> => {
  const response = await apiClient.post<{ message: string; booking: Booking }>(
    `/api/v1/bookings/${bookingId}/complete`
  );
  return response.data;
};
