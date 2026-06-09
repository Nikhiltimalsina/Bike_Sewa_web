import { Request, Response, NextFunction } from "express";
import { IJwtPayload } from "../types/user.type";
declare global {
    namespace Express {
        interface Request {
            user?: IJwtPayload;
        }
    }
}
declare const authorizedMiddleware: (req: Request, _res: Response, next: NextFunction) => void;
export default authorizedMiddleware;
//# sourceMappingURL=authorized.middleware.d.ts.map