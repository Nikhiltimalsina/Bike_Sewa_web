import { Router } from "express";
import UserController from "../controllers/user.controller";

const userRouter = Router();

// POST /auth/register
userRouter.post("/register", UserController.register);

// POST /auth/login
userRouter.post("/login", UserController.login);

export default userRouter;
