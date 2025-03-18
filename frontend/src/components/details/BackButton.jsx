import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const BackButton = () => {
  return (
    <div className="container mx-auto relative z-50">
      <Link to="/" className="inline-flex items-center text-white hover:text-LGreen absolute top-4 left-4 bg-black/30 px-3 py-2 rounded-lg transition-colors">
        <ArrowLeftOutlined className="mr-2" />
        <span>Home</span>
      </Link>
    </div>
  );
};

export default BackButton;