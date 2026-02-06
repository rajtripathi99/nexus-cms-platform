import express from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getServices);

// Protected routes (admin only)
router.get('/:id', protect, getServiceById);
router.post('/', protect, createService);
router.put('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);

export default router;