import React, { useState, useEffect } from 'react';
import { Tabs, List, Empty, Card, Button, Tooltip, message, notification, Spin, Typography } from 'antd';
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
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState({});
  const [stats, setStats] = useState({});
  const navigate = useNavigate();

  // Load user content on component mount
  useEffect(() => {
    if (user) {
      loadUserContent();
      loadUserStats();
    }
  }, [user]);

  const loadUserContent = async () => {
    try {
      setLoading(true);
      const response = await userContentApi.getAllUserContent();
      setWatchlist(response.watchlist || []);
      setLikedContent(response.likedContent || []);
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

  const loadUserStats = async () => {
    try {
      const response = await userContentApi.getUserStats();
      setStats(response);
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleRemoveFromWatchlist = async (item) => {
    const itemId = item.itemId;
    setRemoving(prev => ({ ...prev, [`watchlist_${itemId}`]: true }));

    try {
      await watchlistApi.removeFromWatchlist(itemId);
      setWatchlist(prev => prev.filter(w => w.itemId !== itemId));
      message.success(`Removed "${item.title}" from your watchlist`);
      loadUserStats(); // Refresh stats
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
      setLikedContent(prev => prev.filter(l => l.itemId !== itemId));
      message.success(`Removed "${item.title}" from your liked content`);
      loadUserStats(); // Refresh stats
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
            <>
              {stats.watchlist && (
                <div className="mb-4 text-gray-400 text-sm">
                  {stats.watchlist.total} items • {stats.watchlist.movies} movies • {stats.watchlist.tvShows} TV shows
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
                dataSource={watchlist}
                renderItem={item => (
                  <List.Item>
                    {renderContentCard(item, 'watchlist')}
                  </List.Item>
                )}
              />
            </>
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
            <>
              {stats.liked && (
                <div className="mb-4 text-gray-400 text-sm">
                  {stats.liked.total} items • {stats.liked.movies} movies • {stats.liked.tvShows} TV shows
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
                dataSource={likedContent}
                renderItem={item => (
                  <List.Item>
                    {renderContentCard(item, 'liked')}
                  </List.Item>
                )}
              />
            </>
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
        onChange={setActiveContentTab}
        className="text-white custom-tabs"
        items={tabItems}
      />
    </div>
  );
};

export default UserContent;