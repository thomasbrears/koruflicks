import React, { useState, useEffect } from 'react';
import { Tabs, List, Empty, Card, Button, Tooltip, message, notification, Spin, Typography, Pagination } from 'antd';
import { 
  ClockCircleOutlined, 
  HeartOutlined, 
  CommentOutlined,
  PlayCircleOutlined,
  DeleteOutlined,
  StarFilled,
  CalendarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { userContentApi, watchlistApi, likedContentApi } from '../../api/userContentApi';

const { Meta } = Card;
const { Text } = Typography;

const UserContent = ({ user, recentComments = [] }) => {
  const [activeContentTab, setActiveContentTab] = useState('watchlist');
  const [watchlist, setWatchlist] = useState([]);
  const [likedContent, setLikedContent] = useState([]);
  const [allWatchlist, setAllWatchlist] = useState([]); // Store all watchlist data
  const [allLikedContent, setAllLikedContent] = useState([]); // Store all liked data
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState({});
  const [stats, setStats] = useState({});
  
  // Pagination states
  const [watchlistPagination, setWatchlistPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0
  });
  const [likedPagination, setLikedPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0
  });
  
  const navigate = useNavigate();

  // Load user content on component mount
  useEffect(() => {
    if (user) {
      loadUserContent();
      loadUserStats();
    }
  }, [user]);

  // Load content when pagination changes
  useEffect(() => {
    if (user && activeContentTab === 'watchlist' && allWatchlist.length > 0) {
      loadWatchlistPage(watchlistPagination.current, watchlistPagination.pageSize);
    }
  }, [watchlistPagination.current, watchlistPagination.pageSize, allWatchlist]);

  useEffect(() => {
    if (user && activeContentTab === 'liked' && allLikedContent.length > 0) {
      loadLikedPage(likedPagination.current, likedPagination.pageSize);
    }
  }, [likedPagination.current, likedPagination.pageSize, allLikedContent]);

  const loadUserContent = async () => {
    try {
      setLoading(true);
      const response = await userContentApi.getAllUserContent();
      
      // Store all data
      const watchlistData = response.watchlist || [];
      const likedData = response.likedContent || [];
      
      setAllWatchlist(watchlistData);
      setAllLikedContent(likedData);
      
      // Set initial pagination totals
      setWatchlistPagination(prev => ({
        ...prev,
        total: watchlistData.length
      }));
      setLikedPagination(prev => ({
        ...prev,
        total: likedData.length
      }));
      
      // Load first page of current tab
      if (activeContentTab === 'watchlist') {
        loadWatchlistPage(1, watchlistPagination.pageSize);
      } else if (activeContentTab === 'liked') {
        loadLikedPage(1, likedPagination.pageSize);
      }
    } catch (error) {
      console.error('Error loading user content:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to load your content. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadWatchlistPage = async (page, pageSize) => {
    try {
      // Calculate pagination from stored data
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = allWatchlist.slice(startIndex, endIndex);
      
      setWatchlist(paginatedData);
      setWatchlistPagination(prev => ({
        ...prev,
        current: page,
        total: allWatchlist.length
      }));
    } catch (error) {
      console.error('Error loading watchlist:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to load watchlist. Please try again.',
      });
    }
  };

  const loadLikedPage = async (page, pageSize) => {
    try {
      // Calculate pagination from stored data
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = allLikedContent.slice(startIndex, endIndex);
      
      setLikedContent(paginatedData);
      setLikedPagination(prev => ({
        ...prev,
        current: page,
        total: allLikedContent.length
      }));
    } catch (error) {
      console.error('Error loading liked content:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to load liked content. Please try again.',
      });
    }
  };

  const loadUserStats = async () => {
    try {
      const response = await userContentApi.getUserStats();
      setStats(response);
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleTabChange = (key) => {
    setActiveContentTab(key);
    
    // Load content for the selected tab
    if (key === 'watchlist' && allWatchlist.length > 0) {
      loadWatchlistPage(watchlistPagination.current, watchlistPagination.pageSize);
    } else if (key === 'liked' && allLikedContent.length > 0) {
      loadLikedPage(likedPagination.current, likedPagination.pageSize);
    }
  };

  const handleWatchlistPageChange = (page, pageSize) => {
    setWatchlistPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize || prev.pageSize
    }));
  };

  const handleLikedPageChange = (page, pageSize) => {
    setLikedPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize || prev.pageSize
    }));
  };

  const handleRemoveFromWatchlist = async (item) => {
    const itemId = item.itemId;
    setRemoving(prev => ({ ...prev, [`watchlist_${itemId}`]: true }));

    try {
      await watchlistApi.removeFromWatchlist(itemId);
      
      // Update all data
      const updatedWatchlist = allWatchlist.filter(w => w.itemId !== itemId);
      setAllWatchlist(updatedWatchlist);
      
      // Update current page data
      setWatchlist(prev => prev.filter(w => w.itemId !== itemId));
      
      // Update pagination total
      setWatchlistPagination(prev => ({
        ...prev,
        total: updatedWatchlist.length
      }));
      
      message.success(`Removed "${item.title}" from your watchlist`);
      loadUserStats(); // Refresh stats
      
      // If current page is empty and not the first page, go to previous page
      const itemsOnCurrentPage = watchlist.filter(w => w.itemId !== itemId).length;
      if (itemsOnCurrentPage === 0 && watchlistPagination.current > 1) {
        setWatchlistPagination(prev => ({
          ...prev,
          current: prev.current - 1
        }));
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to remove item from watchlist',
      });
    } finally {
      setRemoving(prev => ({ ...prev, [`watchlist_${itemId}`]: false }));
    }
  };

  const handleRemoveFromLiked = async (item) => {
    const itemId = item.itemId;
    setRemoving(prev => ({ ...prev, [`liked_${itemId}`]: true }));

    try {
      await likedContentApi.removeFromLiked(itemId);
      
      // Update all data
      const updatedLiked = allLikedContent.filter(l => l.itemId !== itemId);
      setAllLikedContent(updatedLiked);
      
      // Update current page data
      setLikedContent(prev => prev.filter(l => l.itemId !== itemId));
      
      // Update pagination total
      setLikedPagination(prev => ({
        ...prev,
        total: updatedLiked.length
      }));
      
      message.success(`Removed "${item.title}" from your liked content`);
      loadUserStats(); // Refresh stats
      
      // If current page is empty and not the first page, go to previous page
      const itemsOnCurrentPage = likedContent.filter(l => l.itemId !== itemId).length;
      if (itemsOnCurrentPage === 0 && likedPagination.current > 1) {
        setLikedPagination(prev => ({
          ...prev,
          current: prev.current - 1
        }));
      }
    } catch (error) {
      console.error('Error removing from liked content:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to remove item from liked content',
      });
    } finally {
      setRemoving(prev => ({ ...prev, [`liked_${itemId}`]: false }));
    }
  };

  const handleWatchNow = (item) => {
    const isMovie = item.mediaType === 'movie';
    const path = isMovie ? `/movie/${item.itemId}` : `/tv/${item.itemId}`;
    navigate(path);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Unknown';
    }
  };

  const getImageUrl = (path, size = 'w500') => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };

  const getYear = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).getFullYear();
  };

  const formatRating = (rating) => {
    if (rating === '' || rating === undefined || rating === null || isNaN(rating)) {
      return 'N/A';
    }
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    return numRating.toFixed(1);
  };

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

  const renderContentCard = (item, type) => {
    const isRemoving = removing[`${type}_${item.itemId}`];
    const releaseYear = item.releaseDate ? getYear(item.releaseDate) : null;
    
    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          hoverable
          className="bg-black border border-gray-800 overflow-hidden rounded-lg h-full transition-all duration-300 hover:border-LGreen"
          cover={
            <div style={{ position: 'relative' }}>
              {item.posterPath ? (
                <img
                  alt={item.title}
                  src={getImageUrl(item.posterPath)}
                  style={{ height: 280, objectFit: 'cover', width: '100%' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.appendChild(
                      document.createRange().createContextualFragment(
                        renderPlaceholder(item.title).outerHTML
                      )
                    );
                  }}
                />
              ) : renderPlaceholder(item.title)}
              
              {/* Overlay with title gradient */}
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
                  {item.title}
                </Text>
              </div>
              
              {/* Remove button - top right */}
              <div className="absolute top-2 right-2">
                <Tooltip title={`Remove from ${type === 'watchlist' ? 'Watchlist' : 'Liked'}`}>
                  <Button
                    danger
                    shape="circle"
                    icon={<DeleteOutlined />}
                    loading={isRemoving}
                    onClick={(e) => {
                      e.stopPropagation();
                      type === 'watchlist' ? handleRemoveFromWatchlist(item) : handleRemoveFromLiked(item);
                    }}
                    size="small"
                    className="shadow-lg"
                  />
                </Tooltip>
              </div>
            </div>
          }
          bodyStyle={{
            padding: '12px',
            backgroundColor: '#111',
            color: 'white',
            borderTop: '1px solid #222'
          }}
          onClick={(e) => {
            // Don't navigate when clicking action buttons
            if (e.target.closest('.ant-btn')) return;
            handleWatchNow(item);
          }}
        >
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <span>{releaseYear || 'Unknown'}</span>
              <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
              <span className="text-LGreen capitalize">
                {item.mediaType === 'movie' ? 'Movie' : 'TV Show'}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-yellow-400 mr-1">★</span>
              <span>{formatRating(item.voteAverage)}</span>
            </div>
          </div>
          
          {/* Added date info */}
          <div className="flex items-center gap-1 text-gray-500 text-xs mt-2">
            <CalendarOutlined className="text-xs" />
            <span>Added {formatDate(item.addedAt)}</span>
          </div>
          
          {/* Watch Now button */}
          <div className="mt-3">
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleWatchNow(item);
              }}
              className="bg-red-600 border-red-600 hover:bg-red-700 w-full"
              size="middle"
            >
              Watch Now
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  };

  const renderPaginatedContent = (data, pagination, onPageChange, type) => {
    const startIndex = (pagination.current - 1) * pagination.pageSize + 1;
    const endIndex = Math.min(pagination.current * pagination.pageSize, pagination.total);
    
    return (
      <div>
        {pagination.total > 0 && (
          <div className="mb-4 flex justify-between items-center">
            <div className="text-gray-400 text-sm">
              Showing {startIndex}-{endIndex} of {pagination.total} items
            </div>
            <div className="text-gray-400 text-sm">
              {stats[type] && `${stats[type].movies} movies • ${stats[type].tvShows} TV shows`}
            </div>
          </div>
        )}
        
        <List
          grid={{ 
            gutter: [20, 20], 
            xs: 1, 
            sm: 2, 
            md: 3, 
            lg: 3, 
            xl: 4, 
            xxl: 4
          }}
          dataSource={data}
          renderItem={item => (
            <List.Item>
              {renderContentCard(item, type)}
            </List.Item>
          )}
        />
        
        {pagination.total > pagination.pageSize && (
          <div className="flex justify-center mt-8">
            <Pagination
              current={pagination.current}
              total={pagination.total}
              pageSize={pagination.pageSize}
              onChange={onPageChange}
              onShowSizeChange={onPageChange}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) => 
                `${range[0]}-${range[1]} of ${total} items`
              }
              pageSizeOptions={['12', '24', '48', '96']}
              className="pagination-dark"
            />
          </div>
        )}
      </div>
    );
  };

  const tabItems = [
    {
      key: 'watchlist',
      label: (
        <span className="text-white">
          <ClockCircleOutlined /> Watch Later 
          {stats.watchlist?.total > 0 && (
            <span className="ml-2 bg-DGreen text-white text-xs px-2 py-1 rounded-full">
              {stats.watchlist.total}
            </span>
          )}
        </span>
      ),
      children: (
        <div>
          {loading ? (
            <div className="flex justify-center py-12">
              <Spin size="large" />
            </div>
          ) : watchlist.length > 0 ? (
            renderPaginatedContent(watchlist, watchlistPagination, handleWatchlistPageChange, 'watchlist')
          ) : (
            <Empty 
              description={<span className="text-gray-400">Your watchlist is empty</span>}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              className="my-12"
            />
          )}
        </div>
      )
    },
    {
      key: 'liked',
      label: (
        <span className="text-white">
          <HeartOutlined /> Liked 
          {stats.liked?.total > 0 && (
            <span className="ml-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
              {stats.liked.total}
            </span>
          )}
        </span>
      ),
      children: (
        <div>
          {loading ? (
            <div className="flex justify-center py-12">
              <Spin size="large" />
            </div>
          ) : likedContent.length > 0 ? (
            renderPaginatedContent(likedContent, likedPagination, handleLikedPageChange, 'liked')
          ) : (
            <Empty 
              description={<span className="text-gray-400">You haven't liked any content yet</span>}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              className="my-12"
            />
          )}
        </div>
      )
    },
    {
      key: 'comments',
      label: <span className="text-white"><CommentOutlined /> Recent Comments</span>,
      children: (
        recentComments.length > 0 ? (
          <List
            dataSource={recentComments}
            renderItem={item => (
              <List.Item>
                <div className="bg-gray-800 p-4 rounded w-full">
                  <p className="text-white font-semibold">{item.movie || 'Movie Title'}</p>
                  <p className="text-gray-400">{item.comment || 'Your comment...'}</p>
                  <p className="text-gray-500 text-xs mt-2">{item.date || new Date().toLocaleDateString()}</p>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Empty 
            description={<span className="text-gray-400">You haven't made any comments yet</span>}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="my-12"
          />
        )
      )
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-white text-xl font-semibold">My Content</h4>
        {stats.overall?.totalItems > 0 && (
          <div className="text-gray-400 text-sm">
            Total: {stats.overall.totalItems} items
          </div>
        )}
      </div>
      <Tabs 
        activeKey={activeContentTab} 
        onChange={handleTabChange}
        className="text-white custom-tabs"
        items={tabItems}
      />
    </div>
  );
};

export default UserContent;