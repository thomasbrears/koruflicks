import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { GithubOutlined, TwitterOutlined, InstagramOutlined } from '@ant-design/icons';

const Footer = () => {
  const { user, signOut } = useAuth();
  const IS_AUTHENTICATED = !!user;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white pb-6 border-t border-gray-800">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Footer Top Section */}
        <div className="pt-10 pb-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Footer Logo and Description */}
          <div className="flex flex-col space-y-4">
            <img 
              src={`/images/KF-WhiteText-GreenKoru-TransBG.svg`} 
              alt="Koru Flicks" 
              className="max-w-[180px]" 
            />
            <p className="text-gray-400 text-sm">
              Your gateway to the best streaming content. View & learn about the latest movies and TV shows and your favorite classics.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://github.com/thomasbrears/koruflicks" className="text-gray-400 hover:text-LGreen transition-colors">
                <GithubOutlined style={{ fontSize: '20px' }} />
              </a>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-lg font-medium mb-2 text-white">Quick Links</h3>
            <Link to="/" className="text-gray-400 hover:text-LGreen transition-colors">Home</Link>
            <Link to="/movies" className="text-gray-400 hover:text-LGreen transition-colors">Movies</Link>
            <Link to="/series" className="text-gray-400 hover:text-LGreen transition-colors">Series</Link>
            <Link to="/support" className="text-gray-400 hover:text-LGreen transition-colors">Support</Link>
          </div>

          {/* Account Links */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-lg font-medium mb-2 text-white">Account</h3>
            {IS_AUTHENTICATED ? (
              <>
                <Link to="/account" className="text-gray-400 hover:text-LGreen transition-colors">My Profile</Link>
                <Link to="/account" className="text-gray-400 hover:text-LGreen transition-colors">My Watchlist</Link>
                <Link to="/account" className="text-gray-400 hover:text-LGreen transition-colors">Settings</Link>
                <button 
                  onClick={signOut} 
                  className="text-gray-400 hover:text-LGreen transition-colors font-medium text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/signin" className="text-gray-400 hover:text-LGreen transition-colors">Sign In</Link>
                <Link to="/auth/signup" className="text-gray-400 hover:text-LGreen transition-colors">Create Account</Link>
              </>
            )}
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="pt-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>
              &copy; {currentYear} Koru Flicks. All rights reserved.
              <br />
              <span>Created by Thomas</span>
            </p>
            

            <div className="flex space-x-5 mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-LGreen transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-LGreen transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;