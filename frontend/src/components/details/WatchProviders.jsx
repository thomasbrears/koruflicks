import React from 'react';
import { Select, Empty, Tooltip } from 'antd';
import { GlobalOutlined, ShoppingOutlined } from '@ant-design/icons';

const WatchProviders = ({ 
  watchProviders, 
  selectedCountry, 
  setSelectedCountry, 
  availableCountries,
  getCountryName
}) => {
  if (!watchProviders || Object.keys(watchProviders).length === 0) {
    return null;
  }

  const selectStyles = {
    selector: {
      backgroundColor: '#111',
      borderColor: '#333',
      color: 'white'
    },
    option: {
      backgroundColor: '#111',
      color: 'white',
      '&:hover': {
        backgroundColor: '#222'
      }
    }
  };

  return (
    <div className="mb-8 mt-10">
        <div className="bg-gray-900/80 rounded-lg p-6 border border-gray-800">
            <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium text-white">Where to Watch</h4>
            
            {availableCountries.length > 0 && (
            <div className="flex items-center">
                <GlobalOutlined className="text-gray-400 mr-2" />
                <Select
                value={selectedCountry}
                onChange={(value) => setSelectedCountry(value)}
                style={{ width: 160 }}
                options={availableCountries.map(code => ({
                    value: code,
                    label: getCountryName(code)
                }))}
                styles={{
                    selector: selectStyles.selector,
                    dropdown: {
                    backgroundColor: '#111',
                    color: 'white',
                    borderColor: '#333'
                    },
                    option: selectStyles.option,
                    optionSelected: {
                    backgroundColor: '#222',
                    color: 'white'
                    }
                }}
                popupClassName="custom-dropdown-dark"
                className="border-gray-700 text-white"
                />
            </div>
            )}
        </div>
      
        {watchProviders[selectedCountry] ? (
          <>
            {/* Streaming services */}
            {watchProviders[selectedCountry].flatrate && watchProviders[selectedCountry].flatrate.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-medium text-white mb-3">
                  <span className="inline-flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Streaming
                  </span>
                </h4>
                <div className="flex flex-wrap gap-3">
                  {watchProviders[selectedCountry].flatrate.map(provider => (
                    <Tooltip key={provider.provider_id} title={provider.provider_name}>
                      <div className="flex flex-col items-center">
                        <div className="w-14 h-14 rounded-lg overflow-hidden shadow-lg hover:border-LGreen transition-colors">
                          <img 
                            src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`} 
                            alt={provider.provider_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-xs text-gray-300 mt-1 text-center max-w-[70px] truncate">
                          {provider.provider_name}
                        </span>
                      </div>
                    </Tooltip>
                  ))}
                </div>
              </div>
            )}
            
            {/* Rental services */}
            {watchProviders[selectedCountry].rent && watchProviders[selectedCountry].rent.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-medium text-white mb-3">
                  <span className="inline-flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    Rent
                  </span>
                </h4>
                <div className="flex flex-wrap gap-3">
                  {watchProviders[selectedCountry].rent.map(provider => (
                    <Tooltip key={provider.provider_id} title={provider.provider_name}>
                      <div className="flex flex-col items-center">
                        <div className="w-14 h-14 rounded-lg overflow-hidden shadow-lg hover:border-LGreen transition-colors">
                          <img 
                            src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`} 
                            alt={provider.provider_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-xs text-gray-300 mt-1 text-center max-w-[70px] truncate">
                          {provider.provider_name}
                        </span>
                      </div>
                    </Tooltip>
                  ))}
                </div>
              </div>
            )}
            
            {/* Buy services */}
            {watchProviders[selectedCountry].buy && watchProviders[selectedCountry].buy.length > 0 && (
              <div className="mb-4">
                <h4 className="text-lg font-medium text-white mb-3">
                  <span className="inline-flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Buy
                  </span>
                </h4>
                <div className="flex flex-wrap gap-3">
                  {watchProviders[selectedCountry].buy.map(provider => (
                    <Tooltip key={provider.provider_id} title={provider.provider_name}>
                      <div className="flex flex-col items-center">
                        <div className="w-14 h-14 rounded-lg overflow-hidden shadow-lg hover:border-LGreen transition-colors">
                          <img 
                            src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`} 
                            alt={provider.provider_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-xs text-gray-300 mt-1 text-center max-w-[70px] truncate">
                          {provider.provider_name}
                        </span>
                      </div>
                    </Tooltip>
                  ))}
                </div>
              </div>
            )}
            
            {/* External link */}
            {watchProviders[selectedCountry].link && (
              <div className="mt-6 pt-4 border-t border-gray-700">
                <a 
                  href={watchProviders[selectedCountry].link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-LGreen hover:text-white transition-colors"
                >
                  <ShoppingOutlined className="mr-2" />
                  View all watch options in {getCountryName(selectedCountry)}
                </a>
              </div>
            )}

            {/* No streaming/rent/buy options */}
            {!watchProviders[selectedCountry].flatrate && !watchProviders[selectedCountry].rent && !watchProviders[selectedCountry].buy && (
              <div className="text-center py-6">
                <Empty 
                  description={
                    <span className="text-gray-400">
                      No streaming options available in {getCountryName(selectedCountry)}
                    </span>
                  } 
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-6">
            <Empty 
              description={
                <span className="text-gray-400">
                  No watch provider information available
                </span>
              } 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        )}
      </div>

      {/* Custom CSS for the dropdown styling */}
      <style>{`
        /* Custom styling for Ant Design Select dropdown */
        :global(.custom-dropdown-dark .ant-select-item) {
          color: white !important;
          background-color: #111 !important;
        }
        
        :global(.custom-dropdown-dark .ant-select-item-option-active) {
          background-color: #222 !important;
        }
        
        :global(.custom-dropdown-dark .ant-select-item-option-selected) {
          background-color: #333 !important;
        }
        
        :global(.ant-select-dropdown) {
          background-color: #111 !important;
          border: 1px solid #333 !important;
        }
        
        :global(.ant-select-selection-item) {
          color: white !important;
        }
        
        :global(.ant-select-selector) {
          background-color: #111 !important;
          border-color: #333 !important;
          color: white !important;
        }
        
        :global(.ant-select-arrow) {
          color: white !important;
        }
      `}</style>
    </div>
  );
};

export default WatchProviders;