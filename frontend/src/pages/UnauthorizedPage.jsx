import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button, Result } from 'antd';

const UnauthorizedPage = () => {
  return (
    <>
      <Helmet>
        <title>Unauthorized Access | Koru Flicks</title>
      </Helmet>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
        <Result
          status="403"
          title={<h1 className="text-3xl text-white font-bold">Access Denied</h1>}
          subTitle={
            <p className="text-gray-300 mb-6">
              Sorry, you don't have permission to access this page.
            </p>
          }
          extra={
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                type="primary" 
                className="bg-LGreen hover:bg-DGreen text-black hover:text-white"
              >
                <Link to="/">Back to Home</Link>
              </Button>
              <Button className="border border-gray-600 text-gray-300 hover:text-white">
                <Link to="/support">Contact Support</Link>
              </Button>
            </div>
          }
        />
      </div>
    </>
  );
};

export default UnauthorizedPage;