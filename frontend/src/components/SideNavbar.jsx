import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Layout, 
  Menu, 
  Drawer,
  Avatar,
  Typography,
  Skeleton,
  Button,
  Input
} from 'antd';
import {
  HomeOutlined,
  VideoCameraOutlined,
  PlaySquareOutlined,
  SearchOutlined,
  CloseOutlined,
  AppstoreOutlined,
  TagsOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import useAuth from '../hooks/useAuth';

const { Text } = Typography;

const SideNavbar = ({ visible, onClose, isMobile, isTablet, isLargeScreen }) => {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(!isLargeScreen);
  const [hovered, setHovered] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchInputRef = useRef(null);

  // For mobile, we always want the menu expanded when visible
  // On non-mobile, follow the normal rules
  const isExpanded = isMobile ? true : (!collapsed || hovered);

  // Update collapsed state when screen size changes
  useEffect(() => {
    // Default collapsed on all screens except very large ones
    setCollapsed(!isLargeScreen);
  }, [isLargeScreen]);

  // Focus the search input when it becomes active
  useEffect(() => {
    if (searchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchActive]);

  const popularCategories = [
    { key: 'action', label: 'Action' },
    { key: 'comedy', label: 'Comedy' },
    { key: 'drama', label: 'Drama' },
    { key: 'scifi', label: 'Sci-Fi' },
    { key: 'horror', label: 'Horror' },
  ];

  // Function to determine which keys should be selected based on current path
  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path === '/') return ['home'];
    if (path.startsWith('/movies')) return ['movies'];
    if (path.startsWith('/series')) return ['series'];
    if (path.startsWith('/search')) return ['search'];
    if (path.startsWith('/categories')) return ['categories'];
    if (path.startsWith('/support')) return ['support'];
    if (path.startsWith('/account')) return ['account'];
    return [];
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      if (isMobile) {
        onClose();
      }
      setSearchValue('');
      setSearchActive(false);
    }
  };

  // Logo component - different sizes based on screen size
  // Large logo when expanded, icon logo when collapsed
  const LogoComponent = () => (
    <div style={{ 
      padding: isExpanded ? '24px 16px' : '20px 0', 
      textAlign: 'center',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      margin: '0 10px 10px'
    }}>
      <Link to="/" onClick={isMobile ? onClose : undefined}>
        <img
          src={`${process.env.PUBLIC_URL}/images/${isExpanded ? 'KF-WhiteText-GreenKoru-TransBG.svg' : 'KF-Icon-WhiteText-TransBG.svg'}`}
          alt="Koru Flicks"
          style={{ 
            height: isExpanded ? '60px' : '40px',
            maxWidth: '100%',
            margin: '0 auto',
            transition: 'height 0.2s' // Smooth transition for logo size change
          }}
        />
      </Link>
    </div>
  );

  // Main Menu items
  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <Link to="/" onClick={isMobile ? onClose : undefined}>Home</Link>,
    },
    {
      key: 'movies',
      icon: <VideoCameraOutlined />,
      label: <Link to="/movies" onClick={isMobile ? onClose : undefined}>Movies</Link>,
    },
    {
      key: 'series',
      icon: <PlaySquareOutlined />,
      label: <Link to="/series" onClick={isMobile ? onClose : undefined}>Series</Link>,
    },
    {
      key: 'search',
      icon: <SearchOutlined style={{ color: '#3db636' }} />,
      label: searchActive ? (
        <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
          <Input
            ref={searchInputRef}
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onBlur={() => !searchValue && setSearchActive(false)}
            prefix={<SearchOutlined style={{ color: 'rgba(255, 255, 255, 0.7)' }} />}
            suffix={searchValue && (
              <CloseOutlined 
                style={{ color: 'rgba(255, 255, 255, 0.7)', cursor: 'pointer' }} 
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchValue('');
                  searchInputRef.current?.focus();
                }}
              />
            )}
            className="side-menu-search"
            style={{ 
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: 'white'
            }}
          />
        </form>
      ) : (
        <div
          onClick={() => setSearchActive(true)}
          style={{ cursor: 'pointer' }}
        >
          Search
        </div>
      ),
    },
    {
      type: 'divider',
    },
    // Second level menu item
    {
      key: 'categories',
      icon: <AppstoreOutlined />,
      label: 'Categories',
      children: popularCategories.map(category => ({
        key: `category-${category.key}`,
        icon: <TagsOutlined />,
        label: <Link to={`/categories/${category.key}`} onClick={isMobile ? onClose : undefined}>{category.label}</Link>,
      })),
    },
    {
      key: 'support',
      icon: <QuestionCircleOutlined />,
      label: <Link to="/support" onClick={isMobile ? onClose : undefined}>Support</Link>,
    },
  ];

  // Account menu items
  const accountItems = [
    {
      key: 'account',
      icon: (
        <Avatar 
          size="small" 
          src={user?.photoURL} 
          icon={!user?.photoURL && <UserOutlined />}
        />
      ),
      label: `Kia ora, ${user?.displayName ? user?.displayName.split(" ")[0] : "User"}`,
      children: [
        {
          key: 'profile',
          icon: <UserOutlined />,
          label: <Link to="/account/profile" onClick={isMobile ? onClose : undefined}>Profile</Link>,
        },
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: <Link to="/account/settings" onClick={isMobile ? onClose : undefined}>Settings</Link>,
        },
        {
          key: 'signout',
          icon: <LogoutOutlined />,
          label: <Text 
            onClick={() => {
              signOut();
              if (isMobile) onClose();
            }}
            style={{ color: 'rgba(255,255,255,0.65)', cursor: 'pointer' }}
          >
            Sign Out
          </Text>,
        },
      ],
    },
  ];

  // Account section 
  const AccountSection = () => (
    <div className="account-section">
      {loading ? (
        <div style={{ padding: '0 16px' }}>
          <Skeleton.Avatar active size="small" style={{ marginRight: 8 }} />
          {isExpanded && <Skeleton.Input active size="small" style={{ width: 120 }} />}
        </div>
      ) : user ? (
        // If user is logged in
        isExpanded ? (
          // Expanded view - show menu with user name
          <Menu
            theme="dark"
            mode="inline"
            style={{ 
              borderRight: 0,
              background: '#000000'
            }}
            items={accountItems}
            inlineCollapsed={!isExpanded}
          />
        ) : (
          // Collapsed view - just show avatar
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            padding: '10px 0',
            cursor: 'pointer'
          }}>
            <Avatar 
              size="small" 
              src={user?.photoURL} 
              icon={!user?.photoURL && <UserOutlined />}
            />
          </div>
        )
      ) : (
        // If user is not logged in
        isExpanded ? (
          // Expanded view - show full sign in button 
          <div style={{ padding: '0 16px' }}>
            <Button
              type="primary"
              icon={<UserOutlined />}
              style={{ 
                background: 'var(--dark-green)',
                borderColor: 'var(--dark-green)',
                width: '100%'
              }}
            >
              <Link 
                to="/auth/signin" 
                onClick={isMobile ? onClose : undefined}
                style={{ color: 'white' }}
              >
                Sign In
              </Link>
            </Button>
          </div>
        ) : (
          // Collapsed view - just show icon
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            padding: '10px 0' 
          }}>
            <Link to="/auth/signin" onClick={isMobile ? onClose : undefined}>
              <UserOutlined style={{ fontSize: '16px', color: 'white' }} />
            </Link>
          </div>
        )
      )}
    </div>
  );

  // Special handling for collapsed state search
  const collapsedMenuItems = [...menuItems];
  if (!isExpanded) {
    // Replace search item with special handling for collapsed mode
    collapsedMenuItems[3] = {
      key: 'search',
      icon: <SearchOutlined style={{ color: '#3db636', fontSize: '18px' }} />,
      label: ' ',
      onClick: () => navigate('/search')
    };
  }

  // Sidebar content - used in both drawer and fixed sidebar
  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Only show logo in sidebar on non-mobile devices */}
      {!isMobile && <LogoComponent />}
      
      {/* Main menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={getSelectedKeys()}
        style={{ 
          borderRight: 0,
          background: '#000000',
          flex: 1
        }}
        items={isExpanded ? menuItems : collapsedMenuItems}
        inlineCollapsed={!isExpanded}
      />
      
      {/* Account section */}
      <AccountSection />
    </div>
  );

  // Mobile drawer
  if (isMobile) {
    return (
      <Drawer
        title={null}
        placement="left"
        closable={false}
        onClose={onClose}
        open={visible}
        width={280}
        bodyStyle={{ 
          padding: 0, 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%',
          background: '#000000' 
        }}
        headerStyle={{ display: 'none' }}
        style={{ zIndex: 1000 }}
        maskClosable={true}
        className="side-menu-drawer"
        getContainer={false}
      >
        {/* Add logo at the top for mobile drawer */}
        <div style={{ 
          padding: '16px 16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center'
        }}>
          <Link to="/" onClick={onClose}>
            <img
              src={`${process.env.PUBLIC_URL}/images/KF-WhiteText-GreenKoru-TransBG.svg`}
              alt="Koru Flicks"
              style={{ height: '50px', maxWidth: '100%' }}
            />
          </Link>
        </div>
        
        {sidebarContent}
      </Drawer>
    );
  }

  // Desktop/Tablet fixed sidebar
  return (
    <Layout.Sider
      theme="dark"
      width={240}
      collapsible
      collapsed={collapsed && !hovered}
      collapsedWidth={80}
      trigger={null}
      onMouseEnter={() => !isMobile && !isLargeScreen && setHovered(true)}
      onMouseLeave={() => {
        if (!isMobile) {
          setHovered(false);
          if (!searchValue) {
            setSearchActive(false);
          }
        }
      }}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 99,
        boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
        display: visible ? 'block' : 'none',
        background: '#000000',
        transition: 'all 0.2s'
      }}
    >
      {sidebarContent}
    </Layout.Sider>
  );
};

export default SideNavbar;