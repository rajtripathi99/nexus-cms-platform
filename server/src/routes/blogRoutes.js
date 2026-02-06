import express from 'express';
import {
  getBlogs,
  getAllBlogs,
  getBlogBySlug,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getBlogs);
router.get('/slug/:slug', getBlogBySlug);

// Protected routes (admin only)
router.get('/admin/all', protect, getAllBlogs);
router.get('/:id', protect, getBlogById);
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);

export default router;