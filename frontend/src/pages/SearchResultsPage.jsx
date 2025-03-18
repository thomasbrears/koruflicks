import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchMoviesAndShows } from '../utils/api';
import SearchBar from '../components/SearchBar';
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
import { PlayCircleOutlined, VideoCameraOutlined, WarningOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Meta } = Card;

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalResults: 0
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await searchMoviesAndShows(query, pagination.currentPage);
        setResults(data.results);
        setPagination({
          currentPage: data.page,
          totalPages: data.total_pages,
          totalResults: data.total_results
        });
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Failed to fetch search results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [query, pagination.currentPage]);

  const handlePageChange = (page) => {
    setPagination({ ...pagination, currentPage: page });
    window.scrollTo(0, 0);
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

  // Generate skeleton cards for loading state - darker version
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
      <SearchBar />
     
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Title level={2} style={{ color: 'white', marginBottom: 24 }}>
          Search Results for "{query}"
        </Title>
       
        {loading ? (
          <div>
            <Text type="secondary" style={{ color: '#aaa', display: 'block', marginBottom: 16 }}>
              Searching for "{query}"...
            </Text>
            <Row gutter={[16, 16]}>
              {renderSkeletons()}
            </Row>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <Result
              status="error"
              title={<span style={{ color: 'white' }}>Search Failed</span>}
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
            description={<span style={{ color: 'gray' }}>No results found</span>}
            className="my-16"
          />
        ) : (
          <>
            <Text type="secondary" style={{ color: 'gray', display: 'block', marginBottom: 16 }}>
              Found {pagination.totalResults} results
            </Text>
           
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
                  pageSize={20} // TMDB typically returns 20 results per page
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

export default SearchResultsPage;