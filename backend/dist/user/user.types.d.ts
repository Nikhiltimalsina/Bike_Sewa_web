export interface IUser {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IUserSafe {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
}
