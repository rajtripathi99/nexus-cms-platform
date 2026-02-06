import express from 'express';
import {
  getContacts,
  createContact,
  markAsRead,
  deleteContact,
} from '../controllers/contactController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route
router.post('/', createContact);

// Protected routes (admin only)
router.get('/', protect, getContacts);
router.patch('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteContact);

export default router;