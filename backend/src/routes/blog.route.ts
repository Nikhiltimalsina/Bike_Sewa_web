import { Router } from "express";
import BlogController from "../controllers/blog.controller";
import authorizedMiddleware from "../middlewares/authorized.middleware";

const blogRouter = Router();

blogRouter.get("/", BlogController.getAllBlogs);
blogRouter.get("/:id", BlogController.getBlogById);
blogRouter.post("/", authorizedMiddleware, BlogController.createBlog);
blogRouter.put("/:id", authorizedMiddleware, BlogController.updateBlog);
blogRouter.delete("/:id", authorizedMiddleware, BlogController.deleteBlog);

export default blogRouter;