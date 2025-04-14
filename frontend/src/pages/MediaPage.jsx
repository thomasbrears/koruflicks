import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Card, Skeleton, Row, Col, Empty } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import HeroSlider from '../components/HeroSlider';
import SearchBar from '../components/SearchBar';
import { 
  getTopRatedMovies, 
  getPopularMovies, 
  getTrendingMovies,
  getTopRatedShows,
  getPopularShows,
  getTrendingShows,
  getMediaTypeCategory
} from '../utils/api';

const { Text } = Typography;

const MediaPage = ({ mediaType }) => {
  // Default to 'movie' if not specified
  const type = mediaType || 'movie';
  const isMovie = type === 'movie';
  
  // State for different content types
  const [trendingContent, setTrendingContent] = useState([]);
  const [popularContent, setPopularContent] = useState([]);
  const [topRatedContent, setTopRatedContent] = useState([]);
  const [genreContent, setGenreContent] = useState(isMovie ? {
    action: [],
    comedy: [],
    drama: [],
    scifi: [],
    horror: []
  } : {
    drama: [],
    comedy: [],
    'action-adventure': [],
    'sci-fi-fantasy': [],
    crime: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredContent, setFeaturedContent] = useState([]);

  // Page title and labels based on media type
  const pageTitle = isMovie ? 'Movies' : 'TV Series';
  const mediaTypeLabel = isMovie ? 'Movie' : 'TV Series';
  const dateField = isMovie ? 'release_date' : 'first_air_date';
  const titleField = isMovie ? 'title' : 'name';
  const placeholderEmoji = isMovie ? '🎬' : '📺';

  // Fetch all content on component mount
  useEffect(() => {
    fetchAllContent();
  }, [mediaType]); // Re-fetch when mediaType changes

  // Function to fetch all content based on media type
  const fetchAllContent = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error state on new fetch
      
      // Determine which API functions to call based on media type
      const getTrending = isMovie ? getTrendingMovies : getTrendingShows;
      const getPopular = isMovie ? getPopularMovies : getPopularShows;
      const getTopRated = isMovie ? getTopRatedMovies : getTopRatedShows;
      
      // Fetch trending, popular, and top-rated content in parallel
      const [trending, popular, topRated] = await Promise.all([
        getTrending(),
        getPopular(),
        getTopRated()
      ]);
      
      // Format results to include media_type
      const formatContent = (content) => 
        content.results.map(item => ({
          ...item,
          media_type: type
        }));
      
      const formattedTrending = formatContent(trending);
      const formattedPopular = formatContent(popular);
      const formattedTopRated = formatContent(topRated);
      
      // Set state with formatted results
      setTrendingContent(formattedTrending);
      setPopularContent(formattedPopular);
      setTopRatedContent(formattedTopRated);
      
      // Set featured content from top trending items
      setFeaturedContent(formattedTrending.slice(0, 5));
      
      // Fetch genre-specific content - different genres for movies vs TV
      const genres = isMovie 
        ? ['action', 'comedy', 'drama', 'scifi', 'horror'] 
        : ['drama', 'comedy', 'action-adventure', 'sci-fi-fantasy', 'crime'];
      
      const genrePromises = genres.map(genre => 
        getMediaTypeCategory(genre, type, 1)
          .then(data => {
            return { genre, data: data.results };
          })
          .catch(err => {
            console.error(`Error fetching ${genre} ${pageTitle.toLowerCase()}:`, err);
            return { genre, data: [] };
          })
      );
      
      // Wait for all genre fetches to complete
      const results = await Promise.all(genrePromises);
      
      // Update genre content state
      const genreData = {};
      results.forEach(({ genre, data }) => {
        genreData[genre] = data;
      });
      
      setGenreContent(genreData);
      setError(null);
    } catch (err) {
      console.error(`Error fetching ${pageTitle.toLowerCase()}:`, err);
      setError(`Failed to fetch ${pageTitle.toLowerCase()}. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to calculate release year from date
  const getYear = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).getFullYear();
  };

  // Function to get poster URL
  const getPosterUrl = (path) => {
    if (!path) return '/images/no-poster.png';
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  // Function to render a placeholder for missing images
  const renderPlaceholder = (title) => {
    return (
      <div 
        style={{ 
          height: 280, 
          background: 'linear-gradient(to bottom, #1a1a1a, #111)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          textAlign: 'center'
        }}
      >
        <div style={{ 
          fontSize: '48px', 
          marginBottom: '16px',
          opacity: 0.6
        }}>
          {placeholderEmoji}
        </div>
        <Text style={{
          color: '#999',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          No image available
        </Text>
      </div>
    );
  };

  // Function to format rating for display
  const formatRating = (rating) => {
    if (rating === '' || rating === undefined || rating === null || isNaN(rating)) {
      return 'N/A';
    }
    
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    return numRating.toFixed(1);
  };

  // Generate skeleton cards for loading state
  const renderSkeletons = (count = 10) => {
    return Array(count).fill(null).map((_, index) => (
      <div className="inline-block min-w-[180px] sm:min-w-[200px] md:min-w-[220px] px-2" key={`skeleton-${index}`}>
        <Card
          hoverable
          className="bg-black border border-gray-800 rounded-lg"
          cover={
            <div style={{
              backgroundColor: '#111',
              height: 280,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <Skeleton.Avatar
                active
                size={64}
                shape="square"
                style={{
                  backgroundColor: '#222',
                  '--ant-skeleton-color': '#333'
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black via-opacity-80 to-transparent">
                <Skeleton.Input
                  style={{
                    width: '100%',
                    height: 22,
                    marginBottom: '4px',
                    '--ant-skeleton-title-background': '#222',
                  }}
                  active
                />
                <Skeleton.Input
                  style={{
                    width: '80%',
                    height: 22,
                    '--ant-skeleton-title-background': '#222',
                  }}
                  active
                />
              </div>
            </div>
          }
          bodyStyle={{
            padding: '12px',
            backgroundColor: '#111',
            borderTop: '1px solid #222'
          }}
        >
          <div className="flex justify-between">
            <Skeleton.Input
              style={{
                width: '40%',
                height: 16,
                '--ant-skeleton-title-background': '#222',
              }}
              active
            />
            <Skeleton.Input
              style={{
                width: '25%',
                height: 16,
                '--ant-skeleton-title-background': '#222',
              }}
              active
            />
          </div>
        </Card>
      </div>
    ));
  };

  // Scroll a carousel container horizontally with looping
  const scrollContainer = (containerId, direction) => {
    const container = document.getElementById(containerId);
    if (container) {
      const scrollAmount = container.offsetWidth * 0.75;
      let scrollTo;
      
      // Calculate new scroll position
      if (direction === 'left') {
        scrollTo = container.scrollLeft - scrollAmount;
        
        // If at or near the beginning, loop to the end
        if (scrollTo <= 0) {
          container.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
          
          setTimeout(() => {
            const maxScroll = container.scrollWidth - container.clientWidth;
            container.scrollLeft = maxScroll;
          }, 400);
          return;
        }
      } else {
        scrollTo = container.scrollLeft + scrollAmount;
        
        // If at or near the end, loop to the beginning
        if (scrollTo >= container.scrollWidth - container.clientWidth - 50) {
          container.scrollTo({
            left: container.scrollWidth,
            behavior: 'smooth'
          });
          
          setTimeout(() => {
            container.scrollLeft = 0;
          }, 400);
          return;
        }
      }
      
      // Regular scroll if not looping
      container.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  // Render content cards in a horizontal scroll container
  const renderContentScroll = (contentItems, sectionId) => {
    const items = contentItems || [];
    
    if (items.length === 0) {
      return (
        <div className="w-full">
          <Empty 
            description={<span style={{ color: 'gray' }}>No content available</span>}
            className="my-4"
          />
        </div>
      );
    }
    
    return (
      <div className="relative">
        {/* Scroll left button */}
        <button 
          onClick={() => scrollContainer(sectionId, 'left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 hover:bg-opacity-90 text-white z-10 rounded-full w-10 h-10 flex items-center justify-center shadow-lg border border-gray-700 -ml-5 opacity-90 hover:opacity-100"
          aria-label="Scroll left"
        >
          <LeftOutlined />
        </button>
        
        {/* Horizontal scrolling container */}
        <div 
          id={sectionId}
          className="flex overflow-x-auto pb-4 pt-2 hide-scrollbar scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item, index) => (
            <div 
              className="inline-block min-w-[180px] sm:min-w-[200px] md:min-w-[220px] px-2" 
              key={`${sectionId}-${item.id}-${index}`}
            >
              <Card
                hoverable
                className="bg-black border border-gray-800 overflow-hidden rounded-lg h-full transition-all duration-300 hover:border-LGreen"
                cover={
                  <div style={{ position: 'relative' }}>
                    {item.poster_path ? (
                      <img
                        alt={item[titleField]}
                        src={getPosterUrl(item.poster_path)}
                        style={{ height: 280, objectFit: 'cover', width: '100%' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentNode.appendChild(
                            document.createRange().createContextualFragment(
                              renderPlaceholder(item[titleField]).outerHTML
                            )
                          );
                        }}
                      />
                    ) : renderPlaceholder(item[titleField])}
                    <div className="absolute bottom-0 left-0 right-0 p-4 pt-16 bg-gradient-to-t from-black via-black via-opacity-60 to-transparent">
                      <Text style={{
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        lineHeight: '1.3',
                        display: 'block',
                        marginBottom: '4px',
                        WebkitLineClamp: 2,
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {item[titleField]}
                      </Text>
                    </div>
                  </div>
                }
                bodyStyle={{
                  padding: '12px',
                  backgroundColor: '#111',
                  color: 'white',
                  borderTop: '1px solid #222'
                }}
                onClick={() => window.location.href = `/${type}/${item.id}`}
              >
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <span>{getYear(item[dateField])}</span>
                    <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                    <span className="text-LGreen">{mediaTypeLabel}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span>{formatRating(item.vote_average)}</span>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
        
        {/* Scroll right button */}
        <button 
          onClick={() => scrollContainer(sectionId, 'right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 hover:bg-opacity-90 text-white z-10 rounded-full w-10 h-10 flex items-center justify-center shadow-lg border border-gray-700 -mr-5 opacity-90 hover:opacity-100"
          aria-label="Scroll right"
        >
          <RightOutlined />
        </button>
      </div>
    );
  };

  // Section header with See All link
  const SectionHeader = ({ title, genre }) => (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-3xl text-white">
        {title}
      </h1>
      {genre ? (
        <a 
          href={`/categories/${genre}?mediaType=${type}`} 
          className="text-LGreen hover:text-green-300 transition-colors text-sm font-semibold"
        >
          See All →
        </a>
      ) : (
        <a 
          href={`/${isMovie ? 'movies' : 'series'}`} 
          className="text-LGreen hover:text-green-300 transition-colors text-sm font-semibold"
        >
          See All →
        </a>
      )}
    </div>
  );

  // Hide scrollbars
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Generate section titles based on media type
  const sectionTitles = {
    trending: `Trending ${pageTitle}`,
    popular: `Popular ${pageTitle}`,
    topRated: `Top Rated ${pageTitle}`,
    action: 'Action Movies',
    comedy: 'Comedy',
    drama: 'Drama',
    scifi: 'Sci-Fi Movies',
    horror: 'Horror Movies',
    'action-adventure': 'Action & Adventure',
    'sci-fi-fantasy': 'Sci-Fi & Fantasy',
    crime: 'Crime'
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Slider with featured content */}
      <div className="w-full">
        <HeroSlider 
          items={featuredContent} 
          pageType={isMovie ? 'movies' : 'series'}
          loading={loading}
        />
      </div>

      {/* Popular Categories Bar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 bg-black">
        <SearchBar />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trending Content */}
        <section className="mb-12">
          <SectionHeader title={sectionTitles.trending} />
          
          {loading ? (
            <div className="overflow-x-auto pb-4 hide-scrollbar">
              <div className="flex">
                {renderSkeletons(12)}
              </div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-900 bg-opacity-20 border border-red-800 rounded-lg text-red-400">
              {error}
            </div>
          ) : (
            renderContentScroll(trendingContent, `trending-${type}-scroll`)
          )}
        </section>

        {/* Popular Content */}
        <section className="mb-12">
          <SectionHeader title={sectionTitles.popular} />
          
          {loading ? (
            <div className="overflow-x-auto pb-4 hide-scrollbar">
              <div className="flex">
                {renderSkeletons(12)}
              </div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-900 bg-opacity-20 border border-red-800 rounded-lg text-red-400">
              {error}
            </div>
          ) : (
            renderContentScroll(popularContent, `popular-${type}-scroll`)
          )}
        </section>

        {/* Top Rated Content */}
        <section className="mb-12">
          <SectionHeader title={sectionTitles.topRated} />
          
          {loading ? (
            <div className="overflow-x-auto pb-4 hide-scrollbar">
              <div className="flex">
                {renderSkeletons(12)}
              </div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-900 bg-opacity-20 border border-red-800 rounded-lg text-red-400">
              {error}
            </div>
          ) : (
            renderContentScroll(topRatedContent, `top-rated-${type}-scroll`)
          )}
        </section>

        {/* Genre-specific Rows */}
        {!loading && !error && (
          <>
            {/* The order of genres is different based on media type for better user experience */}
            {isMovie ? (
              <>
                {/* Action Content */}
                <section className="mb-12">
                  <SectionHeader 
                    title={sectionTitles.action} 
                    genre="action"
                  />
                  {renderContentScroll(genreContent.action, `action-${type}-scroll`)}
                </section>

                {/* Comedy Content */}
                <section className="mb-12">
                  <SectionHeader 
                    title={sectionTitles.comedy} 
                    genre="comedy"
                  />
                  {renderContentScroll(genreContent.comedy, `comedy-${type}-scroll`)}
                </section>

                {/* Sci-Fi Content */}
                <section className="mb-12">
                  <SectionHeader 
                    title={sectionTitles.scifi} 
                    genre="scifi"
                  />
                  {renderContentScroll(genreContent.scifi, `scifi-${type}-scroll`)}
                </section>

                {/* Horror Content */}
                <section className="mb-12">
                  <SectionHeader 
                    title={sectionTitles.horror} 
                    genre="horror"
                  />
                  {renderContentScroll(genreContent.horror, `horror-${type}-scroll`)}
                </section>

                {/* Drama Content */}
                <section className="mb-12">
                  <SectionHeader 
                    title={sectionTitles.drama} 
                    genre="drama"
                  />
                  {renderContentScroll(genreContent.drama, `drama-${type}-scroll`)}
                </section>
              </>
            ) : (
              <>
                {/* Drama Content - First for TV shows */}
                <section className="mb-12">
                  <SectionHeader 
                    title={sectionTitles.drama} 
                    genre="drama"
                  />
                  {renderContentScroll(genreContent.drama, `drama-${type}-scroll`)}
                </section>

                {/* Comedy Content */}
                <section className="mb-12">
                  <SectionHeader 
                    title={sectionTitles.comedy} 
                    genre="comedy"
                  />
                  {renderContentScroll(genreContent.comedy, `comedy-${type}-scroll`)}
                </section>

                {/* Action & Adventure Content */}
                <section className="mb-12">
                  <SectionHeader 
                    title={sectionTitles['action-adventure']} 
                    genre="action-adventure"
                  />
                  {renderContentScroll(genreContent['action-adventure'], `action-adventure-${type}-scroll`)}
                </section>

                {/* Sci-Fi & Fantasy Content */}
                <section className="mb-12">
                  <SectionHeader 
                    title={sectionTitles['sci-fi-fantasy']} 
                    genre="sci-fi-fantasy"
                  />
                  {renderContentScroll(genreContent['sci-fi-fantasy'], `sci-fi-fantasy-${type}-scroll`)}
                </section>

                {/* Crime Content */}
                <section className="mb-12">
                  <SectionHeader 
                    title={sectionTitles.crime} 
                    genre="crime"
                  />
                  {renderContentScroll(genreContent.crime, `crime-${type}-scroll`)}
                </section>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MediaPage;