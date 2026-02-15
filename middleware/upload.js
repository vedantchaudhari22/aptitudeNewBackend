import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary using your env variables
cloudinary.config({
  cloud_name: 'dtmj84y0y', // extracted from your URL
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'aptitude_questions', // This will create a folder in your Cloudinary media library
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB Limit
});

export default upload;