import express from 'express';
import {
  getAllBirds,
  getBirdById,
  createBird,
  updateBird,
  deleteBird,
} from '../controllers/birdController.js';
import { getComments, createComment, deleteComment } from '../controllers/commentController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllBirds);
router.get('/:id', getBirdById);
router.post('/', protect, adminOnly, createBird);
router.put('/:id', protect, adminOnly, updateBird);
router.delete('/:id', protect, adminOnly, deleteBird);

router.get('/:birdId/comments', getComments);
router.post('/:birdId/comments', protect, createComment);
router.delete('/comments/:id', protect, deleteComment);

export default router;
