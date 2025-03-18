import React from 'react';
import { Helmet } from 'react-helmet-async'; // HelmetProvider to dynamicly set page head for titles, seo etc

const ContactPage = () => {
  return (
    <>
      <Helmet><title>Contact Us | Koru Flicks</title></Helmet>
      
      <div className="p-6">
        <p>This is the contact page.</p>
      </div>
    </>
  );
};

export default ContactPage;
