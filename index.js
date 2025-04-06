import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes
import userRoute from "./routes/users.js";
import authRoute from "./routes/auth.js";

// Load environment variables
dotenv.config();

// Create app
const app = express();

// Environment variables
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

// CORS options
const corsOptions = {
  origin: true,
  credentials: true,
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);

// Optional: Basic test route
app.get("/", (req, res) => {
  res.send("🎉 SavingsYogi Backend is running!");
});

// MongoDB connection
mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit if DB connection fails
  }
};

// Start server after DB connects
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
