import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import TopNavbar from '../components/TopNavbar';
import SideNavbar from '../components/SideNavbar';
import Footer from '../components/Footer';

const { Content } = Layout;

const AppLayout = ({ children }) => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  const checkScreenSize = () => {
    const width = window.innerWidth;
    const mobile = width < 768;
    const tablet = width >= 768 && width < 1024;
    const largeScreen = width >= 1500;
    
    setIsMobile(mobile);
    setIsTablet(tablet);
    setIsLargeScreen(largeScreen);
    
    // Auto-hide sidebar on mobile
    if (mobile) {
      setSidebarVisible(false);
    } else {
      setSidebarVisible(true);
    }
  };

  useEffect(() => {
    // Check on mount
    checkScreenSize();
    
    // resize listener
    window.addEventListener('resize', checkScreenSize);
    
    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Effect to manage body overflow when the sidebar is visible on mobile
  useEffect(() => {
    if (isMobile) {
      // Prevent body scrolling when sidebar is open on mobile
      document.body.style.overflow = sidebarVisible ? 'hidden' : '';
      document.body.style.position = sidebarVisible ? 'fixed' : '';
      document.body.style.width = sidebarVisible ? '100%' : '';
      document.body.style.top = sidebarVisible ? '0' : '';
    } else {
      // Reset body styles when not on mobile
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    }
    
    // Cleanup function to reset styles when component unmounts
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isMobile, sidebarVisible]);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Calculate content margin based on device type and sidebar state
  const getContentMarginLeft = () => {
    if (isMobile) return 0;
    if (!sidebarVisible) return 0;
    if (isTablet || !isLargeScreen) return 80; // Collapsed width
    return 240; // Full width
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Top Navbar (only on mobile) */}
      <TopNavbar 
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
        sidebarVisible={sidebarVisible}
      />
      
      {/* Side Navbar */}
      <SideNavbar 
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        isMobile={isMobile}
        isTablet={isTablet}
        isLargeScreen={isLargeScreen}
      />
      
      {/* Main Content */}
      <Layout style={{ 
        marginLeft: getContentMarginLeft(),
        marginTop: isMobile ? 70 : 0, // Top margin only on mobile for the top navbar
        transition: 'margin 0.2s',
        background: '#fff',
        width: isMobile || !sidebarVisible ? '100%' : `calc(100% - ${getContentMarginLeft()}px)`
      }}>
        <Content style={{ 
          minHeight: isMobile ? 'calc(100vh - 140px)' : 'calc(100vh - 70px)', 
          background: '#fff',
          width: '100%'
        }}>
          {children}
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default AppLayout;