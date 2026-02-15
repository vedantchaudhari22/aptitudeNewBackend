import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: 'dtmj84y0y', 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage Engine for Vercel (Stateless)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'aptitude_questions', // Cloudinary mein folder name
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
    public_id: (req, file) => `question-${Date.now()}`,
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB Limit
});

export default upload;