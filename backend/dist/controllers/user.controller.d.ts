import { Request, Response, NextFunction } from "express";
declare const UserController: {
    register(req: Request, res: Response, next: NextFunction): Promise<void>;
    login(req: Request, res: Response, next: NextFunction): Promise<void>;
};
export default UserController;
//# sourceMappingURL=user.controller.d.ts.map