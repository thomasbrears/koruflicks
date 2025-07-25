import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Tabs, 
  List, 
  Empty, 
  Button, 
  Select, 
  Input, 
  Space, 
  Tooltip,
  message,
  notification,
  Spin,
  Row,
  Col,
  Statistic
} from 'antd';
import { 
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  PlayCircleOutlined,
  DeleteOutlined,
  StarFilled,
  CalendarOutlined,
  ClockCircleOutlined,
  HeartOutlined,
  AppstoreOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { userContentApi, watchlistApi, likedContentApi } from '../api/userContentApi';

const { Meta } = Card;
const { Option } = Select;
const { Search } = Input;

const LibraryPage = () => {
  const [activeTab, setActiveTab] = useState('watchlist');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [watchlist, setWatchlist] = useState([]);
  const [likedContent, setLikedContent] = useState([]);
  const [filteredWatchlist, setFilteredWatchlist] = useState([]);
  const [filteredLikedContent, setFilteredLikedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState({});
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dateAdded'); // 'dateAdded', 'title', 'releaseDate', 'rating'
  const [filterBy, setFilterBy] = useState('all'); // 'all', 'movie', 'tv'
  const navigate = useNavigate();

  useEffect(() => {
    loadUserContent();
    loadUserStats();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [watchlist, likedContent, searchTerm, sortBy, filterBy]);

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
        description: 'Failed to load your library. Please try again.',
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

  const applyFiltersAndSort = () => {
    const filterAndSort = (items) => {
      let filtered = [...items];

      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply media type filter
      if (filterBy !== 'all') {
        filtered = filtered.filter(item => item.mediaType === filterBy);
      }

      // Apply sorting
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'title':
            return a.title.localeCompare(b.title);
          case 'releaseDate':
            const dateA = new Date(a.releaseDate || 0);
            const dateB = new Date(b.releaseDate || 0);
            return dateB - dateA; // Newest first
          case 'rating':
            return (b.voteAverage || 0) - (a.voteAverage || 0); // Highest first
          case 'dateAdded':
          default:
            const addedA = new Date(a.addedAt || 0);
            const addedB = new Date(b.addedAt || 0);
            return addedB - addedA; // Most recent first
        }
      });

      return filtered;
    };

    setFilteredWatchlist(filterAndSort(watchlist));
    setFilteredLikedContent(filterAndSort(likedContent));
  };

  const handleRemoveFromWatchlist = async (item) => {
    const itemId = item.itemId;
    setRemoving(prev => ({ ...prev, [`watchlist_${itemId}`]: true }));

    try {
      await watchlistApi.removeFromWatchlist(itemId);
      setWatchlist(prev => prev.filter(w => w.itemId !== itemId));
      message.success(`Removed "${item.title}" from your watchlist`);
      loadUserStats();
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
      loadUserStats();
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

  const getImageUrl = (path, size = 'w500') => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Unknown';
    }
  };

  const renderGridCard = (item, type) => {
    const isRemoving = removing[`${type}_${item.itemId}`];
    const releaseYear = item.releaseDate ? new Date(item.releaseDate).getFullYear() : null;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          hoverable
          className="bg-gray-800 border-gray-700 overflow-hidden h-full"
          cover={
            <div className="relative h-64 bg-gray-900">
              {item.posterPath ? (
                <img
                  alt={item.title}
                  src={getImageUrl(item.posterPath)}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="hidden w-full h-full bg-gray-700 items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-2">
                    {item.mediaType === 'movie' ? '🎬' : '📺'}
                  </div>
                  <div>No Image</div>
                </div>
              </div>
              
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                <div className="flex gap-2">
                  <Tooltip title="Watch Now">
                    <Button
                      type="primary"
                      shape="circle"
                      size="large"
                      icon={<PlayCircleOutlined />}
                      onClick={() => handleWatchNow(item)}
                      className="bg-red-600 border-red-600 hover:bg-red-700"
                    />
                  </Tooltip>
                  <Tooltip title={`Remove from ${type === 'watchlist' ? 'Watchlist' : 'Liked'}`}>
                    <Button
                      danger
                      shape="circle"
                      size="large"
                      icon={<DeleteOutlined />}
                      loading={isRemoving}
                      onClick={() => type === 'watchlist' ? handleRemoveFromWatchlist(item) : handleRemoveFromLiked(item)}
                    />
                  </Tooltip>
                </div>
              </div>
            </div>
          }
        >
          <Meta
            title={
              <div className="text-white text-sm font-medium" title={item.title}>
                {item.title}
              </div>
            }
            description={
              <div className="text-gray-400 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="capitalize">{item.mediaType}</span>
                  {releaseYear && <span>{releaseYear}</span>}
                </div>
                {item.voteAverage > 0 && (
                  <div className="flex items-center gap-1">
                    <StarFilled className="text-yellow-400 text-xs" />
                    <span>{parseFloat(item.voteAverage).toFixed(1)}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-gray-500">
                  <CalendarOutlined className="text-xs" />
                  <span>Added {formatDate(item.addedAt)}</span>
                </div>
              </div>
            }
          />
        </Card>
      </motion.div>
    );
  };

  const renderListItem = (item, type) => {
    const isRemoving = removing[`${type}_${item.itemId}`];
    const releaseYear = item.releaseDate ? new Date(item.releaseDate).getFullYear() : null;
    
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-24 bg-gray-700 rounded overflow-hidden flex-shrink-0">
            {item.posterPath ? (
              <img
                alt={item.title}
                src={getImageUrl(item.posterPath, 'w154')}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="hidden w-full h-full bg-gray-700 items-center justify-center">
              <div className="text-gray-400 text-xs">
                {item.mediaType === 'movie' ? '🎬' : '📺'}
              </div>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium text-base truncate">{item.title}</h3>
            <div className="flex items-center gap-4 text-gray-400 text-sm mt-1">
              <span className="capitalize">{item.mediaType}</span>
              {releaseYear && <span>{releaseYear}</span>}
              {item.voteAverage > 0 && (
                <div className="flex items-center gap-1">
                  <StarFilled className="text-yellow-400 text-xs" />
                  <span>{parseFloat(item.voteAverage).toFixed(1)}</span>
                </div>
              )}
              <span>Added {formatDate(item.addedAt)}</span>
            </div>
            {item.overview && (
              <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                {item.overview.length > 120 ? `${item.overview.substring(0, 120)}...` : item.overview}
              </p>
            )}
          </div>
          
          <div className="flex gap-2 flex-shrink-0">
            <Tooltip title="Watch Now">
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={() => handleWatchNow(item)}
                className="bg-red-600 border-red-600 hover:bg-red-700"
              >
                Watch
              </Button>
            </Tooltip>
            <Tooltip title={`Remove from ${type === 'watchlist' ? 'Watchlist' : 'Liked'}`}>
              <Button
                danger
                icon={<DeleteOutlined />}
                loading={isRemoving}
                onClick={() => type === 'watchlist' ? handleRemoveFromWatchlist(item) : handleRemoveFromLiked(item)}
              />
            </Tooltip>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderContent = (items, type) => {
    if (loading) {
      return (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      );
    }

    if (items.length === 0) {
      const emptyMessage = searchTerm 
        ? `No items found matching "${searchTerm}"` 
        : `Your ${type} is empty`;
      
      return (
        <Empty 
          description={<span className="text-gray-400">{emptyMessage}</span>}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="my-12"
        />
      );
    }

    if (viewMode === 'grid') {
      return (
        <List
          grid={{ 
            gutter: [16, 16], 
            xs: 1, 
            sm: 2, 
            md: 3, 
            lg: 4, 
            xl: 5, 
            xxl: 6 
          }}
          dataSource={items}
          renderItem={item => (
            <List.Item>
              {renderGridCard(item, type)}
            </List.Item>
          )}
        />
      );
    } else {
      return (
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id}>
              {renderListItem(item, type)}
            </div>
          ))}
        </div>
      );
    }
  };

  const tabItems = [
    {
      key: 'watchlist',
      label: (
        <span className="text-white text-base">
          <ClockCircleOutlined /> Watchlist 
          {stats.watchlist?.total > 0 && (
            <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {stats.watchlist.total}
            </span>
          )}
        </span>
      ),
      children: renderContent(filteredWatchlist, 'watchlist')
    },
    {
      key: 'liked',
      label: (
        <span className="text-white text-base">
          <HeartOutlined /> Liked Content 
          {stats.liked?.total > 0 && (
            <span className="ml-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
              {stats.liked.total}
            </span>
          )}
        </span>
      ),
      children: renderContent(filteredLikedContent, 'liked')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Library</h1>
          <p className="text-gray-400">Manage your watchlist and liked content</p>
        </div>

        {/* Stats Cards */}
        {stats.overall && (
          <Row gutter={16} className="mb-8">
            <Col xs={24} sm={8}>
              <Card className="bg-gray-800 border-gray-700">
                <Statistic
                  title={<span className="text-gray-400">Total Items</span>}
                  value={stats.overall.totalItems}
                  valueStyle={{ color: '#fff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="bg-gray-800 border-gray-700">
                <Statistic
                  title={<span className="text-gray-400">Movies</span>}
                  value={stats.overall.totalMovies}
                  valueStyle={{ color: '#fff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="bg-gray-800 border-gray-700">
                <Statistic
                  title={<span className="text-gray-400">TV Shows</span>}
                  value={stats.overall.totalTvShows}
                  valueStyle={{ color: '#fff' }}
                />
              </Card>
            </Col>
          </Row>
        )}

        {/* Controls */}
        <div className="mb-6">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Search your library..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
                className="custom-search"
              />
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                value={filterBy}
                onChange={setFilterBy}
                className="w-full"
                dropdownClassName="bg-gray-800"
              >
                <Option value="all">All Types</Option>
                <Option value="movie">Movies</Option>
                <Option value="tv">TV Shows</Option>
              </Select>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                value={sortBy}
                onChange={setSortBy}
                className="w-full"
                dropdownClassName="bg-gray-800"
              >
                <Option value="dateAdded">Date Added</Option>
                <Option value="title">Title</Option>
                <Option value="releaseDate">Release Date</Option>
                <Option value="rating">Rating</Option>
              </Select>
            </Col>
            <Col xs={24} md={8}>
              <div className="flex justify-end">
                <Button.Group>
                  <Button
                    type={viewMode === 'grid' ? 'primary' : 'default'}
                    icon={<AppstoreOutlined />}
                    onClick={() => setViewMode('grid')}
                  >
                    Grid
                  </Button>
                  <Button
                    type={viewMode === 'list' ? 'primary' : 'default'}
                    icon={<UnorderedListOutlined />}
                    onClick={() => setViewMode('list')}
                  >
                    List
                  </Button>
                </Button.Group>
              </div>
            </Col>
          </Row>
        </div>

        {/* Content Tabs */}
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          className="custom-tabs"
          items={tabItems}
          size="large"
        />
      </div>
    </div>
  );
};

export default LibraryPage;