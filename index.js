import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./routes/users.js";
import authRoute from "./routes/auth.js";

dotenv.config();
const app = express();
// app.use(express.json());
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 8000;
const corsOptions = {
  origin: true,
  credentials: true,
};

//for testing
// app.get('/', (req, res) => {
//    res.send('API is working')
// })

//database connection
mongoose.set("strictQuery", false);
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB database connected");
  } catch (error) {
    console.log("MongoDB database connection failed:", error);
  }
};
//middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.get('/api/v1/users', async (req, res) => {
   try {
      const users = await getAllUsers();
      console.log("All Users:", users);
      res.status(200).json(users);
   } catch (error) {
      res.status(500).json({ success: false, message: "Failed to retrieve users" });
   }
});

app.listen(port, () => {
  connect();
  console.log("server listening on port", port);
});

