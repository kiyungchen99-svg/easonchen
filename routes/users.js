import express from 'express';
import { getFavorites, toggleFavorite } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/favorites', protect, getFavorites);
router.post('/favorites/:birdId', protect, toggleFavorite);

export default router;
