import { Router } from 'express';
import {
  getBags,
  getBag,
  createBag,
  updateBag,
  deleteBag,
  getCategories,
} from '../controllers/bagController';
import { protect, authorize } from '../middleware/auth';
import {
  bagValidation,
  bagUpdateValidation,
  idValidation,
  bagQueryValidation,
} from '../middleware/validate';

const router = Router();

// Public routes
router.get('/', bagQueryValidation, getBags);
router.get('/categories', getCategories);
router.get('/:id', idValidation, getBag);

// Admin only routes
router.post('/', protect, authorize('admin'), bagValidation, createBag);
router.put('/:id', protect, authorize('admin'), idValidation, bagUpdateValidation, updateBag);
router.delete('/:id', protect, authorize('admin'), idValidation, deleteBag);

export default router;
