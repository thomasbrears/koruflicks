import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Pages
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import MagicLinkSigninPage from './pages/MagicLinkSigninPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import NotFoundPage from './pages/NotFoundPage';
import SearchResultsPage from './pages/SearchResultsPage';
import CategoryResultsPage from './pages/CategoryResultsPage';
import DetailsPage from './pages/DetailsPage';
import CategoriesPage from './components/CategoriesSection';
import AccountPage from './pages/AccountPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import SeriesPage from './pages/SerriesPage';
import MoviesPage from './pages/MoviesPage';
import UnauthorizedPage from './pages/UnauthorizedPage'; 
import LibraryPage from './pages/LibraryPage';

// Support Pages
import SupportPage from './pages/support/SupportPage';
import NewTicketPage from './pages/support/NewTicketPage';
import TicketsPage from './pages/support/TicketsPage';

// Auth context
import { AuthProvider } from './context/AuthContext';
import useAuth from './hooks/useAuth';
import Loading from './components/Loading';
import AppLayout from './layouts/AppLayout';

// style sheets
import './style/Global.css'; 
import './style/Navigation.css';

// Custom CSS for fixing Ant Design styling issues
const customStyles = `
  .ant-drawer-body {
    padding: 0;
  }
  
  .side-menu-drawer .ant-drawer-content-wrapper {
    transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1) !important;
  }
  
  /* Fix for mobile safari 100vh issue */
  .ant-drawer-content {
    height: 100% !important;
  }
  
  /* Make content full width by default */
  .ant-layout-content {
    padding: 0 !important;
  }
`;

// Enhanced PrivateRoute for protecting routes based on roles and authentication
const PrivateRoute = ({ roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const userRoles = user?.roles || []; // Get roles array from user object

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    // If the user is not logged in, store the current URL and redirect to login
    sessionStorage.setItem('previousUrl', location.pathname);
    return <Navigate to="/auth/signin" state={{ from: location }} />;
  }
  
  // Check if user has any of the required roles
  const hasRequiredRole = roles 
    ? roles.some(role => userRoles.includes(role)) 
    : true;
  
  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  // If authenticated and role matches, render the nested routes
  return <Outlet />;
};

// Wrapper component for content that needs layout
const LayoutWrapper = () => {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

// Auth pages wrapper
const AuthPages = () => {
  return (
    <div className="flex-grow">
      <Outlet />
    </div>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <style>{customStyles}</style>
        <div className="App flex flex-col min-h-screen">
          <Router>
            <Routes>
              {/* Auth pages without navbar */}
              <Route path="/auth" element={<AuthPages />}>
                <Route path="signin" element={<SignInPage />} />
                <Route path="signup" element={<SignUpPage />} />
                <Route path="reset-password" element={<ResetPasswordPage />} />
                <Route path="magic-link-signin" element={<MagicLinkSigninPage />} />
                <Route path="verify-email" element={<VerifyEmailPage />} />
              </Route>
              
              {/* Unauthorized access page */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              
              {/* Main content with navigation */}
              <Route path="/" element={<LayoutWrapper />}>
                {/* Public routes */}
                <Route index element={<HomePage />} />
                <Route path="support/ticket/new" element={<NewTicketPage />} />
                <Route path="support" element={<SupportPage />} />
                <Route path="search" element={<SearchResultsPage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="privacy" element={<PrivacyPage />} />
                <Route path=":mediaType/:id" element={<DetailsPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="categories/:categoryName" element={<CategoryResultsPage />} />
                <Route path="movies" element={<MoviesPage />} />
                <Route path="series" element={<SeriesPage />} />

                {/* Restricted to logged-in users (any role) */}
                <Route element={<PrivateRoute roles={['user', 'premium', 'admin', 'moderator']} />}>
                  <Route path="account" element={<AccountPage />} />
                  <Route path="library" element={<LibraryPage />} />
                  <Route path="support/tickets" element={<TicketsPage />} />
                </Route>
                
                {/* Restricted to premium users */}
                <Route element={<PrivateRoute roles={['premium', 'admin']} />}>
                  <Route path="premium" element={<div>Premium Content</div>} />
                </Route>
                
                {/* Restricted to admin users */}
                <Route element={<PrivateRoute roles={['admin']} />}>
                  <Route path="admin" element={<div>Admin Dashboard</div>} />
                </Route>
                
                {/* Restricted to moderator users */}
                <Route element={<PrivateRoute roles={['moderator', 'admin']} />}>
                  <Route path="moderate" element={<div>Moderation Dashboard</div>} />
                </Route>
                
                {/* 404 route */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Router>
        </div>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;