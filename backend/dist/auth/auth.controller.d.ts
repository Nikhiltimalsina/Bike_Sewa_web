import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from '../user/user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        message: string;
        user: import("../user/user.types").IUserSafe;
    }>;
    login(dto: LoginDto): Promise<{
        message: string;
        token: string;
        user: import("../user/user.types").IUserSafe;
    }>;
}
