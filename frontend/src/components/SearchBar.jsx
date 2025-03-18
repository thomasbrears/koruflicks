import React, { useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Initialize search box with current query if we're on the search page
  useEffect(() => {
    if (location.pathname === '/search') {
      const query = searchParams.get('q');
      if (query) {
        setSearchQuery(query);
      }
    }
  }, [location.pathname, searchParams]);
  
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
  
  return (
    <div className="relative">
      {/* Gradient transition element at the top */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-gray-900 to-black w-full"></div>
     
      <div className="bg-black py-12 px-4 shadow-md relative overflow-hidden pt-16">          
        <div className="container mx-auto text-center">
         
          {/* Search bar */}
          <div className="flex items-center justify-center max-w-3xl mx-auto">
            <div className="relative w-full flex">
              <input
                type="text"
                placeholder="Search for movie or series..."
                className="w-full px-5 py-3 pl-12 border-0 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-LGreen bg-[rgba(255,255,255,0.1)] text-white placeholder-gray-300 text-lg"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 text-xl">
                <SearchOutlined />
              </span>
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-LGreen text-white rounded-r-lg hover:bg-DGreen transition duration-300 text-lg flex items-center gap-2"
              >
                <span>Search</span>
              </button>
            </div>
          </div>
         
          {/* Quick category links */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <span className="text-white text-sm opacity-80">Popular Categories:</span>
            <Link to="/categories/action" className="text-LGreen hover:text-white transition-colors text-sm">Action</Link>
            <Link to="/categories/comedy" className="text-LGreen hover:text-white transition-colors text-sm">Comedy</Link>
            <Link to="/categories/drama" className="text-LGreen hover:text-white transition-colors text-sm">Drama</Link>
            <Link to="/categories/documentary" className="text-LGreen hover:text-white transition-colors text-sm">Documentary</Link>
            <Link to="/categories/horror" className="text-LGreen hover:text-white transition-colors text-sm">Horror</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;