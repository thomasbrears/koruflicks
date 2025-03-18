import React, { useState, useEffect } from 'react';
import { Typography, Card, Skeleton, Row, Col, Empty } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { fetchPopularContent, fetchGenreContent } from '../utils/api';

const { Title, Text } = Typography;

const PopularSection = () => {
const [mixedContent, setMixedContent] = useState([]);
const [genreContent, setGenreContent] = useState({
  scifi: [],
  horror: [],
  comedy: [],
  action: [],
  drama: []
});
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// Fetch all content on component mount
useEffect(() => {
  fetchAllContent();
}, []);

// Function to calculate release year from date
const getYear = (dateString) => {
  if (!dateString) return 'Unknown';
  return new Date(dateString).getFullYear();
};

// Function to fetch all content types
const fetchAllContent = async () => {
  try {
    setLoading(true);
    
    // Fetch mixed popular/trending content
    const popularData = await fetchPopularContent();
    setMixedContent(popularData);

    // Fetch genre-specific content
    const genres = ['scifi', 'horror', 'comedy', 'action', 'drama'];
    const genreData = {};

    // Create an array of promises for each genre
    const genrePromises = genres.map(genre => 
      fetchGenreContent(genre)
        .then(data => ({ genre, data }))
        .catch(err => {
          console.error(`Error fetching ${genre} content:`, err);
          return { genre, data: [] };
        })
    );

    // Wait for all genre fetches to complete
    const results = await Promise.all(genrePromises);
    
    // Update genre content state
    results.forEach(({ genre, data }) => {
      genreData[genre] = data;
    });
    
    setGenreContent(genreData);
    setError(null);
  } catch (err) {
    console.error('Error fetching content:', err);
    setError('Failed to fetch content. Please try again later.');
  } finally {
    setLoading(false);
  }
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
        🎬
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
  // Handle empty string case
  if (rating === '') {
    return 'N/A';
  }
  
  // Return 'N/A' if rating is undefined, null, or not a number
  if (rating === undefined || rating === null || isNaN(rating)) {
    return 'N/A';
  }
  
  // Convert to number if it's a string
  const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
  
  // Format to one decimal place
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
        // First try normal scrolling
        container.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
        
        // After animation completes, jump to end without animation
        setTimeout(() => {
          // Get the max scroll position (total width minus visible width)
          const maxScroll = container.scrollWidth - container.clientWidth;
          container.scrollLeft = maxScroll;
        }, 400);
        return;
      }
    } else {
      scrollTo = container.scrollLeft + scrollAmount;
      
      // If at or near the end, loop to the beginning
      if (scrollTo >= container.scrollWidth - container.clientWidth - 50) {
        // First try normal scrolling
        container.scrollTo({
          left: container.scrollWidth,
          behavior: 'smooth'
        });
        
        // After animation completes, jump to beginning without animation
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
            key={`${sectionId}-${item.media_type}-${item.id}-${index}`}
          >
            <Card
              hoverable
              className="bg-black border border-gray-800 overflow-hidden rounded-lg h-full transition-all duration-300 hover:border-LGreen"
              cover={
                <div style={{ position: 'relative' }}>
                  {item.poster_path ? (
                    <img
                      alt={item.title || item.name}
                      src={getPosterUrl(item.poster_path)}
                      style={{ height: 280, objectFit: 'cover', width: '100%' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentNode.appendChild(
                          document.createRange().createContextualFragment(
                            renderPlaceholder(item.title || item.name).outerHTML
                          )
                        );
                      }}
                    />
                  ) : renderPlaceholder(item.title || item.name)}
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
                      {item.title || item.name}
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
              onClick={() => window.location.href = `/${item.media_type}/${item.id}`}
            >
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <span>{getYear(item.release_date || item.first_air_date)}</span>
                  <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                  <span className="text-LGreen">
                    {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
                  </span>
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
    <a 
      href={genre ? `/categories/${genre}` : '/popular'} 
      className="text-LGreen hover:text-green-300 transition-colors text-sm font-semibold"
    >
      See All →
    </a>
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

return (
  <div className="bg-black text-white min-h-screen">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Popular/Trending Content (Mixed) - First Row */}
      <section className="mb-12">
        <SectionHeader title="Trending Now" />
        
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
          renderContentScroll(mixedContent.slice(0, 30), 'trending-scroll')
        )}
      </section>

      {/* Top Rated Content (Mixed) - Second Row */}
      <section className="mb-12">
        <SectionHeader title="Top Rated" />
        
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
          renderContentScroll(mixedContent.slice(30, 55), 'top-rated-scroll')
        )}
      </section>

      {/* Genre-specific Rows */}
      {!loading && !error && (
        <>
          {/* Sci-Fi */}
          <section className="mb-12">
            <SectionHeader 
              title="Science Fiction" 
              genre="scifi"
            />
            {renderContentScroll(genreContent.scifi.slice(0, 25), 'scifi-scroll')}
          </section>

          {/* Horror */}
          <section className="mb-12">
            <SectionHeader 
              title="Horror" 
              genre="horror"
            />
            {renderContentScroll(genreContent.horror.slice(0, 25), 'horror-scroll')}
          </section>

          {/* Comedy */}
          <section className="mb-12">
            <SectionHeader 
              title="Comedy" 
              genre="comedy"
            />
            {renderContentScroll(genreContent.comedy.slice(0, 25), 'comedy-scroll')}
          </section>

          {/* Action */}
          <section className="mb-12">
            <SectionHeader 
              title="Action" 
              genre="action"
            />
            {renderContentScroll(genreContent.action.slice(0, 25), 'action-scroll')}
          </section>

          {/* Drama */}
          <section className="mb-12">
            <SectionHeader 
              title="Drama" 
              genre="drama"
            />
            {renderContentScroll(genreContent.drama.slice(0, 25), 'drama-scroll')}
          </section>
        </>
      )}
    </div>
  </div>
);
};

export default PopularSection;