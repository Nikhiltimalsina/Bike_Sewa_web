import { Router } from "express";
import UserController from "../controllers/user.controller";
import authorizedMiddleware from "../middlewares/authorized.middleware";
import adminMiddleware from "../middlewares/admin.middleware";
import uploadAvatar from "../middlewares/upload.middleware";

const userRouter = Router();

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


// POST /auth/forgot-password (public)
userRouter.post("/forgot-password", UserController.forgotPassword);

// POST /auth/reset-password (public)
userRouter.post("/reset-password", UserController.resetPassword);

// ADMIN ROUTES (require admin role)
// GET /auth/users/stats - admin stats (MUST be before /users/:userId to avoid "stats" being caught as userId)
userRouter.get("/users/stats", authorizedMiddleware, adminMiddleware, UserController.getStats);

// GET /auth/users - list all users
userRouter.get("/users", authorizedMiddleware, adminMiddleware, UserController.getAllUsers);

// GET /auth/users/:userId - get user by id
userRouter.get("/users/:userId", authorizedMiddleware, adminMiddleware, UserController.getUserById);

// PUT /auth/users/:userId - update user
userRouter.put("/users/:userId", authorizedMiddleware, adminMiddleware, UserController.updateUser);

// DELETE /auth/users/:userId - delete user
userRouter.delete("/users/:userId", authorizedMiddleware, adminMiddleware, UserController.deleteUser);

// PATCH /auth/users/:userId/role - update user role
userRouter.patch("/users/:userId/role", authorizedMiddleware, adminMiddleware, UserController.updateUserRole);

// POST /auth/users - admin creates user
userRouter.post("/users", authorizedMiddleware, adminMiddleware, UserController.createUser);

export default userRouter;