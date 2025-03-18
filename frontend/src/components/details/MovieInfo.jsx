import React from 'react';
import { Typography } from 'antd';
import { 
  CalendarOutlined, 
  FieldTimeOutlined, 
  GlobalOutlined,
  TeamOutlined, 
  StarOutlined,
  InfoCircleOutlined,
  FundOutlined,
} from '@ant-design/icons';
import { getPosterUrl, formatRuntime, formatDate, formatRating } from '../../utils/helpers';

const { Text } = Typography;

const MovieInfo = ({ details, mediaType }) => {

  const isMovie = mediaType === 'movie';
  const releaseDate = isMovie ? details.release_date : details.first_air_date;

  return (
    <>
      <div className="rounded-lg overflow-hidden border border-gray-800 shadow-lg">
        {details.poster_path ? (
          <img 
            src={getPosterUrl(details.poster_path)} 
            alt={isMovie ? details.title : details.name}
            className="w-full h-auto"
          />
        ) : (
          <div className="h-[400px] bg-gradient-to-b from-gray-800 to-gray-900 flex flex-col justify-center items-center p-5 text-center">
            <div className="text-5xl mb-4 opacity-60">
              🎬
            </div>
            <p className="text-gray-400 text-sm font-bold">
              No image available
            </p>
          </div>
        )}
      </div>
      
      {/* Movie/Show Info */}
      <div className="mt-6 bg-gray-900/80 rounded-lg p-4 border border-gray-800">
        <h3 className="text-lg font-semibold mb-4">Information</h3>
        
        <div className="space-y-3">
          {/* Release Date */}
          <div className="flex items-start">
            <CalendarOutlined className="text-LGreen mt-1 mr-3" />
            <div>
              <div className="text-gray-400 text-sm">
                {isMovie ? 'Release Date' : 'First Air Date'}
              </div>
              <div>{formatDate(releaseDate)}</div>
            </div>
          </div>
          
          {/* Runtime / Episode Length */}
          <div className="flex items-start">
            <FieldTimeOutlined className="text-LGreen mt-1 mr-3" />
            <div>
              <div className="text-gray-400 text-sm">
                {isMovie ? 'Runtime' : 'Episode Length'}
              </div>
              <div>{isMovie ? formatRuntime(details.runtime) : formatRuntime(details.episode_run_time?.[0])}</div>
            </div>
          </div>
          
          {/* Status (For TV Shows) */}
          {!isMovie && (
            <div className="flex items-start">
              <InfoCircleOutlined className="text-LGreen mt-1 mr-3" />
              <div>
                <div className="text-gray-400 text-sm">Status</div>
                <div>{details.status}</div>
              </div>
            </div>
          )}
          
          {/* Seasons (For TV Shows) */}
          {!isMovie && details.number_of_seasons > 0 && (
            <div className="flex items-start">
              <TeamOutlined className="text-LGreen mt-1 mr-3" />
              <div>
                <div className="text-gray-400 text-sm">Seasons</div>
                <div>{details.number_of_seasons} Season{details.number_of_seasons !== 1 ? 's' : ''} ({details.number_of_episodes} Episodes)</div>
              </div>
            </div>
          )}
          
          {/* Original Language */}
          <div className="flex items-start">
            <GlobalOutlined className="text-LGreen mt-1 mr-3" />
            <div>
              <div className="text-gray-400 text-sm">Language</div>
              <div>{new Intl.DisplayNames(['en'], { type: 'language' }).of(details.original_language)}</div>
            </div>
          </div>
          
          {/* Rating */}
          <div className="flex items-start">
            <StarOutlined className="text-LGreen mt-1 mr-3" />
            <div>
              <div className="text-gray-400 text-sm">Rating</div>
              <div className="flex items-center">
                <span className="text-yellow-400 mr-2 font-semibold">{formatRating(details.vote_average)}</span>
                <span className="text-gray-400 text-sm">({details.vote_count.toLocaleString()} votes)</span>
              </div>
            </div>
          </div>

          {/* Budget (For Movies) */}
          {isMovie && details.budget > 0 && (
            <div className="flex items-start">
              <FundOutlined className="text-LGreen mt-1 mr-3" />
              <div>
                <div className="text-gray-400 text-sm">Budget</div>
                <div>${details.budget.toLocaleString()}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MovieInfo;