import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getCategoryResults } from '../utils/api';
import {
  Pagination,
  Empty,
  Card,
  Typography,
  Skeleton,
  Row,
  Col,
  Result
} from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import HeroSlider from '../components/HeroSlider';
import PopularCategoriesBar from '../components/PopularCategoriesBar';

const { Text } = Typography;

const CategoryResultsPage = () => {
  const { categoryName } = useParams();
  const [searchParams] = useSearchParams();
  const pageParam = searchParams.get('page') || '1';
  const navigate = useNavigate();
  
  const [results, setResults] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: parseInt(pageParam, 10),
    totalPages: 0,
    totalResults: 0
  });
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all', 'movie', or 'tv'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Popular categories
  const popularCategories = [
    { key: 'action', label: 'Action' },
    { key: 'comedy', label: 'Comedy' },
    { key: 'drama', label: 'Drama' },
    { key: 'scifi', label: 'Sci-Fi' },
    { key: 'horror', label: 'Horror' },
    { key: 'documentary', label: 'Documentary' },
    { key: 'thriller', label: 'Thriller' },
    { key: 'animation', label: 'Animation' },
    { key: 'romance', label: 'Romance' },
    { key: 'fantasy', label: 'Fantasy' },
    { key: 'adventure', label: 'Adventure' },
    { key: 'crime', label: 'Crime' },
    { key: 'mystery', label: 'Mystery' }
  ];

  // Format category name for display (convert slug to readable text)
  const formatCategoryName = (name) => {
    if (!name) return '';
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const displayCategoryName = formatCategoryName(categoryName);

  useEffect(() => {
    const fetchCategoryResults = async () => {
      if (!categoryName) {
        setResults([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await getCategoryResults(categoryName, pagination.currentPage);
        
        // Set up featured items from the top results
        // We'll take the top 5 highest rated items to feature in the hero slider
        const topItems = [...data.results]
          .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
          .slice(0, 5);
        
        setFeaturedItems(topItems);
        
        // Filter results based on selected media type if needed
        let filteredResults = data.results;
        if (filterType === 'movie') {
          filteredResults = data.results.filter(item => item.media_type === 'movie');
        } else if (filterType === 'tv') {
          filteredResults = data.results.filter(item => item.media_type === 'tv');
        }

        // Apply search filter if search query exists
        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          filteredResults = filteredResults.filter(item => 
            (item.title || item.name || '').toLowerCase().includes(lowerQuery)
          );
        }
        
        setResults(filteredResults);
        setPagination({
          currentPage: data.page,
          totalPages: data.total_pages,
          totalResults: data.total_results
        });
      } catch (err) {
        console.error('Error fetching category results:', err);
        setError('Failed to fetch category results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategoryResults();
  }, [categoryName, pagination.currentPage, filterType, searchQuery]);

  const handlePageChange = (page) => {
    setPagination({ ...pagination, currentPage: page });
    navigate(`/categories/${categoryName}?page=${page}`);
    window.scrollTo(0, 0);
  };

  const handleFilterChange = (e) => {
    const newFilterType = e.target.value;
    setFilterType(newFilterType);
    // Reset to page 1 when changing filters
    setPagination({ ...pagination, currentPage: 1 });
    navigate(`/categories/${categoryName}?page=1`);
  };

  const handleCategoryChange = (value) => {
    navigate(`/categories/${value}?page=1`);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    // Reset to page 1 when searching
    setPagination({ ...pagination, currentPage: 1 });
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

  // Function to calculate release year from date
  const getYear = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).getFullYear();
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

  // Custom item renderer for pagination
  const itemRender = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a className="text-white hover:text-LGreen">Previous</a>;
    }
    if (type === 'next') {
      return <a className="text-white hover:text-LGreen">Next</a>;
    }
    return originalElement;
  };

  // Generate skeleton cards for loading
  const renderSkeletons = () => {
    return Array(20).fill(null).map((_, index) => (
      <Col xs={24} sm={12} md={8} lg={6} xl={6} key={`skeleton-${index}`}>
        <Card
          hoverable
          className="m-2 bg-black border border-gray-800 rounded-lg"
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
      </Col>
    ));
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Featured Hero Slider */}
      <div className="w-full">
        <HeroSlider 
          items={featuredItems} 
          pageType="category"
          title={`${displayCategoryName} Highlights`}
          loading={loading}
        />
      </div>

      {/* Popular Categories Bar with search and filters button*/}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 bg-black">
        <PopularCategoriesBar currentCategory={categoryName} />
      </div>
      
      {/* CSS for hiding scrollbars */}
      <style jsx="true">{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <h1 className="text-4xl text-white mb-0">
              {displayCategoryName} Category
            </h1>
          </div>
        </div>
              
        {loading ? (
          <div>
            <Text type="secondary" style={{ color: '#aaa', display: 'block', marginBottom: 16 }}>
              Loading {displayCategoryName} content...
            </Text>
            <Row gutter={[16, 16]}>
              {renderSkeletons()}
            </Row>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <Result
              status="error"
              title={<span style={{ color: 'white' }}>Category Load Failed</span>}
              subTitle={<span style={{ color: '#ff9999' }}>{error}</span>}
              className="bg-black"
              icon={<WarningOutlined style={{ color: '#ff4d4f' }} />}
              style={{ 
                background: 'rgba(17, 17, 17, 0.8)',
                border: '1px solid #303030',
                borderRadius: '8px',
                padding: '24px'
              }}
            />
          </div>
        ) : results.length === 0 ? (
          <Empty
            description={<span style={{ color: 'gray' }}>No items found in this category</span>}
            className="my-16"
          />
        ) : (
          <>
            <Row gutter={[16, 24]}>
              {results.map((item) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={6} key={`${item.media_type}-${item.id}`}>
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
                            fontSize: '18px',
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
                          {item.media_type === 'movie' ? 'Movie' : 'TV'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span>{formatRating(item.vote_average)}</span>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
           
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-10 mb-6">
                <Pagination
                  current={pagination.currentPage}
                  total={pagination.totalResults}
                  pageSize={20}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  className="custom-pagination"
                  itemRender={itemRender}
                  style={{
                    color: 'white',
                    '--ant-color-primary': '#10B981', // LGreen
                    '--ant-color-primary-hover': '#34D399' // Lighter green
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryResultsPage;