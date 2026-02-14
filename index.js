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
const PORT = process.env.PORT || 5000;

// 1. MIDDLEWARES
app.use(cors());
app.use(express.json());
// Ensure the public folder exists for local uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// 2. DATABASE CONNECTION LOGIC (Serverless Optimized)
const MONGO_URI = process.env.MONGODB_URI;

const connectDB = async () => {
    // If we already have a connection, don't create a new one
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        await mongoose.connect(MONGO_URI, {
            // Serverless timeout settings to prevent 10s hangs
            serverSelectionTimeoutMS: 5000, 
            socketTimeoutMS: 45000,
        });
        console.log("Connected to MongoDB Atlas");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        // Do not throw here, let the middleware handle the response
    }
};

// 3. CONNECTION MIDDLEWARE
// This ensures that for every request to Vercel, we check the DB connection
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

// 5. ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Internal Server Error",
        error: process.env.NODE_ENV === 'production' ? {} : err.message
    });
});

// 6. ADAPTIVE LISTEN
// Vercel does not use app.listen(), but your local machine does
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running locally on port ${PORT}`));
}

export default app;