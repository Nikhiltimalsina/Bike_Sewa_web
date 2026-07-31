import { Router } from "express";
import AdminBikesController from "../controllers/admin.bikes.controller";
import authorizedMiddleware from "../middlewares/authorized.middleware";
import adminMiddleware from "../middlewares/admin.middleware";

const adminBikesRouter = Router();

adminBikesRouter.use(authorizedMiddleware);
adminBikesRouter.use(adminMiddleware);

adminBikesRouter.get("/", AdminBikesController.getAll);
adminBikesRouter.get("/:id", AdminBikesController.getById);
adminBikesRouter.put("/:id", AdminBikesController.update);
adminBikesRouter.delete("/:id", AdminBikesController.delete);

export default adminBikesRouter;