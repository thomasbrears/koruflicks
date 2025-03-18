import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Typography, Button, notification } from 'antd';
import { LeftOutlined, RightOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';

const { Text } = Typography;

const PopularCategoriesBar = ({ currentCategory }) => {
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Popular categories with TMDb ID mappings
  let popularCategories = [
    { name: 'Action', slug: 'action', icon: '💥', tmdbId: 28 },
    { name: 'Adventure', slug: 'adventure', icon: '🌄', tmdbId: 12 },
    { name: 'Animation', slug: 'animation', icon: '🎬', tmdbId: 16 },
    { name: 'Comedy', slug: 'comedy', icon: '😂', tmdbId: 35 },
    { name: 'Crime', slug: 'crime', icon: '🔍', tmdbId: 80 },
    { name: 'Documentary', slug: 'documentary', icon: '📹', tmdbId: 99 },
    { name: 'Drama', slug: 'drama', icon: '🎭', tmdbId: 18 },
    { name: 'Family', slug: 'family', icon: '👨‍👩‍👧‍👦', tmdbId: 10751 },
    { name: 'Fantasy', slug: 'fantasy', icon: '🧙', tmdbId: 14 },
    { name: 'Horror', slug: 'horror', icon: '👻', tmdbId: 27 },
    { name: 'Mystery', slug: 'mystery', icon: '❓', tmdbId: 9648 },
    { name: 'Romance', slug: 'romance', icon: '💖', tmdbId: 10749 },
    { name: 'Sci-Fi', slug: 'scifi', icon: '🚀', tmdbId: 878 },
    { name: 'Thriller', slug: 'thriller', icon: '😱', tmdbId: 53 },
    { name: 'War', slug: 'war', icon: '⚔️', tmdbId: 10752 },
    { name: 'Western', slug: 'western', icon: '🤠', tmdbId: 37 }
  ];

  // If there's a current category, move it to the first position
  if (currentCategory) {
    // Find the current category in the array
    const currentCategoryIndex = popularCategories.findIndex(cat => cat.slug === currentCategory);
    
    // If found, move it to the front
    if (currentCategoryIndex !== -1) {
      const currentCat = popularCategories.splice(currentCategoryIndex, 1)[0];
      popularCategories = [currentCat, ...popularCategories];
    }
  }

  // Scroll the container horizontally
  const scrollContainer = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.offsetWidth * 0.75;
      const scrollTo = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Filter
  const showFilterNotification = () => {
    notification.info({
      message: 'Feature Coming Soon',
      description: 'Advanced filtering options will be available in a future update.',
      placement: 'topRight',
      duration: 3,
      style: {
        backgroundColor: '#1f1f1f',
        borderColor: '#333',
        color: 'white'
      }
    });
  };

  return (
    <div className="mb-6 mt-4 bg-gray-900 rounded-lg border border-gray-800">

      {/* Categories Section */}
      <div className="py-3 relative">
        {/* Scroll left button */}
        <button 
          onClick={() => scrollContainer('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 hover:bg-opacity-90 text-white z-10 rounded-full w-10 h-10 flex items-center justify-center shadow-lg border border-gray-700 ml-1 opacity-90 hover:opacity-100"
          aria-label="Scroll left"
        >
          <LeftOutlined />
        </button>

        {/* Categories container */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto px-12 py-1 hide-scrollbar scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {popularCategories.map((category) => (
            <Link 
              key={category.slug} 
              to={`/categories/${category.slug}`}
              className="focus:outline-none mx-1.5"
            >
              <div 
                className={`flex items-center px-4 py-2 rounded-full transition-all duration-200 whitespace-nowrap min-w-max ${
                  currentCategory === category.slug 
                    ? 'bg-LGreen text-black' 
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                <Text strong style={{ color: currentCategory === category.slug ? 'black' : 'white', margin: 0 }}>
                  {category.name}
                </Text>
              </div>
            </Link>
          ))}
        </div>

        {/* Scroll right button */}
        <button 
          onClick={() => scrollContainer('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 hover:bg-opacity-90 text-white z-10 rounded-full w-10 h-10 flex items-center justify-center shadow-lg border border-gray-700 mr-1 opacity-90 hover:opacity-100"
          aria-label="Scroll right"
        >
          <RightOutlined />
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between flex-wrap gap-2">
        {/* Search bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative flex">
            <input
              type="text"
              placeholder="Search movies and TV shows..."
              className="w-full px-4 py-2 pl-10 border-0 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-LGreen bg-[rgba(255,255,255,0.1)] text-white placeholder-gray-300 text-base"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300">
              <SearchOutlined />
            </span>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-LGreen text-white rounded-r-lg hover:bg-DGreen transition duration-300 text-base flex items-center"
            >
              Search
            </button>
          </div>
        </div>
        
        {/* Filter button */}
        <Button 
          icon={<FilterOutlined />} 
          onClick={showFilterNotification}
          style={{ 
            backgroundColor: '#1a1a1a',
            borderColor: '#333',
            color: 'white'
          }}
          className="hover:border-LGreen"
        >
          Filters
        </Button>
      </div>
    </div>
  );
};

export default PopularCategoriesBar;