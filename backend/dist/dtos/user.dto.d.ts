export interface RegisterDto {
    fullName: string;
    email: string;
    phone: string;
    password: string;
}
export interface LoginDto {
    email: string;
    password: string;
}
export declare const validateRegisterDto: (body: Partial<RegisterDto>) => string[];
export declare const validateLoginDto: (body: Partial<LoginDto>) => string[];
//# sourceMappingURL=user.dto.d.ts.map