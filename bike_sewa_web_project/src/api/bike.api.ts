import apiClient from "@/utils/axios";

export type Bike = {
  id: string;
  name: string;
  model?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  isAvailable?: boolean;
  pricePerHour?: number;
  imageUrl?: string | null;
};

export type BikeListResponse = {
  bikes: Bike[];
};

export type BikeResponse = {
  bike: Bike;
};

export const getBikesApi = async (availableOnly = false): Promise<BikeListResponse> => {
  const response = await apiClient.get<BikeListResponse>("/api/v1/bikes", {
    params: { available: availableOnly ? "true" : undefined },
  });
  return response.data;
};

export const getBikeByIdApi = async (id: string): Promise<BikeResponse> => {
  const response = await apiClient.get<BikeResponse>(`/api/v1/bikes/${id}`);
  return response.data;
};

export const searchBikesApi = async (q: string): Promise<BikeListResponse> => {
  const response = await apiClient.get<BikeListResponse>("/api/v1/bikes/search", {
    params: { q },
  });
  return response.data;
};
