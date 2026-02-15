import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import questionRoutes from './routes/questionRoutes.js';
import learnRoutes from './routes/learnRoute.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. MIDDLEWARES
app.use(cors({
    origin: ["https://aptitude-frontend-eta.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());

// 2. DATABASE CONNECTION (Cached for Serverless)
const MONGO_URI = process.env.MONGODB_URI;

// Global variable to cache the connection
let isConnected = false; 

const connectDB = async () => {
    if (isConnected) {
        return;
    }

    try {
        const db = await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s if DB is unreachable
            socketTimeoutMS: 45000,
        });
        isConnected = db.connections[0].readyState;
        console.log("Connected to MongoDB Atlas");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};

// 3. CONNECTION MIDDLEWARE
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// 4. ROUTES
app.use('/api/questions', questionRoutes);
app.use('/api/learn', learnRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to the ZenCode Aptitude Platform API");
});

// 5. ERROR HANDLING
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Internal Server Error",
        error: process.env.NODE_ENV === 'production' ? "Something went wrong" : err.message
    });
});

// 6. ADAPTIVE LISTEN (Crucial for Vercel)
// Vercel handles the listening; app.listen() is only for local dev
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running locally on port ${PORT}`));
}

export default app;