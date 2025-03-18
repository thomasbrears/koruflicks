import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined, CloseOutlined } from '@ant-design/icons';

const TrailerPlayer = ({ title, activeTrailerKey, setIsPlaying, setActiveTrailerKey }) => {
  return (
    <div className="absolute inset-0 bg-black">
      {/* Top control strip */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-sm flex items-center justify-between px-4 z-50">
        {/* Back button */}
        <Link to="/" className="inline-flex items-center text-white hover:text-LGreen px-3 py-2 rounded-lg transition-colors">
          <ArrowLeftOutlined className="mr-2" />
          <span>Home</span>
        </Link>
        
        {/* Title in center */}
        <div className="text-white font-medium truncate max-w-md text-center">
          {title} <span className="text-gray-400 text-sm">Trailer</span>
        </div>
        
        {/* Close button */}
        <button 
          onClick={() => {
            setIsPlaying(false);
            setActiveTrailerKey(null);
          }}
          className="text-white hover:text-LGreen p-2 rounded-lg transition-colors"
          aria-label="Close trailer"
        >
          <CloseOutlined style={{ fontSize: '24px' }} />
        </button>
      </div>
      
      {/* Video iframe*/}
      <div className="absolute inset-0 pt-16">
        <iframe
          title={`${title} Trailer`}
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${activeTrailerKey}?autoplay=1&controls=1`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
    </div>
  );
};

export default TrailerPlayer;