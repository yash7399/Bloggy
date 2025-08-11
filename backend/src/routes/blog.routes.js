import express from "express";

import {
    addBlog,
    getAllBlogs,
    getBlogById,
    deleteBlogById,
    togglePublish,
    addComment,
    getBlogComments,
} from "../controllers/blog.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { auth } from "../middlewares/auth.middleware.js";

const blogRouter = express.Router();

blogRouter.post("/add", auth, upload.single("image"), addBlog);
blogRouter.get("/all", getAllBlogs);
blogRouter.get("/:blogId", getBlogById);
blogRouter.post("/delete", auth, deleteBlogById);
blogRouter.post("/toggle-publish", auth, togglePublish);

blogRouter.post("/addComment", addComment);
blogRouter.post("/comments", getBlogComments);

export default blogRouter;