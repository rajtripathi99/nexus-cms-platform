import { upload } from '../config/cloudinary.js';

// Single image upload
export const uploadSingle = upload.single('image');

// Error handling middleware for multer
export const handleUploadError = (err, req, res, next) => {
  if (err) {
    if (err.message === 'Only image files are allowed!') {
      return res.status(400).json({
        success: false,
        message: 'Only image files are allowed (jpg, jpeg, png, gif, webp)',
      });
    }
    
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size should not exceed 5MB',
      });
    }
    
    return res.status(500).json({
      success: false,
      message: err.message || 'File upload failed',
    });
  }
  next();
};