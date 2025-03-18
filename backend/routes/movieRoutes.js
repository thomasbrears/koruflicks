import express from 'express';
import { getPopularMovies } from '../controllers/movieController.js';

const router = express.Router();

// Movie routes
router.get('/popular', getPopularMovies);

export default router;