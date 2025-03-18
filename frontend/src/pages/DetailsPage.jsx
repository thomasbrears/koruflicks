// Main page with the movies/shows details and the player. 
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Empty, Spin, Tag, Button } from 'antd';
import { LoadingOutlined, InfoCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { fetchFromAPI } from '../utils/api';
import { getCountryName } from '../utils/helpers';

// Details components
import BackButton from '../components/details/BackButton';
import DetailsHero from '../components/details/DetailsHero';
import MovieInfo from '../components/details/MovieInfo';
import CastList from '../components/details/CastList';
import WatchProviders from '../components/details/WatchProviders';
import MediaRecommendations from '../components/details/MediaRecommendations';
import SeasonsList from '../components/details/SeasonsList';
import ShareButtons from '../components/details/ShareButtons';

const DetailsPage = () => {
  // Get URL parameters
  const params = useParams();
  const { mediaType: urlMediaType, id } = params;
  
  // Map 'series' to 'tv' for API calls (with fallback)
  const mediaType = urlMediaType === 'series' ? 'tv' : urlMediaType;
  
  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [keywords, setKeywords] = useState(null);
  const [externalIds, setExternalIds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrailerKey, setActiveTrailerKey] = useState(null);
  const [watchProviders, setWatchProviders] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [availableCountries, setAvailableCountries] = useState([]);

  useEffect(() => {
    if (!mediaType || !id) {
      console.error("Invalid parameters:", { mediaType, id });
      setError("Invalid URL. Please check the URL and try again.");
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      try {        
        // Fetch main details
        const detailsData = await fetchFromAPI(`${mediaType}/${id}`);
        setDetails(detailsData);

        // Fetch credits (cast and crew)
        const creditsData = await fetchFromAPI(`${mediaType}/${id}/credits`);
        setCredits(creditsData);

        // Fetch videos (trailers, teasers, etc.)
        const videosData = await fetchFromAPI(`${mediaType}/${id}/videos`);
        setVideos(videosData.results);

        // Fetch similar titles
        const similarData = await fetchFromAPI(`${mediaType}/${id}/similar`);
        setSimilar(similarData.results.map(item => ({
          ...item,
          media_type: mediaType === 'tv' ? 'series' : mediaType 
        })));
        
        // Fetch recommendations
        const recommendationsData = await fetchFromAPI(`${mediaType}/${id}/recommendations`);
        setRecommendations(recommendationsData.results.map(item => ({
          ...item,
          media_type: mediaType === 'tv' ? 'series' : mediaType
        })));
        
        // Fetch keywords
        const keywordsData = await fetchFromAPI(`${mediaType}/${id}/keywords`);
        setKeywords(keywordsData);
        
        // Fetch external IDs
        const externalIdsData = await fetchFromAPI(`${mediaType}/${id}/external_ids`);
        setExternalIds(externalIdsData);

      } catch (err) {
        console.error(`Error fetching ${mediaType} details:`, err);
        setError(`Failed to load ${mediaType === 'movie' ? 'movie' : 'series'} details.`);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
    // Reset page position when navigating between different titles
    window.scrollTo(0, 0);
  }, [mediaType, id]);

  // Update details object with additional data
  useEffect(() => {
    if (details && (externalIds || keywords)) {
      let updatedDetails = { ...details };
      
      if (externalIds) {
        updatedDetails.external_ids = externalIds;
      }
      
      if (keywords) {
        updatedDetails.keywords = keywords;
      }
      
      // Only update if something changed
      if (
        (externalIds && (!details.external_ids || details.external_ids !== externalIds)) ||
        (keywords && (!details.keywords || details.keywords !== keywords))
      ) {
        setDetails(updatedDetails);
      }
    }
  }, [externalIds, keywords, details]);

  // Fetch watch providers (needs valid mediaType and id)
  useEffect(() => {
    if (!mediaType || !id) {
      return;
    }
    
    const fetchWatchProviders = async () => {
      try {
        const providersData = await fetchFromAPI(`${mediaType}/${id}/watch/providers`);
        setWatchProviders(providersData.results);
        
        // Set available countries based on provider data
        if (providersData.results) {
          const countries = Object.keys(providersData.results)
            .filter(code => code.length === 2) // Only valid country codes
            .sort((a, b) => getCountryName(a).localeCompare(getCountryName(b)));
          
          setAvailableCountries(countries);
          
          // Set default country to user's country if available, otherwise US or the first available
          const browserCountry = navigator.language?.split('-')[1];
          if (browserCountry && countries.includes(browserCountry)) {
            setSelectedCountry(browserCountry);
          } else if (countries.includes('US')) {
            setSelectedCountry('US');
          } else if (countries.length > 0) {
            setSelectedCountry(countries[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching watch providers:', err);
      }
    };
  
    fetchWatchProviders();
  }, [mediaType, id]);

  // Function to get trailer key
  const getTrailerKey = () => {
    if (!videos || videos.length === 0) {
      return null;
    }
    
    // First look for an official trailer on YouTube
    const officialTrailer = videos.find(
      video => 
        video.type === 'Trailer' && 
        video.site === 'YouTube' && 
        video.name.toLowerCase().includes('official')
    );
    
    if (officialTrailer) {
      return officialTrailer.key;
    }
    
    // Then any trailer on YouTube
    const anyTrailer = videos.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    );
    
    if (anyTrailer) {
      return anyTrailer.key;
    }
    
    // Finally, just the first YouTube video
    const anyVideo = videos.find(video => video.site === 'YouTube');
    
    if (anyVideo) {
      return anyVideo.key;
    }
    
    return null;
  };

  // Play trailer function
  const playTrailer = () => {
    const trailerKey = getTrailerKey();
    if (trailerKey) {
      setActiveTrailerKey(trailerKey);
      setIsPlaying(true);
    } else {
      console.error('No trailer found.');
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <Spin 
            size="large" 
            indicator={
              <LoadingOutlined 
                style={{ 
                  fontSize: 48, 
                  color: '#1EB954' // LGreen
                }} 
                spin 
              />
            }
          />
          <div className="mt-4 text-gray-400">
            Loading {mediaType === 'movie' ? 'movie' : 'series'} details...
          </div>
        </div>
        <style>{`
          :global(.ant-spin-text) {
            color: #d9d9d9 !important;
            margin-top: 12px;
            font-size: 16px;
          }
          
          :global(.ant-spin) {
            max-height: none;
          }
        `}</style>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center p-4">
        <div className="text-center p-6 bg-gray-900 rounded-lg border border-gray-700 max-w-xl">
          <InfoCircleOutlined className="text-5xl text-red-600" />
          <Typography.Title level={3} className="text-white mt-4">Something went wrong</Typography.Title>
          <Typography.Text className="text-gray-400 block mb-6">{error}</Typography.Text>
          <Link to="/">
            <Button type="primary" className="bg-LGreen border-LGreen hover:bg-green-600 hover:border-green-600">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!details) {
    return null;
  }

  // Determine if it's a movie or TV show
  const isMovie = mediaType === 'movie';

  return (
    <div className="bg-black text-white min-h-screen">
      <BackButton />
      
      <DetailsHero 
        details={details}
        mediaType={mediaType}
        isPlaying={isPlaying}
        activeTrailerKey={activeTrailerKey}
        setIsPlaying={setIsPlaying}
        setActiveTrailerKey={setActiveTrailerKey}
        playTrailer={playTrailer}
        videos={videos}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Poster Column */}
          <div className="lg:w-1/3 xl:w-1/4">
            <div className="lg:sticky lg:top-8">
              <MovieInfo details={details} mediaType={mediaType} />
            </div>
          </div>
          
          {/* Content Column */}
          <div className="lg:w-2/3 xl:w-3/4">
            <div className="mb-8">              
              {/* Overview */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-white mb-2">Overview</h4>
                <p className="text-gray-200 text-base leading-relaxed">
                  {details.overview || 'No overview available.'}
                </p>
              </div>
              
              {/* Keywords if available */}
              {details.keywords && details.keywords.keywords && details.keywords.keywords.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {details.keywords.keywords.map(keyword => (
                      <Tag 
                        key={keyword.id} 
                        className="bg-gray-800 text-gray-300 border-gray-700"
                      >
                        {keyword.name}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              {!isPlaying && (
                <Button 
                  type="primary" 
                  icon={<PlayCircleOutlined />}
                  onClick={playTrailer}
                  size="large"
                  className="bg-LGreen border-LGreen hover:bg-green-600 hover:border-green-600 mb-6"
                >
                  Watch Trailer
                </Button>
              )}

              {/* External Links */}
              {details.external_ids && (
                <div className="mb-6">
                  <div className="flex gap-3">
                    {details.external_ids.imdb_id && (
                      <a 
                        href={`https://www.imdb.com/title/${details.external_ids.imdb_id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-LGreen hover:text-white transition-colors"
                      >
                        IMDb ☍
                      </a>
                    )}
                    {details.homepage && (
                      <a 
                        href={details.homepage} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-LGreen hover:text-white transition-colors"
                      >
                        Official Website ☍
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Where to watch section */}
              <WatchProviders 
                watchProviders={watchProviders}
                selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
                availableCountries={availableCountries}
                getCountryName={getCountryName}
              />
              
              {/* Cast */}
              <CastList credits={credits} />

              {/* Share buttons */}
              <ShareButtons title={isMovie ? details.title : details.name} />
            </div>
          </div>
        </div>
        
        {/* Recommendations Section */}
        <MediaRecommendations recommendations={recommendations} />
        
        {/* Seasons list (for TV shows) */}
        {!isMovie && details.seasons && details.seasons.length > 0 && (
          <SeasonsList seasons={details.seasons} />
        )}
      </div>

      {/* Global styles */}
      <style>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .trailer-notification .ant-modal-content {
          background-color: #111;
          border: 1px solid #333;
        }
        
        .trailer-notification .ant-modal-title,
        .trailer-notification .ant-modal-body {
          color: white;
        }
        
        .trailer-notification .ant-btn-primary {
          background-color: #1EB954;
          border-color: #1EB954;
        }
        
        .trailer-notification .ant-btn-primary:hover {
          background-color: #19a347;
          border-color: #19a347;
        }
        
        /* Add pointer events styling to ensure clickability */
        .play-button-container {
          pointer-events: all;
        }
        
        /* Fix tab colors for dark mode */
        :global(.ant-tabs-tab) {
          color: #d9d9d9 !important;
        }
        
        :global(.ant-tabs-tab:hover) {
          color: white !important;
        }
        
        :global(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
          color: #1EB954 !important;
        }
        
        :global(.ant-tabs-ink-bar) {
          background-color: #1EB954 !important;
        }
        
        /* Fix text colors for recommendations */
        :global(.ant-card-meta-title) {
          color: white !important;
        }
        
        :global(.ant-card-meta-description) {
          color: #d9d9d9 !important;
        }
        
        :global(.ant-empty-description) {
          color: #d9d9d9 !important;
        }
      `}</style>
    </div>
  );
};

export default DetailsPage;