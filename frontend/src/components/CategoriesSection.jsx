import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Row, Col, Card } from 'antd';

const { Title, Text } = Typography;

const CategoriesSection = ({ title = "Browse by Category" }) => {
  // Combined categories aligned with TMDb IDs and genres
  const categories = [
    // Movies and TV Shows shared categories
    { name: 'Action', slug: 'action', icon: '💥', tmdbId: 28, type: 'both' },
    { name: 'Adventure', slug: 'adventure', icon: '🌄', tmdbId: 12, type: 'both' },
    { name: 'Animation', slug: 'animation', icon: '🎬', tmdbId: 16, type: 'both' },
    { name: 'Comedy', slug: 'comedy', icon: '😂', tmdbId: 35, type: 'both' },
    { name: 'Crime', slug: 'crime', icon: '🔍', tmdbId: 80, type: 'both' },
    { name: 'Documentary', slug: 'documentary', icon: '📹', tmdbId: 99, type: 'both' },
    { name: 'Drama', slug: 'drama', icon: '🎭', tmdbId: 18, type: 'both' },
    { name: 'Family', slug: 'family', icon: '👨‍👩‍👧‍👦', tmdbId: 10751, type: 'both' },
    { name: 'Fantasy', slug: 'fantasy', icon: '🧙', tmdbId: 14, type: 'both' },
    { name: 'History', slug: 'history', icon: '📜', tmdbId: 36, type: 'movies' },
    { name: 'Horror', slug: 'horror', icon: '👻', tmdbId: 27, type: 'movies' },
    { name: 'Music', slug: 'music', icon: '🎵', tmdbId: 10402, type: 'movies' },
    { name: 'Mystery', slug: 'mystery', icon: '❓', tmdbId: 9648, type: 'both' },
    { name: 'Romance', slug: 'romance', icon: '💖', tmdbId: 10749, type: 'both' },
    { name: 'Science Fiction', slug: 'science-fiction', icon: '🚀', tmdbId: 878, type: 'movies' },
    { name: 'Thriller', slug: 'thriller', icon: '😱', tmdbId: 53, type: 'movies' },
    { name: 'War', slug: 'war', icon: '⚔️', tmdbId: 10752, type: 'both' },
    { name: 'Western', slug: 'western', icon: '🤠', tmdbId: 37, type: 'both' },
    
    // TV-specific categories
    { name: 'Kids', slug: 'kids', icon: '👶', tmdbId: 10762, type: 'tv' },
    { name: 'News', slug: 'news', icon: '📰', tmdbId: 10763, type: 'tv' },
    { name: 'Reality', slug: 'reality', icon: '📺', tmdbId: 10764, type: 'tv' },
    { name: 'Soap', slug: 'soap', icon: '🧼', tmdbId: 10766, type: 'tv' },
    { name: 'Talk', slug: 'talk', icon: '🗣️', tmdbId: 10767, type: 'tv' },
  ];

  // Render a category card
  const renderCategoryCard = (category) => (
    <Col xs={12} sm={8} md={6} lg={4} key={category.slug}>
      <Link to={`/categories/${category.slug}`}>
        <Card
          hoverable
          className="text-center bg-gray-900 border border-gray-800 hover:border-LGreen m-2"
          bodyStyle={{ padding: '20px 10px' }}
        >
          <div className="text-3xl mb-2">{category.icon}</div>
          <p className="text-white text-base bold mb-0">
            {category.name}
          </p>
        </Card>
      </Link>
    </Col>
  );

  return (
    <div className="mb-12 px-4 py-6">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl text-white">
          {title}
        </h1>
        <div className="ml-4 flex-grow h-px bg-gray-800"></div>
      </div>
      
      <Row gutter={[16, 16]}>
        {categories.map(renderCategoryCard)}
      </Row>
    </div>
  );
};

export default CategoriesSection;