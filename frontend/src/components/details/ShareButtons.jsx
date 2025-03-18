import React from 'react';
import { Tooltip, message } from 'antd';
import { 
  TwitterOutlined, 
  FacebookOutlined, 
  RedditOutlined, 
  LinkOutlined 
} from '@ant-design/icons';

const ShareButtons = ({ title }) => {
  // Function to copy link to clipboard
  const copyLinkToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        message.success('Link copied to clipboard!');
      })
      .catch(() => {
        message.error('Failed to copy link.');
      });
  };

  return (
    <div className="mb-6">
      <h4 className="text-lg font-medium text-white mb-3">Share</h4>
      <div className="flex gap-3">
        <Tooltip title="Share on X ☍">
          <a 
            href={`https://twitter.com/intent/tweet?text=Check out ${title}&url=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full flex items-center justify-center w-10 h-10 transition-colors"
          >
            <TwitterOutlined style={{ fontSize: '18px' }} />
          </a>
        </Tooltip>
        
        <Tooltip title="Share on Facebook ☍">
          <a 
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full flex items-center justify-center w-10 h-10 transition-colors"
          >
            <FacebookOutlined style={{ fontSize: '18px' }} />
          </a>
        </Tooltip>
        
        <Tooltip title="Share on Reddit ☍">
          <a 
            href={`https://www.reddit.com/submit?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full flex items-center justify-center w-10 h-10 transition-colors"
          >
            <RedditOutlined style={{ fontSize: '18px' }} />
          </a>
        </Tooltip>
        
        <Tooltip title="Copy Link">
          <button 
            onClick={copyLinkToClipboard}
            className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full flex items-center justify-center w-10 h-10 transition-colors"
          >
            <LinkOutlined style={{ fontSize: '18px' }} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default ShareButtons;