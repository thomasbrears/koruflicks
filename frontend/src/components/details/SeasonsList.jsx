import React from 'react';
import { Card, Typography } from 'antd';
import { getPosterUrl, getYear } from '../../utils/helpers';

const { Text, Title } = Typography;

const SeasonsList = ({ seasons }) => {

  return (
    <div className="mt-12">
      <Title level={3} className="text-white mb-6">Seasons</Title>
      
      <div className="overflow-x-auto pb-4 hide-scrollbar">
        <div className="flex gap-4 py-4">
          {seasons.map(season => (
            <div key={season.id} className="min-w-[200px] w-[200px]">
              <Card
                hoverable
                cover={
                  season.poster_path ? (
                    <img 
                      alt={season.name} 
                      src={getPosterUrl(season.poster_path)}
                      className="w-full h-[300px] object-cover"
                    />
                  ) : (
                    <div className="w-full h-[300px] bg-gray-800 flex items-center justify-center">
                      <span className="text-4xl">📺</span>
                    </div>
                  )
                }
                styles={{ body: { padding: '12px', background: '#111' } }}
              >
                <div>
                  <p className="text-white block">
                    {season.name}
                  </p>
                  <p className="text-gray-400 text-xs mb-2">
                    {season.episode_count} Episodes • {getYear(season.air_date)}
                  </p>
                  {season.overview && (
                    <p className="text-gray-300 text-xs line-clamp-3">
                      {season.overview}
                    </p>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeasonsList;