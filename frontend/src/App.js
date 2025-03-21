import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Toastify message container and style
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

// Pages
import HomePage from './pages/HomePage';
import SupportPage from './pages/SupportPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import MagicLinkSigninPage from './pages/MagicLinkSigninPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import NotFoundPage from './pages/NotFoundPage';
import ManageAccount from './pages/ManageAccountPage';
import SearchResultsPage from './pages/SearchResultsPage';
import CategoryResultsPage from './pages/CategoryResultsPage';
import DetailsPage from './pages/DetailsPage';
import CategoriesPage from './components/CategoriesSection';
import AccountPage from './pages/AccountPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

// Auth hook and components
import useAuth from './hooks/useAuth';
import Loading from './components/Loading';
import AppLayout from './layouts/AppLayout';

// style sheets
import './style/Global.css'; 
import './style/Navigation.css';

// Add this custom CSS for fixing Ant Design styling issues
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

// PrivateRoute for protecting routes based on roles and authentication
const PrivateRoute = ({ component: Component, roleRequired, ...rest }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    // If the user is not logged in store the current URL and redirect to login
    sessionStorage.setItem('previousUrl', location.pathname);
    return <Navigate to="/auth/signin" />;
  }
  
  // Check role if required
  const hasPermission = roleRequired
    ? Array.isArray(roleRequired)
      ? roleRequired.includes(user.role)
      : user.role === roleRequired
    : true;
  
  if (!hasPermission) {
    return <Navigate to="/" />; // Redirect to homepage if user does not have the required role
  }

  // If authenticated and role matches, render the component
  return <Component {...rest} />;
};

// Wrapper component for content that needs layout
const LayoutWrapper = ({ children }) => {
  return (
    <AppLayout>{children}</AppLayout>
  );
};

// Auth pages that don't need the side navbar
const AuthPages = ({ children }) => {
  return (
    <div className="flex-grow">{children}</div>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <style>{customStyles}</style>
      <div className="App flex flex-col min-h-screen">
        {/* Toastify message container with default actions*/}
        <ToastContainer
          theme="dark"
          position="top-center"
          draggable={true}
          closeOnClick={true}
          autoClose={5000}
          hideProgressBar={false}
          pauseOnHover={true}
          pauseOnFocusLoss={false}
        />
        <Router>
          <Routes>
            {/* Auth pages without navbar */}
            <Route path="/auth/*" element={
              <AuthPages>
                <Routes>
                  <Route path="/signin" element={<SignInPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/magic-link-signin" element={<MagicLinkSigninPage />} />
                  <Route path="/verify-email" element={<VerifyEmailPage />} />
                </Routes>
              </AuthPages>
            } />
            
            {/* Main content with navigation */}
            <Route path="/*" element={
              <LayoutWrapper>
                <Routes>
                  
                  {/* Public routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/support" element={<SupportPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                  <Route path="/search" element={<SearchResultsPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/:mediaType/:id" element={<DetailsPage />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/categories/:categoryName" element={<CategoryResultsPage />} />

                  {/* Restricted to logged-in users */}
                  <Route path="/account" element={<PrivateRoute component={AccountPage} />} />
                  {/* Protected account routes 
                  <Route 
                    path="/account/profile" 
                    element={
                      <PrivateRoute>
                        <ProfilePage />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/account/edit" 
                    element={
                      <PrivateRoute>
                        <EditAccountPage />
                      </PrivateRoute>
                    } 
                  />*/}
                </Routes>
              </LayoutWrapper>
            } />
          </Routes>
        </Router>
      </div>
    </HelmetProvider>
  );
};

export default App;