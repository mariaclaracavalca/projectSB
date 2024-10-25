import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinaryConfig.js';

// config Cloudinary 
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'authors',
    allowed_formats: ['jpg', 'jpeg', 'png'], 
  },
});

// Config upload Cloudinary
const upload = multer({ storage: storage });

export default upload;
