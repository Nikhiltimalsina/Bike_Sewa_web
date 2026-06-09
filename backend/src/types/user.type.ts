export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserSafe {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
}

export interface IJwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}
