import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import { FaPlay, FaHeart, FaPlus, FaInfoCircle, FaFilm, FaTv } from "react-icons/fa";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { Tooltip, Tag, notification, message, Skeleton } from "antd";
import { CheckCircleFilled, InfoCircleFilled } from "@ant-design/icons";

/**
 * A reusable hero slider component
 * 
 * @param {Object} props Component props
 * @param {Array} props.items Array of movies/shows to display in the slider
 * @param {String} props.pageType Type of page (home, category, etc.)
 * @param {String} props.title Optional title to display in the header banner
 * @param {Object} props.sliderSettings Optional settings to override default slider behavior
 * @param {Function} props.onItemClick Optional callback when an item is clicked
 * @param {Boolean} props.loading Optional loading state to show skeleton loader
 */
const HeroSlider = ({ 
  items = [], 
  pageType = "home",
  title = null,
  sliderSettings = {},
  onItemClick = null,
  loading = false
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = React.useRef(null);

  // Determine if we should show the skeleton loader
  const shouldShowSkeleton = loading || items.length === 0;
  
  // Configure notification placement
  notification.config({
    placement: 'topRight',
    duration: 3,
  });

  useEffect(() => {
    // Set up Firebase authentication listener
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });

    // Clean up listener on component unmount
    return () => unsubscribe();
  }, []);

  // Next arrow component
  const NextArrow = (props) => {
    return (
      <button
        onClick={() => sliderRef.current.slickNext()}
        className="absolute right-5 bottom-10 bg-black bg-opacity-70 hover:bg-opacity-90 text-white z-20 rounded-full w-12 h-12 flex items-center justify-center shadow-lg border border-gray-700 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Next slide"
      >
        <RightOutlined />
      </button>
    );
  };

  // Previous arrow component
  const PrevArrow = (props) => {
    return (
      <button
        onClick={() => sliderRef.current.slickPrev()}
        className="absolute left-5 bottom-10 bg-black bg-opacity-70 hover:bg-opacity-90 text-white z-20 rounded-full w-12 h-12 flex items-center justify-center shadow-lg border border-gray-700 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Previous slide"
      >
        <LeftOutlined />
      </button>
    );
  };

  // Default slider settings
  const defaultSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false, // use custom arrows
    beforeChange: (current, next) => setCurrentSlide(next),
  };

  // Merge default settings with any custom settings
  const settings = { ...defaultSettings, ...sliderSettings };

  // Determine the appropriate height class based on page type
  const getHeightClass = () => {
    if (pageType === 'category') {
      return "h-[400px] sm:h-[450px] md:h-[500px]";
    } else {
      // Default for home and other pages
      return "h-[600px] sm:h-[600px] md:h-[800px]";
    }
  };
  
  const heightClass = getHeightClass();

  const handleWatchNow = (item) => {
    if (onItemClick) {
      onItemClick(item, 'watch');
      return;
    }
    
    const isMovie = item.media_type === "movie" || item.title;
    const isShow = item.media_type === "tv" || item.name;

    let path = "";
    if (isMovie) {
      path = `/movie/${item.id}`;
    } else if (isShow) {
      path = `/tv/${item.id}`;
    }

    if (!path) {
      console.error("Item is neither a movie nor a show:", item);
      return;
    }

    navigate(path);
  };

  const handleMoreInfo = (item) => {
    if (onItemClick) {
      onItemClick(item, 'info');
      return;
    }
    
    const isMovie = item.media_type === "movie" || item.title;
    const isShow = item.media_type === "tv" || item.name;

    let path = "";
    if (isMovie) {
      path = `/movie/${item.id}`;
    } else if (isShow) {
      path = `/tv/${item.id}`;
    }

    if (!path) {
      console.error("Item is neither a movie nor a show:", item);
      return;
    }

    navigate(path);
  };

  // Function for heart and plus button presses
  const handleButtonPress = (buttonType, item) => {
    // if not logged in, show notification and return
    if (!isLoggedIn) {
      notification.info({
        message: 'Authentication Required',
        description: 'You need to log in to use this feature.',
        icon: <InfoCircleFilled style={{ color: '#1890ff' }} />,
        className: 'custom-notification-info',
      });
      return;
    }

    const title = item.title || item.name;
    
    // Heart/like action
    if (buttonType === 'heart') {
      message.success({
        content: `Added "${title}" to your favorites`,
        icon: <CheckCircleFilled style={{ color: '#3db63b' }} />
      });
    } else {
      // watch later action
      notification.success({
        message: 'Added to Watch Later',
        description: `"${title}" has been added to your Watch Later list.`,
        icon: <CheckCircleFilled style={{ color: '#3db63b' }} />,
        className: 'custom-notification-success',
      });
    }
  };

  // Function to truncate text with ellipsis
  const truncateText = (text, maxLength = 150) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };
  
  // Get the appropriate image URL, trying backdrop first, then poster, then fallback
  const getBackgroundImageStyle = (item) => {
    // If backdrop is available, use it
    if (item.backdrop_path) {
      return {
        backgroundImage: `url(https://image.tmdb.org/t/p/original${item.backdrop_path})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    
    // If poster is available, use it as a fallback with zoomed-in styling
    if (item.poster_path) {
      return {
        backgroundImage: `url(https://image.tmdb.org/t/p/original${item.poster_path})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#111',
        filter: 'blur(1px)' // Slight blur to help with readability since poster wasn't designed as backdrop
      };
    }
    
    // If no images are available, return null and we'll use the fallback component
    return null;
  };
  
  // Render fallback background for items without any images
  const renderBackgroundFallback = (item) => {
    const isMovie = item.media_type === "movie" || item.title;
    const mediaType = isMovie ? "Movie" : "TV Show";
    const title = item.title || item.name || "Unknown Title";
    
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
            {isMovie ? <FaFilm /> : <FaTv />}
          </div>
          <div className="text-xl text-gray-500 font-medium">
            {mediaType}
          </div>
          <div className="text-lg text-gray-400 mt-1">
            No image available
          </div>
        </div>
      </div>
    );
  };

  // Skeleton loader component for hero section
  const renderSkeletonLoader = () => {
    return (
      <div className="w-full">
        <div className={`relative ${heightClass}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
          </div>
          
          {/* Content skeleton */}
          <div className="relative z-10 flex flex-col justify-center h-full px-4 sm:px-8 md:px-10 max-w-2xl">
            {/* Title */}
            <Skeleton.Input 
              active 
              style={{ 
                width: '70%', 
                height: 48,
                marginBottom: '16px',
                '--ant-skeleton-color': '#333'
              }} 
            />
            
            {/* Subtitle */}
            <Skeleton.Input 
              active 
              style={{ 
                width: '40%', 
                height: 20,
                marginBottom: '24px',
                '--ant-skeleton-color': '#333'
              }} 
            />
            
            {/* Description */}
            <Skeleton
              active
              paragraph={{ rows: 3, width: ['100%', '95%', '90%'] }}
              title={false}
              style={{
                '--ant-skeleton-color': '#333',
                marginBottom: '24px'
              }}
            />
            
            {/* Buttons */}
            <div className="flex gap-3">
              <Skeleton.Button 
                active 
                style={{ 
                  width: 140, 
                  height: 48,
                  '--ant-skeleton-color': '#333'
                }} 
              />
              <Skeleton.Button 
                active 
                style={{ 
                  width: 100, 
                  height: 48,
                  '--ant-skeleton-color': '#333'
                }} 
              />
              <div className="flex gap-2 ml-2">
                <Skeleton.Avatar 
                  active 
                  size={48} 
                  shape="circle"
                  style={{ '--ant-skeleton-color': '#333' }}
                />
                <Skeleton.Avatar 
                  active 
                  size={48} 
                  shape="circle"
                  style={{ '--ant-skeleton-color': '#333' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // If in loading state or no items, show skeleton
  if (shouldShowSkeleton) {
    return renderSkeletonLoader();
  }

  return (
    <div className="relative w-full">
      {/* Optional title banner */}
      {title && (
        <div className="absolute top-0 left-0 right-0 z-20 px-8 py-2 bg-gradient-to-b from-black to-transparent flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-DGreen/80 text-white px-4 py-1 rounded-lg backdrop-blur-md">
              <span>{title}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom navigation arrows */}
      <PrevArrow />
      <NextArrow />
      
      <Slider ref={sliderRef} {...settings}>
        {items.map((item) => {
          const isMovie = item.media_type === "movie" || item.title;
          const isShow = item.media_type === "tv" || item.name;
          const mediaLabel = isMovie ? "Movie" : isShow ? "Series" : "Unknown";
          const releaseYear = item.release_date ? new Date(item.release_date).getFullYear() : 
                             item.first_air_date ? new Date(item.first_air_date).getFullYear() : null;
          
          // Get background image style, which might be backdrop, poster, or null
          const backgroundStyle = getBackgroundImageStyle(item);

          return (
            <div key={item.id} className={`relative ${heightClass}`}>
              {/* Background Image or Fallback */}
              {backgroundStyle ? (
                <div
                  className="absolute inset-0"
                  style={backgroundStyle}
                >
                  {/* Universal gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent">
                    {/* Additional top-to-bottom gradient for poster images */}
                    {!item.backdrop_path && item.poster_path && (
                      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent"></div>
                    )}
                  </div>
                </div>
              ) : (
                renderBackgroundFallback(item)
              )}

              {/* Movie/Show Info */}
              <div className="relative z-10 flex flex-col justify-center h-full px-4 sm:px-8 md:px-10 max-w-2xl">
                <h1 className="text-white text-2xl sm:text-3xl md:text-5xl mb-2">{item.title || item.name}</h1>
                
                {/* Subtitle with media type and year */}
                <div className="text-gray-300 text-sm sm:text-base mb-4 flex items-center">
                  <span className="mr-2">{mediaLabel}</span>
                  {releaseYear && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{releaseYear}</span>
                    </>
                  )}
                  {item.vote_average && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span>{parseFloat(item.vote_average).toFixed(1)}</span>
                      </span>
                    </>
                  )}
                </div>
                
                {/* Truncated description */}
                <p className="text-white/90 text-sm sm:text-base mb-6">
                  {item.overview ? truncateText(item.overview, 200) : " "}
                </p>

                {/* Buttons Container */}
                <div className="flex items-center gap-3 mt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleWatchNow(item)}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 min-w-[140px] max-w-[160px]"
                  >
                    <FaPlay /> Watch Now
                  </motion.button>
                  
                  <div className="flex gap-2 ml-2">
                    <Tooltip title="Add to Watch Later" placement="top" color="#000" overlayInnerStyle={{ border: '1px solid #328B31' }}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleButtonPress('plus', item)}
                        className="bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 flex-shrink-0"
                      >
                        <FaPlus />
                      </motion.button>
                    </Tooltip>
                    
                    <Tooltip title="Like" placement="top" color="#000" overlayInnerStyle={{ border: '1px solid #328B31' }}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleButtonPress('heart', item)}
                        className="bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 flex-shrink-0"
                      >
                        <FaHeart />
                      </motion.button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default HeroSlider;