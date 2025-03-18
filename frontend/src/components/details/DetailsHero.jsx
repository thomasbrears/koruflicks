import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Modal } from 'antd';
import { 
  PlayCircleOutlined, 
  StarOutlined, 
  ArrowLeftOutlined,
  CloseOutlined
} from '@ant-design/icons';
import TrailerPlayer from './TrailerPlayer';
import { Typography } from 'antd';
import { getPosterUrl, getBackdropUrl, formatRating } from '../../utils/helpers';

const { Text } = Typography;

const DetailsHero = ({
  details,
  mediaType,
  isPlaying,
  activeTrailerKey,
  setIsPlaying,
  setActiveTrailerKey,
  playTrailer,
  videos
}) => {

  // Function to get the appropriate background image style
  const getBackgroundImageStyle = (item) => {
    // If backdrop is available, use it
    if (item?.backdrop_path) {
      return {
        backgroundImage: `url(${getBackdropUrl(item.backdrop_path)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    
    // If poster is available, use it as a fallback with zoomed-in styling
    if (item?.poster_path) {
      return {
        backgroundImage: `url(${getPosterUrl(item.poster_path, 'original')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#111',
        filter: 'blur(1px)' // Slight blur to help with readability since poster wasnt designed as backdrop
      };
    }
    
    // If no images are available, return null
    return null;
  };
  
  // Render fallback background for items without any images
  const renderBackgroundFallback = (item) => {
    const isMovie = mediaType === 'movie';
    const title = isMovie ? item.title : item.name;
    
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          {/* Abstract pattern background */}
          {Array(10).fill().map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full" 
              style={{
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 200}, 0.2)`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
        
        <div className="flex flex-col items-center justify-center text-center p-6 bg-black/40 rounded-xl z-10">
          <div className="text-5xl mb-6 text-gray-400">
            {isMovie ? '🎬' : '📺'}
          </div>
          <div className="text-xl text-gray-500 font-medium">
            {isMovie ? "Movie" : "TV Show"}
          </div>
          <div className="text-lg text-gray-400 mt-1">
            No image available
          </div>
        </div>
      </div>
    );
  };

  const isMovie = mediaType === 'movie';
  const title = isMovie ? details.title : details.name;
  const releaseDate = isMovie ? details.release_date : details.first_air_date;
  const tagline = details.tagline;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : null;

  const backgroundStyle = getBackgroundImageStyle(details);

  return (
    <div className="relative h-[600px] sm:h-[600px] md:h-[800px] mb-8">
      {/* Background Image/Video Player */}
      {isPlaying && activeTrailerKey ? (
        <TrailerPlayer 
          title={title}
          activeTrailerKey={activeTrailerKey}
          setIsPlaying={setIsPlaying}
          setActiveTrailerKey={setActiveTrailerKey}
        />
      ) : (
        // Background Image or Fallback when not playing
        <>
          {backgroundStyle ? (
            <div
              className="absolute inset-0"
              style={backgroundStyle}
            >
              {/* Universal gradient overlay*/}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" style={{ zIndex: 10 }}>
                {/* Additional top-to-bottom gradient for poster images */}
                {!details.backdrop_path && details.poster_path && (
                  <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent"></div>
                )}
              </div>
              
              {/* Centered Play Button */}
              <div className="absolute inset-0 flex items-center justify-center play-button-container" style={{ zIndex: 30 }}>
                <button
                  onClick={() => {
                    const hasTrailer = videos && videos.some(video => 
                      video.site === 'YouTube' && 
                      (video.type === 'Trailer' || video.type === 'Teaser')
                    );
                    
                    if (!hasTrailer) {
                      Modal.info({
                        title: 'No Trailer Available',
                        content: 'Sorry, no trailer is available for this title.',
                        okText: 'Got it',
                        className: 'trailer-notification'
                      });
                      return;
                    }
                    
                    playTrailer();
                  }}
                  className="bg-LGreen/80 hover:bg-LGreen text-white p-8 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-xl cursor-pointer"
                  aria-label="Play trailer"
                  style={{ position: 'relative', zIndex: 50 }}
                >
                  <PlayCircleOutlined style={{ fontSize: '64px' }} />
                </button>
              </div>
            </div>
          ) : (
            renderBackgroundFallback(details)
          )}
        </>
      )}

      {/* Movie/Show Info - only show when not playing */}
      {!isPlaying && (
        <div className="relative z-20 flex flex-col justify-end h-full px-4 sm:px-8 md:px-10 pb-12 max-w-3xl">
          <h1 className="text-white text-2xl sm:text-3xl md:text-5xl font-bold mb-2">{title}</h1>
          
          {/* Subtitle with media type, year and raiting */}
          <div className="text-gray-300 text-sm sm:text-base mb-4 flex items-center">
            <span className="mr-2">{isMovie ? 'Movie' : 'Series'}</span>
            {releaseYear && (
              <>
                <span className="mx-2">•</span>
                <span>{releaseYear}</span>
              </>
            )}
            <span className="mx-2">•</span>
            <div className="flex items-center">
              <StarOutlined className="text-yellow-400 mr-1" />
              <span>{formatRating(details.vote_average)}</span>
            </div>
          </div>
          
          {/* Genre tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {details.genres?.map(genre => (
              <Tag 
                key={genre.id} 
                className="bg-LGreen/20 border-LGreen text-LGreen"
              >
                {genre.name}
              </Tag>
            ))}
          </div>
          
          {/* Tagline */}
          <p className="text-white/90 text-sm sm:text-base mb-6">
            {tagline ? <span className="italic block mb-2 text-gray-300">{tagline}</span> : null}
          </p>
        </div>
      )}
    </div>
  );
};

export default DetailsHero;