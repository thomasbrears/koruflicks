import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <>
            <Helmet><title>404: Page Not Found | Koru Flicks</title></Helmet>
            <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
                {/* Logo */}
                <div className="mb-8">
                    <img src="/images/KF-WhiteText-GreenKoru-TransBG.svg" alt="Koru Flicks Logo" className="h-16" />
                </div>
                
                {/* Error Content */}
                <div className="max-w-2xl w-full bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
                    <div className="p-8 text-center">
                        <h1 className="text-6xl font-bold text-LGreen mb-2">404</h1>
                        <h2 className="text-3xl font-bold text-white mb-6">Page Not Found</h2>
                        
                        <div className="h-1 w-24 bg-LGreen mx-auto my-6"></div>
                        
                        <p className="text-gray-300 text-lg mb-8">
                            The content you're looking for could not be found. <br />
                            It might have been moved or doesn't exist.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
                            <Link to="/" className="bg-LGreen hover:bg-LGreen-dark text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
                            >Return Home
                            </Link>
                            <Link to="/browse" className="border border-LGreen text-LGreen hover:bg-LGreen hover:bg-opacity-20 px-6 py-3 rounded-md font-medium transition-colors duration-200"
                            >Browse Movies
                            </Link>
                            <Link to="/support/ticket/new" className="border border-LGreen text-LGreen hover:bg-LGreen hover:bg-opacity-20 px-6 py-3 rounded-md font-medium transition-colors duration-200"
                            > Contact us & Report this error
                            </Link>
                        </div>
                    </div>
                    
                    {/* Decorative film strip */}
                    <div className="h-8 w-full bg-gray-800 flex">
                        {[...Array(20)].map((_, i) => (
                            <div 
                                key={i} 
                                className="h-full w-4 bg-gray-900 mx-1"
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotFoundPage;