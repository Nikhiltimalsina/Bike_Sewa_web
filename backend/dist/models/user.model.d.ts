import mongoose, { Document } from "mongoose";
import { UserRole } from "../types/user.type";
export interface IUserDocument extends Document {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}
declare const UserModel: mongoose.Model<IUserDocument, {}, {}, {}, mongoose.Document<unknown, {}, IUserDocument, {}, {}> & IUserDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default UserModel;
//# sourceMappingURL=user.model.d.ts.map