import React from 'react';
import { Helmet } from 'react-helmet-async'; // HelmetProvider to dynamicly set page head for titles, seo etc

const ManageAccountPage = () => {
  return (
    <>
      <Helmet><title>Manage my Account | Koru Flicks</title></Helmet>
      
      <div className="p-6">
        <p>This is the Manage account page.</p>
      </div>
    </>
  );
};

export default ManageAccountPage;
