import express from "express";
import { 
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
  checkInWatchlist,
  addToLiked,
  removeFromLiked,
  getLikedContent,
  checkIsLiked,
  getAllUserContent,
  getUserStats
} from "../controllers/UserContentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Watchlist routes
router.post("/watchlist", authMiddleware, addToWatchlist);  // Add to watchlist
router.delete("/watchlist/:itemId", authMiddleware, removeFromWatchlist);  // Remove from watchlist
router.get("/watchlist", authMiddleware, getWatchlist);  // Get current user's watchlist
router.get("/watchlist/:userId", authMiddleware, getWatchlist);  // Get specific user's watchlist (admin or self)
router.get("/watchlist/check/:itemId", authMiddleware, checkInWatchlist);  // Check if item is in watchlist

// Liked content routes
router.post("/liked", authMiddleware, addToLiked);  // Add to liked content
router.delete("/liked/:itemId", authMiddleware, removeFromLiked);  // Remove from liked content
router.get("/liked", authMiddleware, getLikedContent);  // Get current user's liked content
router.get("/liked/:userId", authMiddleware, getLikedContent);  // Get specific user's liked content (admin or self)
router.get("/liked/check/:itemId", authMiddleware, checkIsLiked);  // Check if item is liked

// Combined routes
router.get("/all", authMiddleware, getAllUserContent);  // Get all user content (watchlist + liked)
router.get("/all/:userId", authMiddleware, getAllUserContent);  // Get all content for specific user
router.get("/stats", authMiddleware, getUserStats);  // Get user content statistics
router.get("/stats/:userId", authMiddleware, getUserStats);  // Get stats for specific user

export default router;