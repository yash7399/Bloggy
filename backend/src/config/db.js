import mongoose from "mongoose";

export const connectDB = async() => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("MONGODB CONNECTED SUCCESSFULLY");
        });

        await mongoose.connect(`${process.env.MONGODB_URI}/blog-app`);
    } catch (error) {
        console.log("Error Connecting to MONGODB", error);
        process.exit(1);
    }
}