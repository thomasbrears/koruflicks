import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Typography, Empty, Button } from 'antd';
import { StarOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { getPosterUrl, formatRating, getYear } from '../../utils/helpers';

const { Text, Title } = Typography;

const MediaRecommendations = ({ recommendations }) => {

  if (!recommendations?.length) {
    return (
      <div className="mt-12">
        <Title level={3} style={{ color: 'white', margin: 0 }} className="text-white m-0 mb-6">Recommendations:</Title>
        <Empty 
          description={<span className="text-gray-400">No recommendations available</span>}
          className="bg-gray-900/30 py-12 rounded-lg border border-gray-800" 
        />
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <Title level={3} style={{ color: 'white', margin: 0 }} className="text-white m-0">Recommendations:</Title>
        {recommendations.length > 8 && (
          <Button type="text" className="text-LGreen hover:text-white">
            View All <ArrowRightOutlined />
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {recommendations.slice(0, 12).map(item => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link to={`/${item.media_type}/${item.id}`}>
              <Card
                hoverable
                className="bg-black border border-gray-800 overflow-hidden rounded-lg h-full transition-all duration-300 hover:border-LGreen"
                cover={
                  <div className="relative">
                    {item.poster_path ? (
                      <img
                        alt={item.title || item.name}
                        src={getPosterUrl(item.poster_path)}
                        className="h-[280px] object-cover w-full"
                      />
                    ) : (
                      <div className="h-[280px] bg-gradient-to-b from-gray-800 to-gray-900 flex flex-col justify-center items-center p-5 text-center">
                        <div className="text-4xl mb-2 opacity-60">🎬</div>
                        <p className="text-gray-400 text-xs">No image</p>
                      </div>
                    )}
                    {/* Rating badge */}
                    <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-yellow-400 p-1 px-2 rounded-full text-xs flex items-center">
                      <StarOutlined className="mr-1" style={{ fontSize: '10px' }} />
                      {formatRating(item.vote_average)}
                    </div>
                    
                    {/* Title overlay with gradient */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 pt-16 bg-gradient-to-t from-black via-black via-opacity-80 to-transparent">
                      <Text style={{
                        color: 'white',
                        fontSize: '14px',
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
                      <Text style={{
                        color: '#aaa',
                        fontSize: '12px',
                        lineHeight: '1.2',
                        display: 'block'
                      }}>
                        {getYear(item.release_date || item.first_air_date)}
                      </Text>
                    </div>
                  </div>
                }
                styles={{ 
                  body: { 
                    padding: '0', 
                    backgroundColor: '#111',
                    height: '0',
                    overflow: 'hidden'
                  }
                }}
              />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MediaRecommendations;