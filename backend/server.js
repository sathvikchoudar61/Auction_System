import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/productRoutes.js"; 
import paymentRoutes from "./routes/paymentRoutes.js";
import cookieParser from "cookie-parser";
import path from "path";
import { errorHandler, validateRequest } from "./middleware/errorHandler.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors({
    origin: "http://localhost:5173",  // Adjust based on your frontend URL
    credentials: true,
  }));
  
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes); 
app.use("/api/payment", paymentRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

app.use(errorHandler);

app.listen(PORT, () => {
    connectDB();
    console.log("Server is running on port:", PORT);
});
