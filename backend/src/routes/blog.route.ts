import { Router } from "express";
import BlogController from "../controllers/blog.controller";
import authorizedMiddleware from "../middlewares/authorized.middleware";
import adminMiddleware from "../middlewares/admin.middleware";

const blogRouter = Router();

blogRouter.get("/", BlogController.getAllBlogs);
blogRouter.get("/:id", BlogController.getBlogById);
blogRouter.post("/", authorizedMiddleware, adminMiddleware, BlogController.createBlog);
blogRouter.put("/:id", authorizedMiddleware, adminMiddleware, BlogController.updateBlog);
blogRouter.delete("/:id", authorizedMiddleware, adminMiddleware, BlogController.deleteBlog);

export default blogRouter;