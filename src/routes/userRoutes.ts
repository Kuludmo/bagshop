import { Router } from 'express';
import {
  getUsers,
  getUser,
  updateUserRole,
  deleteUser,
  getUserStats,
} from '../controllers/userController';
import { protect, authorize } from '../middleware/auth';
import { idValidation } from '../middleware/validate';

const router = Router();

// All routes require admin access
router.use(protect, authorize('admin'));

router.get('/', getUsers);
router.get('/stats', getUserStats);
router.get('/:id', idValidation, getUser);
router.put('/:id/role', idValidation, updateUserRole);
router.delete('/:id', idValidation, deleteUser);

export default router;
