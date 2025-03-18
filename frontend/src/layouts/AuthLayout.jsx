import React, { useState, useEffect } from 'react';
import { Button, ConfigProvider, Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import Loading from '../components/Loading';
import { getRecentTopMovies } from '../utils/api';

// Create a cache object at the module level
const recentMoviesCache = {
  data: null,
  timestamp: null,
  expiryTime: 30 * 60 * 1000, // 30 minutes in milliseconds
};

// Fallback data
const fallbackMovies = [
  { id: 1, title: "The Gorge", image: "/images/placeholder/thegorge.jpg", overview: "Two highly trained operatives grow close from a distance after being sent to guard opposite sides of a mysterious gorge. When an evil below emerges, they must work together to survive what lies within." },
  { id: 2, title: "Star Wars: Episode III - Revenge of the Sith", image: "/images/placeholder/starwars.jpg", overview: "The evil Darth Sidious enacts his final plan for unlimited power -- and the heroic Jedi Anakin Skywalker must choose a side..." },
  { id: 3, title: "Micky 17", image: "/images/placeholder/micky17.jpg", overview: "Unlikely hero Mickey Barnes finds himself in the extraordinary circumstance of working for an employer who demands the ultimate commitment to the job… to die, for a living." },
  { id: 4, title: "Reacher", image: "/images/placeholder/reacher.jpg", overview: "Jack Reacher, a veteran military police investigator, has just recently entered civilian life. Reacher is a drifter, carrying no phone and the barest of essentials as he travels the country and explores the nation he once served." },
  { id: 5, title: "Kingsman: The Golden Circle", image: "/images/placeholder/kingsman.jpg", overview: "When an attack on the Kingsman headquarters takes place and a new villain rises, Eggsy and Merlin are forced to work together with the American agency known as the Statesman to save the world." }
];

/**
 * AuthLayout - Common layout for all authentication pages
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content for the auth form
 * @param {string} props.title - Page title (for metadata)
 * @param {string} props.heading - Main heading text displayed on the page
 * @param {boolean} props.loading - Loading state
 * @param {string} props.loadingMessage - Message to display during loading
 */
function AuthLayout({ children, title, heading, loading, loadingMessage }) {
  const navigate = useNavigate();
  const [allMovies, setAllMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Function to fetch recent movies
    const getContent = async () => {
      try {
        setIsLoading(true);
        
        // Check if we have valid cached data
        const now = new Date().getTime();
        if (
          recentMoviesCache.data && 
          recentMoviesCache.timestamp && 
          (now - recentMoviesCache.timestamp < recentMoviesCache.expiryTime)
        ) {
          // Use cached data
          const movies = recentMoviesCache.data;
          processContent(movies);
          setIsLoading(false);
          return;
        }
        
        // Fetch new data if cache is empty or expired
        // Only get movies from the past 6 months
        const recentMovies = await getRecentTopMovies(10); // Get extra in case we need more
        
        // Update the cache
        recentMoviesCache.data = recentMovies;
        recentMoviesCache.timestamp = now;
        
        processContent(recentMovies);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching recent movies:", error);
        // Fallback to static data in case of error
        processContent(fallbackMovies);
        setIsLoading(false);
      }
    };
    
    // Helper to process content from results
    const processContent = (movies) => {
      if (!movies || movies.length === 0) {
        const processed = fallbackMovies.map(movie => ({
          ...movie,
          genre: "Movie"
        }));
        
        setFeaturedMovie(processed[0]);
        setRecommendedMovies(processed.slice(1));
        setAllMovies(processed);
        return;
      }
      
      // Format all content for consistent structure
      const processedMovies = movies.slice(0, 5).map(item => ({
        id: item.id,
        title: item.title || item.name,
        genre: "Movie", // Always set to Movie since we're only fetching movies
        image: item.backdrop_path 
          ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}`
          : "/api/placeholder/640/360",
        thumbnail: item.backdrop_path 
          ? `https://image.tmdb.org/t/p/w300${item.backdrop_path}`
          : "/api/placeholder/300/169",
        overview: item.overview || "No description available.",
        releaseDate: item.release_date
      }));
      
      // Set the first one as featured
      setFeaturedMovie(processedMovies[0]);
      
      // Set the rest as recommended
      setRecommendedMovies(processedMovies.slice(1));
      
      // Store all movies for easy selection
      setAllMovies(processedMovies);
    };
    
    getContent();
  }, []);

  // Function to handle movie selection
  const handleMovieSelect = (movie) => {
    // Set the selected movie as featured
    setFeaturedMovie(movie);
    
    // Update recommended movies to exclude the selected one
    setRecommendedMovies(allMovies.filter(item => item.id !== movie.id));
  };

  // Format the release date for display
  const formatReleaseDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            colorBgContainer: '#1f2937',
            colorText: 'white',
            colorTextPlaceholder: 'rgba(255, 255, 255, 0.5)',
            colorBorder: '#374151',
            activeBorderColor: '#10B981',
            hoverBorderColor: '#10B981',
          },
          Button: {
            colorPrimary: '#10B981',
            colorPrimaryHover: '#059669',
            colorPrimaryActive: '#059669',
          },
          Skeleton: {
            colorFill: '#374151',
            colorFillContent: '#4B5563',
          }
        },
      }}
    >
      <div className="min-h-screen flex items-center justify-center bg-black px-4 py-12">
        {loading && <Loading message={loadingMessage} />}
        <Button 
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 bg-gray-800 text-white border border-gray-700 hover:bg-gray-700"
          icon={<HomeOutlined />}
        >
          Home Page
        </Button>
        
        <div className="w-full max-w-4xl flex flex-col rounded-lg overflow-hidden">
          {/* Logo Section - Now spans both sides */}
          <div className="flex justify-center py-6 bg-gray-900 border-b border-gray-800">
            <img src="/images/KF-WhiteText-GreenKoru-TransBG.svg" alt="Koru Flicks Logo" className="h-12" />
          </div>
          
          <div className="flex">
            {/* Left Side - Auth Form */}
            <div className="w-full md:w-1/2 p-8 bg-gray-900 shadow-lg border-r border-gray-800">
              <h1 className="text-3xl text-white text-center mb-6">{heading}</h1>
              {children}
            </div>
            
            {/* Right Side - Featured Content */}
            <div className="hidden md:flex md:w-1/2 bg-gray-800 flex-col justify-between">
              <div className="flex-grow overflow-auto">
                <div className="w-full">
                  {isLoading ? (
                    <Skeleton.Image className="w-full aspect-video" active />
                  ) : (
                    <div className="w-full aspect-video bg-gray-700 overflow-hidden">
                      <img 
                        src={featuredMovie?.image} 
                        alt={featuredMovie?.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  {isLoading ? (
                    <>
                      <Skeleton.Input active style={{ width: '70%', height: 24 }} />
                      <Skeleton active paragraph={{ rows: 2 }} title={false} className="mt-2" />
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl text-white mb-2">
                        {featuredMovie?.title}
                      </h3>
                      
                      <div className="mb-4">
                        <p className="text-gray-300 mt-2 line-clamp-3">
                          <span className="text-LGreen">Movie</span>
                          {featuredMovie?.releaseDate && (
                            <span className="text-white"> • {formatReleaseDate(featuredMovie.releaseDate)}</span>
                          )} • {featuredMovie?.overview}
                        </p>
                      </div>
                    </>
                  )}
                  
                  <h4 className="text-white text-lg mb-3">More Recent Movies</h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {isLoading ? (
                      // Skeleton for recommended movies
                      Array(4).fill(0).map((_, i) => (
                        <Skeleton.Image key={i} className="aspect-video" active />
                      ))
                    ) : (
                      // Actual recommended movies
                      recommendedMovies.map((movie) => (
                        <div 
                          key={movie.id} 
                          className="aspect-video bg-gray-700 rounded-lg overflow-hidden cursor-pointer relative"
                          onClick={() => handleMovieSelect(movie)}
                        >
                          <img 
                            src={movie.thumbnail} 
                            alt={movie.title}
                            className="w-full h-full object-cover" 
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-sm font-medium px-2 text-center">{movie.title}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-700">
                <p className="text-gray-400 text-sm text-center">
                  Join Koru Flicks to access our full catalog of top recent movies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default AuthLayout;