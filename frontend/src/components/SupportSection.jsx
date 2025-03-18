import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Typography } from 'antd';

const { Title, Text, Paragraph } = Typography;

const SupportSection = () => {
  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 p-8 my-12">
      <div className="flex flex-col md:flex-row items-center">
        <div className="w-full md:w-3/4 pr-0 md:pr-8">
          <h2 className="text-3xl mb-4 text-white">
            Need Help?
          </h2>
          <p className="text-gray-400 text-base mb-4">
            Can't find what you're looking for? Having technical issues? We're here to help you get the most out of your streaming experience.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/support">
              <button className="bg-LGreen hover:bg-green-500 text-white font-bold py-3 px-6 rounded-md transition duration-300">
                Visit Support Center
              </button>
            </Link>
            <Link to="/support/ticket/new">
              <button className="bg-transparent hover:bg-gray-800 text-white font-bold py-3 px-6 border border-gray-700 rounded-md transition duration-300">
                Contact us
              </button>
            </Link>
          </div>
        </div>
        <div className="w-full md:w-1/4 mt-8 md:mt-0 flex justify-center">
          <div className="text-center">
            <span role="img" aria-label="support" className="text-7xl">🎬</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SupportSection;