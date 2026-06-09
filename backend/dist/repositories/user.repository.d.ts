import { IUserDocument } from "../models/user.model";
import { RegisterDto } from "../dtos/user.dto";
declare const UserRepository: {
    findByEmail(email: string): Promise<IUserDocument | null>;
    findById(id: string): Promise<IUserDocument | null>;
    create(data: RegisterDto & {
        password: string;
    }): Promise<IUserDocument>;
    findAll(): Promise<IUserDocument[]>;
};
export default UserRepository;
//# sourceMappingURL=user.repository.d.ts.map