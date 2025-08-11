import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
    const token = req.headers.authorization;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        res.json({
            success: false,
            message: "Invalid Token!"
        });
    }
}