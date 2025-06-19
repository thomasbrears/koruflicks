import React, { useState } from 'react';
import { Tabs, List, Empty } from 'antd';
import { 
  ClockCircleOutlined, 
  HeartOutlined, 
  CommentOutlined 
} from '@ant-design/icons';

const UserContent = ({ user, watchlist = [], likedContent = [], recentComments = [] }) => {
  const [activeContentTab, setActiveContentTab] = useState('watchlist');

  const tabItems = [
    {
      key: 'watchlist',
      label: <span className="text-white"><ClockCircleOutlined /> Watch Later</span>,
      children: (
        watchlist.length > 0 ? (
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
            dataSource={watchlist}
            renderItem={item => (
              <List.Item>
                {/* Movie/Show Card would go here */}
                <div className="bg-gray-800 p-4 rounded">
                  <p className="text-white">{item.title || 'Movie Title'}</p>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Empty 
            description={<span className="text-gray-400">Your watchlist is empty</span>}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="my-12"
          />
        )
      )
    },
    {
      key: 'liked',
      label: <span className="text-white"><HeartOutlined /> Liked</span>,
      children: (
        likedContent.length > 0 ? (
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
            dataSource={likedContent}
            renderItem={item => (
              <List.Item>
                {/* Movie/Show Card would go here */}
                <div className="bg-gray-800 p-4 rounded">
                  <p className="text-white">{item.title || 'Movie Title'}</p>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Empty 
            description={<span className="text-gray-400">You haven't liked any content yet</span>}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="my-12"
          />
        )
      )
    },
    {
      key: 'comments',
      label: <span className="text-white"><CommentOutlined /> Recent Comments</span>,
      children: (
        recentComments.length > 0 ? (
          <List
            dataSource={recentComments}
            renderItem={item => (
              <List.Item>
                {/* Comment Card would go here */}
                <div className="bg-gray-800 p-4 rounded w-full">
                  <p className="text-white font-semibold">{item.movie || 'Movie Title'}</p>
                  <p className="text-gray-400">{item.comment || 'Your comment...'}</p>
                  <p className="text-gray-500 text-xs mt-2">{item.date || new Date().toLocaleDateString()}</p>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Empty 
            description={<span className="text-gray-400">You haven't made any comments yet</span>}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="my-12"
          />
        )
      )
    }
  ];

  return (
    <div>
      <h4 className="text-white text-xl font-semibold mb-4">My Content</h4>
      <Tabs 
        activeKey={activeContentTab} 
        onChange={setActiveContentTab}
        className="text-white custom-tabs"
        items={tabItems}
      />
    </div>
  );
};

export default UserContent;