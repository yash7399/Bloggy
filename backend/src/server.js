import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./config/db.js";
import adminRouter from "./routes/admin.routes.js";
import blogRouter from "./routes/blog.routes.js";
import userRouter from "./routes/user.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is WORKING...");
});

app.use("/api/admin", adminRouter);
app.use("/api/blog", blogRouter);
app.use("/api/user", userRouter);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`SERVER IS RUNNING ON PORT: ${PORT}`);
    });
});