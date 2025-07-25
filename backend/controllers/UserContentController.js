import { db } from "../firebase.js";
import admin from "firebase-admin";

// Helper function to validate user access
const validateUserAccess = async (requestingUserId, targetUserId) => {
  if (requestingUserId === targetUserId) {
    return true;
  }
  
  // Check if requesting user is admin
  try {
    const userDoc = await db.collection("users").doc(requestingUserId).get();
    const userData = userDoc.data();
    return userData?.isAdmin || false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

// Helper function to create content item object
const createContentItem = (itemData) => {
  return {
    itemId: itemData.itemId,
    title: itemData.title,
    mediaType: itemData.mediaType, // 'movie' or 'tv'
    posterPath: itemData.posterPath || null,
    backdropPath: itemData.backdropPath || null,
    overview: itemData.overview || null,
    releaseDate: itemData.releaseDate || null,
    voteAverage: itemData.voteAverage || 0,
    voteCount: itemData.voteCount || 0,
    genreIds: itemData.genreIds || [], // Fixed: was item.genreIds
    addedAt: new Date()
  };
};

// WATCHLIST FUNCTIONS

// Add item to watchlist
export const addToWatchlist = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { itemId, title, mediaType, posterPath, backdropPath, overview, releaseDate, voteAverage, voteCount, genreIds } = req.body;
    
    // Validate required fields
    if (!itemId || !title || !mediaType) {
      return res.status(400).json({ message: 'Missing required fields: itemId, title, and mediaType' });
    }
    
    // Ensure itemId is a number for consistent storage and querying
    const numericItemId = Number(itemId);
    if (isNaN(numericItemId)) {
      return res.status(400).json({ message: 'Invalid itemId: must be a number' });
    }

    // Check if item already exists in watchlist
    const existingItem = await db.collection("watchlist")
      .where("userId", "==", userId)
      .where("itemId", "==", numericItemId)
      .get();
    
    if (!existingItem.empty) {
      return res.status(409).json({ message: 'Item already in watchlist' });
    }
    
    // Create watchlist item
    const watchlistItem = {
      userId,
      ...createContentItem({ itemId: numericItemId, title, mediaType, posterPath, backdropPath, overview, releaseDate, voteAverage, voteCount, genreIds })
    };
    
    const docRef = await db.collection("watchlist").add(watchlistItem);
    
    res.status(201).json({ 
      message: 'Item added to watchlist successfully',
      id: docRef.id,
      item: watchlistItem
    });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    res.status(500).json({ message: 'Failed to add item to watchlist', error: error.message });
  }
};

// Remove item from watchlist
export const removeFromWatchlist = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { itemId } = req.params;
    
    // Ensure itemId is a number for consistent querying
    const numericItemId = Number(itemId);
    if (isNaN(numericItemId)) {
      return res.status(400).json({ message: 'Invalid itemId: must be a number' });
    }

    // Find the watchlist item
    const snapshot = await db.collection("watchlist")
      .where("userId", "==", userId)
      .where("itemId", "==", numericItemId)
      .get();
    
    if (snapshot.empty) {
      return res.status(404).json({ message: 'Item not found in watchlist' });
    }
    
    // Delete the item
    const deletePromises = snapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
    
    res.json({ message: 'Item removed from watchlist successfully' });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    res.status(500).json({ message: 'Failed to remove item from watchlist', error: error.message });
  }
};

// Get user's watchlist
export const getWatchlist = async (req, res) => {
  try {
    const requestingUserId = req.user.uid;
    const targetUserId = req.params.userId || requestingUserId;
    
    // Validate user access
    const hasAccess = await validateUserAccess(requestingUserId, targetUserId);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied. You can only view your own watchlist unless you are an admin.' });
    }
    
    const snapshot = await db.collection("watchlist")
      .where("userId", "==", targetUserId)
      .get();
    
    const watchlist = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      addedAt: doc.data().addedAt?.toDate().toISOString() || null
    }));
    
    res.json({ watchlist, count: watchlist.length });
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({ message: 'Failed to fetch watchlist', error: error.message });
  }
};

// Check if item is in watchlist
export const checkInWatchlist = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { itemId } = req.params;
    
    // Ensure itemId is a number for consistent querying
    const numericItemId = Number(itemId);
    if (isNaN(numericItemId)) {
      console.error(`Backend checkInWatchlist: Invalid itemId (not a number): ${itemId}`);
      return res.status(400).json({ message: 'Invalid itemId: must be a number' });
    }

    const snapshot = await db.collection("watchlist")
      .where("userId", "==", userId)
      .where("itemId", "==", numericItemId)
      .get();
    
    res.json({ inWatchlist: !snapshot.empty });
  } catch (error) {
    console.error('Error checking watchlist:', error);
    res.status(500).json({ message: 'Failed to check watchlist status', error: error.message });
  }
};

// LIKED CONTENT FUNCTIONS

// Add item to liked content
export const addToLiked = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { itemId, title, mediaType, posterPath, backdropPath, overview, releaseDate, voteAverage, voteCount, genreIds } = req.body;
    
    // Validate required fields
    if (!itemId || !title || !mediaType) {
      return res.status(400).json({ message: 'Missing required fields: itemId, title, and mediaType' });
    }
    
    // Ensure itemId is a number for consistent storage and querying
    const numericItemId = Number(itemId);
    if (isNaN(numericItemId)) {
      return res.status(400).json({ message: 'Invalid itemId: must be a number' });
    }

    // Check if item already exists in liked content
    const existingItem = await db.collection("likedContent")
      .where("userId", "==", userId)
      .where("itemId", "==", numericItemId)
      .get();
    
    if (!existingItem.empty) {
      return res.status(409).json({ message: 'Item already in liked content' });
    }
    
    // Create liked content item
    const likedItem = {
      userId,
      ...createContentItem({ itemId: numericItemId, title, mediaType, posterPath, backdropPath, overview, releaseDate, voteAverage, voteCount, genreIds })
    };
    
    const docRef = await db.collection("likedContent").add(likedItem);
    
    res.status(201).json({ 
      message: 'Item added to liked content successfully',
      id: docRef.id,
      item: likedItem
    });
  } catch (error) {
    console.error('Error adding to liked content:', error);
    res.status(500).json({ message: 'Failed to add item to liked content', error: error.message });
  }
};

// Remove item from liked content
export const removeFromLiked = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { itemId } = req.params;
    
    // Ensure itemId is a number for consistent querying
    const numericItemId = Number(itemId);
    if (isNaN(numericItemId)) {
      return res.status(400).json({ message: 'Invalid itemId: must be a number' });
    }

    // Find the liked content item
    const snapshot = await db.collection("likedContent")
      .where("userId", "==", userId)
      .where("itemId", "==", numericItemId)
      .get();
    
    if (snapshot.empty) {
      return res.status(404).json({ message: 'Item not found in liked content' });
    }
    
    // Delete the item
    const deletePromises = snapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
    
    res.json({ message: 'Item removed from liked content successfully' });
  } catch (error) {
    console.error('Error removing from liked content:', error);
    res.status(500).json({ message: 'Failed to remove item from liked content', error: error.message });
  }
};

// Get user's liked content
export const getLikedContent = async (req, res) => {
  try {
    const requestingUserId = req.user.uid;
    const targetUserId = req.params.userId || requestingUserId;
    
    // Validate user access
    const hasAccess = await validateUserAccess(requestingUserId, targetUserId);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied. You can only view your own liked content unless you are an admin.' });
    }
    
    const snapshot = await db.collection("likedContent")
      .where("userId", "==", targetUserId)
      .get();
    
    const likedContent = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      addedAt: doc.data().addedAt?.toDate().toISOString() || null
    }));
    
    res.json({ likedContent, count: likedContent.length });
  } catch (error) {
    console.error('Error fetching liked content:', error);
    res.status(500).json({ message: 'Failed to fetch liked content', error: error.message });
  }
};

// Check if item is liked
export const checkIsLiked = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { itemId } = req.params;

    // Ensure itemId is a number for consistent querying
    const numericItemId = Number(itemId);
    if (isNaN(numericItemId)) {
      console.error(`Backend checkIsLiked: Invalid itemId (not a number): ${itemId}`);
      return res.status(400).json({ message: 'Invalid itemId: must be a number' });
    }

    const snapshot = await db.collection("likedContent")
      .where("userId", "==", userId)
      .where("itemId", "==", numericItemId)
      .get();
    
    res.json({ isLiked: !snapshot.empty });
  } catch (error) {
    console.error('Error checking liked status:', error);
    res.status(500).json({ message: 'Failed to check liked status', error: error.message });
  }
};

// COMBINED FUNCTIONS

// Get all user content (watchlist + liked)
export const getAllUserContent = async (req, res) => {
  try {
    const requestingUserId = req.user.uid;
    const targetUserId = req.params.userId || requestingUserId;
    
    // Validate user access
    const hasAccess = await validateUserAccess(requestingUserId, targetUserId);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied. You can only view your own content unless you are an admin.' });
    }
    
    // Fetch watchlist and liked content in parallel
    const [watchlistSnapshot, likedSnapshot] = await Promise.all([
      db.collection("watchlist")
        .where("userId", "==", targetUserId)
        .get(),
      db.collection("likedContent")
        .where("userId", "==", targetUserId)
        .get()
    ]);
    
    const watchlist = watchlistSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      addedAt: doc.data().addedAt?.toDate().toISOString() || null
    }));
    
    const likedContent = likedSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      addedAt: doc.data().addedAt?.toDate().toISOString() || null
    }));
    
    res.json({ 
      watchlist, 
      likedContent,
      counts: {
        watchlist: watchlist.length,
        liked: likedContent.length,
        total: watchlist.length + likedContent.length
      }
    });
  } catch (error) {
    console.error('Error fetching user content:', error);
    res.status(500).json({ message: 'Failed to fetch user content', error: error.message });
  }
};

// Get user content statistics
export const getUserStats = async (req, res) => {
  try {
    const requestingUserId = req.user.uid;
    const targetUserId = req.params.userId || requestingUserId;
    
    // Validate user access
    const hasAccess = await validateUserAccess(requestingUserId, targetUserId);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied. You can only view your own stats unless you are an admin.' });
    }
    
    // Get counts for both collections
    const [watchlistSnapshot, likedSnapshot] = await Promise.all([
      db.collection("watchlist").where("userId", "==", targetUserId).get(),
      db.collection("likedContent").where("userId", "==", targetUserId).get()
    ]);
    
    // Calculate media type breakdown
    const watchlistByType = { movie: 0, tv: 0 };
    const likedByType = { movie: 0, tv: 0 };
    
    watchlistSnapshot.docs.forEach(doc => {
      const mediaType = doc.data().mediaType;
      if (watchlistByType.hasOwnProperty(mediaType)) {
        watchlistByType[mediaType]++;
      }
    });
    
    likedSnapshot.docs.forEach(doc => {
      const mediaType = doc.data().mediaType;
      if (likedByType.hasOwnProperty(mediaType)) {
        likedByType[mediaType]++;
      }
    });
    
    const stats = {
      watchlist: {
        total: watchlistSnapshot.size,
        movies: watchlistByType.movie,
        tvShows: watchlistByType.tv
      },
      liked: {
        total: likedSnapshot.size,
        movies: likedByType.movie,
        tvShows: likedByType.tv
      },
      overall: {
        totalItems: watchlistSnapshot.size + likedSnapshot.size,
        totalMovies: watchlistByType.movie + likedByType.movie,
        totalTvShows: watchlistByType.tv + likedByType.tv
      }
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Failed to fetch user stats', error: error.message });
  }
};