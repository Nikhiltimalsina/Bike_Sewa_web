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

  async updateById(
    id: string,
    data: Partial<{ fullName: string; phone: string; password: string; avatar: string }>
  ): Promise<IUserDocument | null> {
    return UserModel.findByIdAndUpdate(id, data, { new: true });
  },
};

export default UserRepository;