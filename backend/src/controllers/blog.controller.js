import fs from "fs";

import imagekit from "../config/imageKit.js";
import Blog from "../models/blog.model.js";
import Comment from "../models/comment.model.js";

export const addBlog = async (req, res) => {
    try {
        const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);

        const imageFile = req.file;

        if (!imageFile) {
            return res.json({ success: false, message: "Image file is required" });
        }

        if (!title || !subTitle || !description || !category || isPublished === undefined) {
            return res.json({ success: false, message: "Missing Required Fields" });
        }

        const fileBuffer = fs.readFileSync(imageFile.path);

        // Upload Image to ImageKit
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/blogs"
        });

        // optimization through imagekit URL transformation
        const optimizedImageURL = imagekit.url({
            path: response.filePath,
            transformation: [
                { quality: "auto" },
                { format: "webp" },
                { width: "1280" },
            ]
        });

        const image = optimizedImageURL;

        await Blog.create({
            title, subTitle, description, category, image, isPublished, user: req.userId
        });

        res.json({
            success: true,
            message: "Blog Added Successfully"
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
}

export const getAllBlogs = async (_, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true }).populate('user', 'name email');

        res.json({ success: true, blogs });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getBlogById = async (req, res) => {
    try {
        const { blogId } = req.params;

        const blog = await Blog.findById(blogId).populate('user', 'name email');

        if (!blog) {
            return res.json({ success: false, message: "Blog Not Found" });
        }

        res.json({ success: true, blog });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const deleteBlogById = async (req, res) => {
    try {
        const { id } = req.body;

        // Find the blog and check ownership
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }

        // Check if user is admin or owns the blog
        if (req.userRole !== 'admin' && blog.user.toString() !== req.userId) {
            return res.json({ success: false, message: "You can only delete your own blogs" });
        }

        await Blog.findByIdAndDelete(id);

        // delete all comments associated with the blog
        await Comment.deleteMany({blog: id});

        res.json({ success: true, message: "Blog Deleted Successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const togglePublish = async (req, res) => {
    try {
        const { id } = req.body;

        const blog = await Blog.findById(id);
        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }

        // Check if user is admin or owns the blog
        if (req.userRole !== 'admin' && blog.user.toString() !== req.userId) {
            return res.json({ success: false, message: "You can only modify your own blogs" });
        }

        blog.isPublished = !blog.isPublished;
        await blog.save();

        res.json({ success: true, message: "Blog Status Updated" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const addComment = async (req, res) => {
    try {
        const { blog, name, content } = req.body;

        await Comment.create({ blog, name, content, isApproved: true });

        res.json({ success: true, message: "Comment Added Successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getBlogComments = async (req, res) => {
    try {
        const { blogId } = req.body;

        const comments = await Comment.find({ blog: blogId }).sort({ createdAt: -1 });

        res.json({ success: true, comments });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}