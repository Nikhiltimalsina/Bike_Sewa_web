import UserModel, { IUserDocument } from "../models/user.model";
import { RegisterDto } from "../dtos/user.dto";

const UserRepository = {
  async findByEmail(email: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ email: email.toLowerCase() });
  },

  async findById(id: string): Promise<IUserDocument | null> {
    return UserModel.findById(id);
  },

  async create(data: RegisterDto & { password: string }): Promise<IUserDocument> {
    return UserModel.create({
      fullName: data.fullName,
      email: data.email.toLowerCase(),
      phone: data.phone,
      password: data.password,
    });
  },

  async findAll(): Promise<IUserDocument[]> {
    return UserModel.find().select("-password");
  },

  async count(): Promise<number> {
    return UserModel.countDocuments();
  },

  async updateById(
    id: string,
    data: Partial<{ fullName: string; phone: string; password: string; avatar: string; twoFactorEnabled: boolean; resetPasswordToken: string; resetPasswordExpires: Date }>
  ): Promise<IUserDocument | null> {
    return UserModel.findByIdAndUpdate(id, data, { new: true });
  },

  async findByResetToken(token: string): Promise<IUserDocument | null> {
    return UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
  },
};

export default UserRepository;