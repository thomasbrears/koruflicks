import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Loading from './Loading';

/**
 * A wrapper component for routes that require authentication
 * If the user is not authenticated, they will be redirected to the signin page
 */
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication status
  if (loading) {
    return <Loading message="Checking authentication..." />;
  }

  // If not authenticated, redirect to signin page and remember the current location
  if (!user) {
    // Save the current URL to session storage so we can redirect back after login
    sessionStorage.setItem('previousUrl', location.pathname);
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected route
  return children;
};

export default PrivateRoute;