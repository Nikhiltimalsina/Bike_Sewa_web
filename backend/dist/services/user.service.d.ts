import { RegisterDto, LoginDto } from "../dtos/user.dto";
import { IUserSafe } from "../types/user.type";
declare const UserService: {
    register(dto: RegisterDto): Promise<{
        message: string;
        user: IUserSafe;
    }>;
    login(dto: LoginDto): Promise<{
        message: string;
        token: string;
        user: IUserSafe;
    }>;
};
export default UserService;
//# sourceMappingURL=user.service.d.ts.map