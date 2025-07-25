import apiHandler from './apiHandler';

// Helper to prepare item data for API
const prepareItemData = (item) => {
  return {
    itemId: item.id,
    title: item.title || item.name,
    mediaType: item.media_type || (item.title ? 'movie' : 'tv'),
    posterPath: item.poster_path,
    backdropPath: item.backdrop_path,
    overview: item.overview,
    releaseDate: item.release_date || item.first_air_date,
    voteAverage: item.vote_average,
    voteCount: item.vote_count,
    genreIds: item.genre_ids || []
  };
};

// WATCHLIST API FUNCTIONS

export const addToWatchlist = async (item) => {
  return await apiHandler.post('/user-content/watchlist', prepareItemData(item));
};

export const removeFromWatchlist = async (itemId) => {
  return await apiHandler.delete(`/user-content/watchlist/${itemId}`);
};

export const getUserWatchlist = async (userId = null) => {
  const endpoint = apiHandler.buildUserUrl('/user-content/watchlist', userId);
  const result = await apiHandler.get(endpoint, { returnEmptyOnError: true });
  return result?.watchlist || [];
};

export const checkInWatchlist = async (itemId) => {
  const result = await apiHandler.get(`/user-content/watchlist/check/${itemId}`, { returnEmptyOnError: true });
  return result?.inWatchlist || false;
};

// LIKED CONTENT API FUNCTIONS

export const addToLiked = async (item) => {
  return await apiHandler.post('/user-content/liked', prepareItemData(item));
};

export const removeFromLiked = async (itemId) => {
  return await apiHandler.delete(`/user-content/liked/${itemId}`);
};

export const getUserLikedContent = async (userId = null) => {
  const endpoint = apiHandler.buildUserUrl('/user-content/liked', userId);
  const result = await apiHandler.get(endpoint, { returnEmptyOnError: true });
  return result?.likedContent || [];
};

export const checkIsLiked = async (itemId) => {
  const result = await apiHandler.get(`/user-content/liked/check/${itemId}`, { returnEmptyOnError: true });
  return result?.isLiked || false;
};

// COMBINED USER CONTENT API FUNCTIONS

export const getAllUserContent = async (userId = null) => {
  const endpoint = apiHandler.buildUserUrl('/user-content/all', userId);
  const result = await apiHandler.get(endpoint, { returnEmptyOnError: true });
  return result || { 
    watchlist: [], 
    likedContent: [], 
    counts: { watchlist: 0, liked: 0, total: 0 } 
  };
};

export const getUserContentStats = async (userId = null) => {
  const endpoint = apiHandler.buildUserUrl('/user-content/stats', userId);
  const result = await apiHandler.get(endpoint, { returnEmptyOnError: true });
  return result || { 
    watchlist: { total: 0, movies: 0, tvShows: 0 }, 
    liked: { total: 0, movies: 0, tvShows: 0 }, 
    overall: { totalItems: 0, totalMovies: 0, totalTvShows: 0 } 
  };
};

// Legacy object exports for compatibility (if needed)
export const watchlistApi = {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist: getUserWatchlist,
  checkInWatchlist
};

export const likedContentApi = {
  addToLiked,
  removeFromLiked,
  getLikedContent: getUserLikedContent,
  checkIsLiked
};

export const userContentApi = {
  getAllUserContent,
  getUserStats: getUserContentStats
};