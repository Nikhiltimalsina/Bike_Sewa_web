import { Router } from "express";
import UserController from "../controllers/user.controller";
import authorizedMiddleware from "../middlewares/authorized.middleware";
import uploadAvatar from "../middlewares/upload.middleware";

const userRouter = Router();

// POST /auth/forgot-password (public)
userRouter.post("/forgot-password", UserController.forgotPassword);

// POST /auth/reset-password (public)
userRouter.post("/reset-password", UserController.resetPassword);

// POST /auth/register
userRouter.post("/register", UserController.register);

// POST /auth/login
userRouter.post("/login", UserController.login);

// GET /auth/whoami (protected)
userRouter.get("/whoami", authorizedMiddleware, UserController.whoami);

// PUT /auth/update (protected, multipart/form-data with optional "avatar" file)
userRouter.put(
  "/update",
  authorizedMiddleware,
  uploadAvatar.single("avatar"),
  UserController.updateProfile
);

// GET /auth/users/stats (protected)
userRouter.get("/users/stats", authorizedMiddleware, UserController.getStats);

export default userRouter;