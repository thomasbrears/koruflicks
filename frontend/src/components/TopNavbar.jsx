import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';

const { Header } = Layout;

const TopNavbar = ({ toggleSidebar, isMobile, sidebarVisible }) => {
  const [isOpen, setIsOpen] = useState(sidebarVisible || false);
  
  // Sync local state with sidebar visibility
  // Always define hooks at the top level, before any conditionals
  useEffect(() => {
    if (isMobile) {
      setIsOpen(sidebarVisible);
    }
  }, [sidebarVisible, isMobile]);
  
  // Handle toggle with animation
  const handleToggle = () => {
    setIsOpen(!isOpen);
    toggleSidebar();
  };

  // Only render for mobile devices (after all hooks are declared)
  if (!isMobile) {
    return null;
  }
  
  return (
    <Header 
      style={{ 
        position: 'fixed',
        zIndex: 100,
        width: '100%',
        background: '#000000', // Black background
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
        height: '70px'
      }}
    >
      <div className="logo">
        <Link to="/">
          <img
            src={`${process.env.PUBLIC_URL}/images/KF-WhiteText-GreenKoru-TransBG.svg`}
            alt="Koru Flicks"
            style={{ height: '50px' }}
          />
        </Link>
      </div>
      
      {/* Hamburger to X animation button */}
      <div className="menu-button">
        <button 
          onClick={handleToggle} 
          style={{ 
            background: 'transparent', 
            border: 'none', 
            cursor: 'pointer',
            width: '32px',
            height: '32px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 0
          }}
        >
          <div 
            style={{
              backgroundColor: '#3db636', // LGreen
              width: '32px',
              height: '3px',
              borderRadius: '4px',
              transition: 'all 0.3s ease',
              position: 'absolute',
              top: isOpen ? '50%' : 'calc(50% - 8px)',
              transform: isOpen ? 'rotate(45deg)' : 'rotate(0)'
            }} 
          />
          <div 
            style={{
              backgroundColor: '#3db636', // LGreen
              width: '32px',
              height: '3px',
              borderRadius: '4px',
              margin: '0',
              position: 'absolute',
              top: 'calc(50% - 1.5px)',
              transition: 'all 0.3s ease',
              opacity: isOpen ? '0' : '1'
            }} 
          />
          <div 
            style={{
              backgroundColor: '#3db636', // LGreen
              width: '32px',
              height: '3px',
              borderRadius: '4px',
              transition: 'all 0.3s ease',
              position: 'absolute',
              top: isOpen ? '50%' : 'calc(50% + 8px)',
              transform: isOpen ? 'rotate(-45deg)' : 'rotate(0)'
            }} 
          />
        </button>
      </div>
    </Header>
  );
};

export default TopNavbar;