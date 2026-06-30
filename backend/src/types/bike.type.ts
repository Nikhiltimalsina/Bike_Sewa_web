export interface IBike {
   _id: string;
   name: string;
   modelName: string;
   location: string;
   latitude: number;
   longitude: number;
   isAvailable: boolean;
   pricePerHour: number;
   imageUrl?: string;
   createdAt: Date;
   updatedAt: Date;
 }