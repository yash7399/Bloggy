import express from "express";

import {
    getAllCommentsAdmin,
    getAllBlogsAdmin,
    deleteCommentById,
    approveCommentById,
    getDashboard,
    adminRegister,
} from "../controllers/admin.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const adminRouter = express.Router();

adminRouter.post("/register", adminRegister);
adminRouter.get("/comments", auth, getAllCommentsAdmin);
adminRouter.get("/blogs", auth, getAllBlogsAdmin);
adminRouter.post("/delete-comment", auth, deleteCommentById);
adminRouter.post("/approve-comment", auth, approveCommentById);
adminRouter.get("/dashboard", auth, getDashboard);

export default adminRouter;