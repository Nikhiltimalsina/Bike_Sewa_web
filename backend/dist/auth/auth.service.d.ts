import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../user/user.schema';
import { RegisterDto, LoginDto } from '../user/user.dto';
import { IUserSafe } from '../user/user.types';
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        message: string;
        user: IUserSafe;
    }>;
    login(dto: LoginDto): Promise<{
        message: string;
        token: string;
        user: IUserSafe;
    }>;
}
