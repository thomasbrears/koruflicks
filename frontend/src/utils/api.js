/**
 * TMDB API Integration
 */

// URL & API Key for TMDB API requests
const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

/**
 * Core function to fetch data from the TMDB API
 * 
 * @param {string} endpoint - The API endpoint to fetch from (without the base URL)
 * @returns {Promise<Object>} - JSON response from the API
 * @throws {Error} - If the fetch fails or returns a non-OK status
 */
export const fetchFromAPI = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Basic endpoint functions for fetching different content types

/**
 * Fetch popular movies from TMDB API
 * @returns {Promise<Object>} - Popular movies data
 */
export const getPopularMovies = () => fetchFromAPI("movie/popular");

/**
 * Fetch popular TV shows from TMDB API
 * @returns {Promise<Object>} - Popular TV shows data
 */
export const getPopularShows = () => fetchFromAPI("tv/popular");

/**
 * Fetch trending movies of the day from TMDB API
 * @returns {Promise<Object>} - Trending movies data
 */
export const getTrendingMovies = () => fetchFromAPI("trending/movie/day");

/**
 * Fetch trending TV shows of the day from TMDB API
 * @returns {Promise<Object>} - Trending TV shows data
 */
export const getTrendingShows = () => fetchFromAPI("trending/tv/day");

/**
 * Fetch top rated movies from TMDB API
 * @returns {Promise<Object>} - Top rated movies data
 */
export const getTopRatedMovies = () => fetchFromAPI("movie/top_rated");

/**
 * Fetch top rated TV shows from TMDB API
 * @returns {Promise<Object>} - Top rated TV shows data
 */
export const getTopRatedShows = () => fetchFromAPI("tv/top_rated");

/**
 * Fetch and combine popular movies and shows
 * 
 * @returns {Promise<Array>} - Array containing a mix of popular movies and TV shows
 */
export const getPopularMoviesAndShows = async () => {
  try {
    // Fetch both movie and show data
    const movies = await getPopularMovies();
    const shows = await getPopularShows();

    // Limit to top 5 items each
    const popularMovies = movies.results.slice(0, 5);
    const popularShows = shows.results.slice(0, 5);

    // Combine both arrays
    const mixed = [...popularMovies, ...popularShows];
    return mixed;
  } catch (error) {
    console.error("Error fetching popular movies and shows:", error);
    throw error;
  }
};

/**
 * Search for movies and TV shows matching a query string
 * 
 * @param {string} query - The search term to look for
 * @param {number} page - The page number for pagination (default: 1)
 * @returns {Promise<Object>} - Combined search results with pagination info
 */
export const searchMoviesAndShows = async (query, page = 1) => {
  try {
    // Search for movies
    const movieResults = await fetchFromAPI(`search/movie?query=${encodeURIComponent(query)}&page=${page}`);
    
    // Search for TV shows
    const tvResults = await fetchFromAPI(`search/tv?query=${encodeURIComponent(query)}&page=${page}`);
    
    // Add a type property to distinguish between movies and TV shows
    const formattedMovies = movieResults.results.map(movie => ({
      ...movie,
      media_type: 'movie'
    }));
    
    const formattedTVShows = tvResults.results.map(show => ({
      ...show,
      media_type: 'tv'
    }));
    
    // Combine and sort results by popularity
    const combinedResults = [...formattedMovies, ...formattedTVShows]
      .sort((a, b) => b.popularity - a.popularity);
    
    // Return combined results with pagination info
    return {
      results: combinedResults,
      total_results: movieResults.total_results + tvResults.total_results,
      total_pages: Math.max(movieResults.total_pages, tvResults.total_pages),
      page: page
    };
  } catch (error) {
    console.error("Error searching movies and shows:", error);
    throw error;
  }
};

/**
 * Fetch trending, popular, and top-rated content and combine them
 * 
 * @returns {Promise<Array>} - Combined and sorted array of movies and TV shows
 */
export const fetchPopularContent = async () => {
  try {
    // Fetch all required content in parallel for efficiency
    const [popularMovies, popularShows, trendingMovies, trendingShows, topRatedMovies, topRatedShows] = 
      await Promise.all([
        getPopularMovies(),
        getPopularShows(),
        getTrendingMovies(),
        getTrendingShows(),
        getTopRatedMovies(),
        getTopRatedShows()
      ]);
    
    // Add media_type to each item for proper identification later
    const formattedPopularMovies = popularMovies.results.map(item => ({ ...item, media_type: 'movie' }));
    const formattedPopularShows = popularShows.results.map(item => ({ ...item, media_type: 'tv' }));
    const formattedTrendingMovies = trendingMovies.results.map(item => ({ ...item, media_type: 'movie' }));
    const formattedTrendingShows = trendingShows.results.map(item => ({ ...item, media_type: 'tv' }));
    const formattedTopRatedMovies = topRatedMovies.results.map(item => ({ ...item, media_type: 'movie' }));
    const formattedTopRatedShows = topRatedShows.results.map(item => ({ ...item, media_type: 'tv' }));

    // Combine all results
    const allContent = [
      ...formattedPopularMovies,
      ...formattedPopularShows,
      ...formattedTrendingMovies,
      ...formattedTrendingShows,
      ...formattedTopRatedMovies,
      ...formattedTopRatedShows
    ];

    // Remove duplicates (in case a title appears in multiple categories)
    const uniqueContent = [];
    const seenIds = new Set();

    for (const item of allContent) {
      const uniqueId = `${item.media_type}-${item.id}`;
      if (!seenIds.has(uniqueId)) {
        seenIds.add(uniqueId);
        uniqueContent.push(item);
      }
    }

    // Sort by popularity and return
    return uniqueContent.sort((a, b) => b.popularity - a.popularity);
  } catch (error) {
    console.error('Error fetching popular content:', error);
    throw error;
  }
};

/**
 * Fetch content by genre for both movies and TV shows
 * 
 * @param {string} genreType - Genre type (e.g., 'action', 'comedy', 'horror')
 * @returns {Promise<Array>} - Array of movies and TV shows for the specified genre
 */
export const fetchGenreContent = async (genreType) => {
  // Map genre names to TMDb genre IDs
  const genreMap = {
    action: 28,
    adventure: 12,
    animation: 16,
    comedy: 35,
    crime: 80,
    documentary: 99,
    drama: 18,
    family: 10751,
    fantasy: 14,
    history: 36,
    horror: 27,
    music: 10402,
    mystery: 9648,
    romance: 10749,
    scifi: 878, 
    thriller: 53,
    war: 10752,
    western: 37
  };

  const genreId = genreMap[genreType];

  if (!genreId) {
    throw new Error(`Invalid genre type: ${genreType}`);
  }

  try {
    // Fetch 2 pages of movies by genre
    const [movieResults, movieResultsPage2] = await Promise.all([
      fetchFromAPI(`discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=1`),
      fetchFromAPI(`discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=2`)
    ]);
    
    const movies = [
      ...movieResults.results, 
      ...movieResultsPage2.results
    ].map(movie => ({
      ...movie,
      media_type: 'movie'
    }));

    // Fetch 2 pages of TV shows by genre 
    const [tvResults, tvResultsPage2] = await Promise.all([
      fetchFromAPI(`discover/tv?with_genres=${genreId}&sort_by=popularity.desc&page=1`),
      fetchFromAPI(`discover/tv?with_genres=${genreId}&sort_by=popularity.desc&page=2`)
    ]);
    
    const tvShows = [
      ...tvResults.results,
      ...tvResultsPage2.results
    ].map(show => ({
      ...show,
      media_type: 'tv'
    }));

    // Combine and sort by popularity
    const combinedResults = [...movies, ...tvShows];
    return combinedResults.sort((a, b) => b.popularity - a.popularity);
  } catch (error) {
    console.error(`Error fetching ${genreType} content:`, error);
    throw error;
  }
};

/**
 * Map from category name/slug to TMDB genre ID
 * 
 * @param {string} categoryName - The category slug
 * @returns {number|null} - The corresponding genre ID or null if not found
 */
const getGenreIdFromCategory = (categoryName) => {
  // Mapping of category names to TMDB genre IDs
  const genreMap = {
    // Movie and TV genres
    'action': 28,
    'adventure': 12,
    'animation': 16,
    'comedy': 35,
    'crime': 80,
    'documentary': 99,
    'drama': 18,
    'family': 10751,
    'fantasy': 14,
    'history': 36,
    'horror': 27,
    'music': 10402,
    'mystery': 9648,
    'romance': 10749,
    'science-fiction': 878,
    'scifi': 878,
    'thriller': 53,
    'war': 10752,
    'western': 37,
    
    // TV specific genres
    'action-adventure': 10759,
    'kids': 10762,
    'news': 10763,
    'reality': 10764,
    'sci-fi-fantasy': 10765,
    'soap': 10766,
    'talk': 10767,
    'war-politics': 10768,
    
    // Additional category name variations
    'sci-fi': 878,
    'superhero': 28, // Map to action as fallback
  };
  
  return genreMap[categoryName] || null;
};

/**
 * Get content for a specific category
 * 
 * @param {string} categoryName - The category slug to fetch results for
 * @param {number} page - The page number to fetch (default: 1)
 * @returns {Promise<Object>} - Category results with pagination info
 */
export const getCategoryResults = async (categoryName, page = 1) => {
  try {
    // Convert category name to genre ID
    const genreId = getGenreIdFromCategory(categoryName);
    
    if (!genreId) {
      throw new Error(`Invalid category: ${categoryName}`);
    }
    
    // Fetch movies for this genre
    const movieResults = await fetchFromAPI(`discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=${page}`);
    
    // Fetch TV shows for this genre
    const tvResults = await fetchFromAPI(`discover/tv?with_genres=${genreId}&sort_by=popularity.desc&page=${page}`);
    
    // Add media_type to each result
    const formattedMovies = movieResults.results.map(movie => ({
      ...movie,
      media_type: 'movie'
    }));
    
    const formattedTVShows = tvResults.results.map(show => ({
      ...show,
      media_type: 'tv'
    }));
    
    // Combine results
    const combinedResults = [...formattedMovies, ...formattedTVShows];
    
    // Get current date for age calculation
    const currentDate = new Date();
    
    // Sort by a combination of popularity and recency
    combinedResults.sort((a, b) => {
      // Get release dates
      const dateA = new Date(a.release_date || a.first_air_date || '2000-01-01');
      const dateB = new Date(b.release_date || b.first_air_date || '2000-01-01');
      
      // Calculate age in days (newer = smaller number)
      const ageA = Math.floor((currentDate - dateA) / (1000 * 60 * 60 * 24));
      const ageB = Math.floor((currentDate - dateB) / (1000 * 60 * 60 * 24));
      
      // Check if either is a new release (less than 90 days old)
      const isNewA = ageA < 90;
      const isNewB = ageB < 90;
      
      // If both are new or both are old, sort by popularity
      if ((isNewA && isNewB) || (!isNewA && !isNewB)) {
        return b.popularity - a.popularity;
      }
      
      // If only one is new, prioritize it
      return isNewA ? -1 : 1;
    });
    
    // Calculate total pages based on the maximum from either movies or TV shows
    const totalResults = movieResults.total_results + tvResults.total_results;
    const totalPages = Math.max(movieResults.total_pages, tvResults.total_pages);
    
    return {
      results: combinedResults,
      total_results: totalResults,
      total_pages: totalPages,
      page: page
    };
  } catch (error) {
    console.error(`Error fetching category ${categoryName}:`, error);
    throw error;
  }
};

/**
 * Get separate results for either movies or TV shows in a specific category
 * 
 * @param {string} categoryName - The category slug
 * @param {string} mediaType - Either 'movie' or 'tv'
 * @param {number} page - The page number (default: 1)
 * @returns {Promise<Object>} - Category results for the specific media type with pagination
 */
export const getMediaTypeCategory = async (categoryName, mediaType = 'movie', page = 1) => {
  try {
    const genreId = getGenreIdFromCategory(categoryName);
    
    if (!genreId) {
      throw new Error(`Invalid category: ${categoryName}`);
    }
    
    if (mediaType !== 'movie' && mediaType !== 'tv') {
      throw new Error(`Invalid media type: ${mediaType}`);
    }
    
    const results = await fetchFromAPI(
      `discover/${mediaType}?with_genres=${genreId}&sort_by=popularity.desc&page=${page}`
    );
    
    // Add media_type to each result
    const formattedResults = results.results.map(item => ({
      ...item,
      media_type: mediaType
    }));
    
    return {
      results: formattedResults,
      total_results: results.total_results,
      total_pages: results.total_pages,
      page: page
    };
  } catch (error) {
    console.error(`Error fetching ${mediaType} category ${categoryName}:`, error);
    throw error;
  }
};

/**
 * Get featured content for a specific category
 * 
 * @param {string} categoryName - The category slug to fetch featured content for
 * @param {number} count - Number of items to return (default: 5)
 * @returns {Promise<Array>} - Array of featured items for the category
 */
export const getCategoryFeatured = async (categoryName, count = 5) => {
  try {
    // Convert category name to genre ID
    const genreId = getGenreIdFromCategory(categoryName);
    
    if (!genreId) {
      throw new Error(`Invalid category: ${categoryName}`);
    }
    
    // Fetch movies for this genre - use a higher vote count threshold to get quality content
    const movieResults = await fetchFromAPI(
      `discover/movie?with_genres=${genreId}&sort_by=popularity.desc&vote_count.gte=100&page=1`
    );
    
    // Fetch TV shows for this genre
    const tvResults = await fetchFromAPI(
      `discover/tv?with_genres=${genreId}&sort_by=popularity.desc&vote_count.gte=50&page=1`
    );
    
    // Add media_type to each result
    const formattedMovies = movieResults.results.map(movie => ({
      ...movie,
      media_type: 'movie'
    }));
    
    const formattedTVShows = tvResults.results.map(show => ({
      ...show,
      media_type: 'tv'
    }));
    
    // Combine results, sort by popularity and take the top items
    const combinedResults = [...formattedMovies, ...formattedTVShows]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, count);
    
    return combinedResults;
  } catch (error) {
    console.error(`Error fetching featured content for ${categoryName}:`, error);
    throw error;
  }
};

/**
 * Get the top movies released in the past 6 months
 * 
 * @param {number} count - Number of movies to return (default: 5)
 * @returns {Promise<Array>} - Array of recent popular movies
 */
export const getRecentTopMovies = async (count = 5) => {
  try {
    // Calculate date 6 months ago
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);
    
    // Format date as YYYY-MM-DD for API
    const fromDate = sixMonthsAgo.toISOString().split('T')[0];
    const toDate = today.toISOString().split('T')[0];
    
    // Fetch recent movies sorted by popularity with minimum vote threshold
    const recentMovies = await fetchFromAPI(
      `discover/movie?primary_release_date.gte=${fromDate}&primary_release_date.lte=${toDate}&sort_by=popularity.desc&vote_count.gte=50`
    );
    
    // Format the results with media_type and limit to requested count
    const formattedResults = recentMovies.results
      .slice(0, count)
      .map(movie => ({
        ...movie,
        media_type: 'movie'
      }));
    
    return formattedResults;
  } catch (error) {
    console.error('Error fetching recent top movies:', error);
    throw error;
  }
};

/**
 * Get featured content focusing on recent releases (past 6 months)
 * 
 * @returns {Promise<Array>} - Array of recent movies for featured display
 */
export const getRecentFeaturedContent = async () => {
  try {
    // Get recent top movies
    const recentMovies = await getRecentTopMovies(5);
    
    // Include fallback in case API returns no results
    if (!recentMovies || recentMovies.length === 0) {
      return [
        {
          id: 1,
          title: "The Gorge",
          media_type: "movie",
          popularity: 100,
          backdrop_path: `/images/placeholder/thegorge.jpg`,
          overview: "Two highly trained operatives grow close from a distance after being sent to guard opposite sides of a mysterious gorge. When an evil below emerges, they must work together to survive what lies within."
        },
      ];
    }
    
    return recentMovies;
  } catch (error) {
    console.error('Error fetching recent featured content:', error);
    throw error;
  }
};