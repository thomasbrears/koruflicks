import React, { useEffect } from 'react';
import { Card, Typography, Empty } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { getPosterUrl } from '../../utils/helpers';

const { Text } = Typography;

const CastList = ({ credits }) => {
  // CSS class to hide scrollbars
  useEffect(() => {
    if (!document.querySelector('style[data-hide-scrollbar]')) {
      const style = document.createElement('style');
      style.setAttribute('data-hide-scrollbar', 'true');
      style.textContent = `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `;
      document.head.appendChild(style);

      return () => {
        const existingStyle = document.querySelector('style[data-hide-scrollbar]');
        if (existingStyle && !document.querySelectorAll('.hide-scrollbar').length) {
          document.head.removeChild(existingStyle);
        }
      };
    }
  }, []);

  // Scroll the carousel container horizontally with looping
  const scrollContainer = (containerId, direction) => {
    const container = document.getElementById(containerId);
    if (container) {
      const scrollAmount = container.offsetWidth * 0.75;
      let scrollTo;
      
      // Calculate new scroll position
      if (direction === 'left') {
        scrollTo = container.scrollLeft - scrollAmount;
        
        // If at or near the beginning, loop to the end
        if (scrollTo <= 0) {
          // First try normal scrolling
          container.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
          
          // After animation completes, jump to end without animation
          setTimeout(() => {
            // Get the max scroll position (total width minus visible width)
            const maxScroll = container.scrollWidth - container.clientWidth;
            container.scrollLeft = maxScroll;
          }, 400);
          return;
        }
      } else {
        scrollTo = container.scrollLeft + scrollAmount;
        
        // If at or near the end, loop to the beginning
        if (scrollTo >= container.scrollWidth - container.clientWidth - 50) {
          // First try normal scrolling
          container.scrollTo({
            left: container.scrollWidth,
            behavior: 'smooth'
          });
          
          // After animation completes, jump to beginning without animation
          setTimeout(() => {
            container.scrollLeft = 0;
          }, 400);
          return;
        }
      }
      
      // Regular scroll if not looping
      container.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  // Show the empty state if no cast members are available
  if (!credits?.cast?.length) {
    return (
      <div className="mb-8">
        <h4 className="text-lg font-medium text-white mb-2">Cast</h4>
        <Empty description={<span className="text-gray-400">No cast information available</span>} />
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-medium text-white my-0">Cast</h4>
      </div>
      
      <div className="relative">
        {/* Scroll left button */}
        <button 
          onClick={() => scrollContainer('cast-scroll', 'left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 hover:bg-opacity-90 text-white z-10 rounded-full w-10 h-10 flex items-center justify-center shadow-lg border border-gray-700 -ml-5 opacity-90 hover:opacity-100"
          aria-label="Scroll left"
        >
          <LeftOutlined />
        </button>
        
        {/* Horizontal scrolling container */}
        <div 
          id="cast-scroll"
          className="flex overflow-x-auto pb-4 pt-2 hide-scrollbar scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {credits.cast.map(person => (
            <div 
              key={person.id} 
              className="inline-block min-w-[150px] w-[150px] px-2"
            >
              <Card
                hoverable
                className="bg-black border border-gray-800 overflow-hidden rounded-lg h-full transition-all duration-300 hover:border-LGreen"
                cover={
                  <div style={{ position: 'relative' }}>
                    {person.profile_path ? (
                      <img 
                        alt={person.name} 
                        src={getPosterUrl(person.profile_path)}
                        className="w-full h-[225px] object-cover"
                      />
                    ) : (
                      <div className="w-full h-[225px] bg-gray-800 flex items-center justify-center">
                        <span className="text-4xl">👤</span>
                      </div>
                    )}
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
                        {person.name}
                      </Text>
                      {person.character && (
                        <Text style={{
                          color: '#aaa',
                          fontSize: '12px',
                          lineHeight: '1.2',
                          WebkitLineClamp: 2,
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {person.character}
                        </Text>
                      )}
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
                onClick={() => window.location.href = `/person/${person.id}`}
              />
            </div>
          ))}
        </div>
        
        {/* Scroll right button */}
        <button 
          onClick={() => scrollContainer('cast-scroll', 'right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 hover:bg-opacity-90 text-white z-10 rounded-full w-10 h-10 flex items-center justify-center shadow-lg border border-gray-700 -mr-5 opacity-90 hover:opacity-100"
          aria-label="Scroll right"
        >
          <RightOutlined />
        </button>
      </div>
    </div>
  );
};

export default CastList;