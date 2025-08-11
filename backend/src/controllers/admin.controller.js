import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Blog from "../models/blog.model.js";
import Comment from "../models/comment.model.js";

export const adminRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists with this email" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user with admin role
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);

        res.json({
            success: true,
            message: "Admin registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getAllBlogsAdmin = async (req, res) => {
    try {
        let blogs;
        
        // If user is admin, show all blogs. If user, show only their blogs
        if (req.userRole === 'admin') {
            blogs = await Blog.find({}).populate('user', 'name email').sort({ createdAt: -1 });
        } else {
            blogs = await Blog.find({ user: req.userId }).populate('user', 'name email').sort({ createdAt: -1 });
        }

        res.json({ success: true, blogs });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getAllCommentsAdmin = async (req, res) => {
    try {
        let comments;
        
        // If user is admin, show all comments. If user, show comments on their blogs
        if (req.userRole === 'admin') {
            comments = await Comment.find({}).populate("blog").sort({ createdAt: -1 });
        } else {
            const userBlogs = await Blog.find({ user: req.userId }).select('_id');
            const blogIds = userBlogs.map(blog => blog._id);
            comments = await Comment.find({ blog: { $in: blogIds } }).populate("blog").sort({ createdAt: -1 });
        }

        res.json({ success: true, comments });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const deleteCommentById = async (req, res) => {
    try {
        const { id } = req.body;

        await Comment.findByIdAndDelete(id);

        res.json({ success: true, message: "Comment Deleted Successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const approveCommentById = async (req, res) => {
    try {
        const { id } = req.body;

        await Comment.findByIdAndUpdate(id, { isApproved: true });

        res.json({ success: true, message: "Comment Approved Successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getDashboard = async (req, res) => {
    try {
        let recentBlogs, blogs, comments, drafts;
        
        if (req.userRole === 'admin') {
            // Admin sees all data
            recentBlogs = await Blog.find({}).populate('user', 'name').sort({ createdAt: -1 }).limit(5);
            blogs = await Blog.countDocuments();
            comments = await Comment.countDocuments();
            drafts = await Blog.countDocuments({ isPublished: false });
        } else {
            // User sees only their data
            recentBlogs = await Blog.find({ user: req.userId }).populate('user', 'name').sort({ createdAt: -1 }).limit(5);
            blogs = await Blog.countDocuments({ user: req.userId });
            const userBlogs = await Blog.find({ user: req.userId }).select('_id');
            const blogIds = userBlogs.map(blog => blog._id);
            comments = await Comment.countDocuments({ blog: { $in: blogIds } });
            drafts = await Blog.countDocuments({ user: req.userId, isPublished: false });
        }

        const dashboardData = {
            recentBlogs, blogs, comments, drafts
        }

        res.json({ success: true, dashboardData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
