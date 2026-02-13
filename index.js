import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config()
import path from 'path';
import { fileURLToPath } from 'url';
import questionRoutes from './routes/questionRoutes.js';
import learnRoutes from './routes/learnRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.use('/api/questions', questionRoutes);
app.use('/api/learn', learnRoutes);

// MongoDB Connection
const MONGO_URI = process.env.MONGODB_URI;

// mongoose.connect(MONGO_URI)
//     .then(() => {
//         console.log("Connected to MongoDB");
//         app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//     }
//     )
//     .catch(err => console.log("DB Connection Error: ", err)
//     );

let isConnected = false;
async function connectMongoDB() {
    try {
        await mongoose.connect(MONGO_URI);
        isConnected = true;
        console.log("Connected to MongoDB");
        // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.log("Error in connecting the database: ", error);
    }
}

app.use((req, res, next) => {
    if(!isConnected){
        connectMongoDB();
    }
    next();
})

app.get("/", (req, res) => {
    res.send("Welcome to aptitude platform");
});