import axios from 'axios';

const API_KEY = process.env.MOVIE_DB_API_KEY; // Ensure the API key is in your .env
const BEARER_TOKEN = process.env.MOVIE_DB_BEARER_TOKEN; // Set Bearer Token in your .env

// Get popular movies using Bearer Token
export const getPopularMovies = async (req, res) => {
  if (!BEARER_TOKEN) {
    return res.status(500).send('Bearer Token is missing');
  }

  try {
    const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
      },
      params: {
        language: 'en-US',
        page: 1,
      },
    });
    res.json(response.data.results); // Send the popular movies list as a JSON response
  } catch (error) {
    console.error('Error fetching popular movies:', error.response?.data || error.message);
    res.status(500).send('Error fetching popular movies');
  }
};
