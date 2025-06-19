import { useEffect, useState, useRef, useCallback } from "react";
import { auth, db } from "../firebaseConfig";
import { useNavigate, useLocation } from "react-router-dom";
import { notification, Modal } from "antd";
import { doc, getDoc } from "firebase/firestore";

const useAuth = () => {
  // State for user data and loading status
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Refs to prevent duplicate notifications and track token timing
  const HAS_SHOWN_EXPIRED_TOAST = useRef(false);
  const HAS_SHOWN_SIGNOUT_TOAST = useRef(false);
  const TOKEN_EXPIRY_TIME = useRef(null);
  const TOKEN_REFRESH_TIMEOUT = useRef(null);
  const SESSION_WARNING_TIMEOUT = useRef(null);
  
  // Activity tracking to manage token refreshes efficiently
  const LAST_ACTIVITY_TIME = useRef(Date.now());
  const INACTIVE_THRESHOLD = 30 * 60 * 1000; // 30 minutes
  const SESSION_WARNING_TIME = 2 * 60 * 1000; // 2 minutes before expiry

  // Function to update the timestamp when user is active
  const updateActivityTimestamp = useCallback(() => {
    LAST_ACTIVITY_TIME.current = Date.now();
  }, []);

  // Set up event listeners to track user activity
  useEffect(() => {
    const EVENTS = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    
    EVENTS.forEach(event => 
      window.addEventListener(event, updateActivityTimestamp)
    );

    return () => {
      EVENTS.forEach(event => 
        window.removeEventListener(event, updateActivityTimestamp)
      );
    };
  }, [updateActivityTimestamp]);

  // Fetch user data from Firestore (roles and profile data)
  const getUserData = useCallback(async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Store the profile data in state
        setProfileData(userData);
        
        // Return roles for auth purposes
        return {
          roles: userData.roles || ['user'],
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
        };
      }
      return { 
        roles: ['user'],
        firstName: '',
        lastName: ''
      }; // Default values
    } catch (error) {
      console.error("Error fetching user data:", error);
      return { 
        roles: ['user'],
        firstName: '',
        lastName: '' 
      };
    }
  }, []);

  // Get full name from profile data
  const getFullName = useCallback(() => {
    if (profileData) {
      const firstName = profileData.firstName || '';
      const lastName = profileData.lastName || '';
      const fullName = `${firstName} ${lastName}`.trim();
      return fullName || null;
    }
    return null;
  }, [profileData]);

  // Setup session warning
  const setupSessionWarning = useCallback((expiryTime) => {
    // Clear any existing warning
    if (SESSION_WARNING_TIMEOUT.current) {
      clearTimeout(SESSION_WARNING_TIMEOUT.current);
    }
    
    const warningTime = expiryTime - SESSION_WARNING_TIME;
    const timeUntilWarning = warningTime - Date.now();
    
    if (timeUntilWarning > 0) {
      SESSION_WARNING_TIMEOUT.current = setTimeout(() => {
        // Only show warning if user has been active recently
        if (Date.now() - LAST_ACTIVITY_TIME.current < INACTIVE_THRESHOLD) {
          Modal.confirm({
            title: 'Your session is about to expire',
            content: 'You will be logged out in 2 minutes due to inactivity. Would you like to stay signed in?',
            okText: 'Stay Signed In',
            cancelText: 'Log Out',
            onOk: () => {
              // User wants to stay signed in, refresh token
              if (auth.currentUser) {
                refreshUserToken(auth.currentUser);
              }
              updateActivityTimestamp();
            },
            onCancel: () => {
              // User chose to sign out
              signOut(true);
            },
          });
        }
      }, timeUntilWarning);
    }
  }, [updateActivityTimestamp]);

  // Optimized token refresh strategy
  const scheduleTokenRefresh = useCallback((tokenExpiryTime) => {
    // Clear any existing timeout
    if (TOKEN_REFRESH_TIMEOUT.current) {
      clearTimeout(TOKEN_REFRESH_TIMEOUT.current);
    }
    
    // Calculate time until token expires (minus 5 minute buffer)
    const refreshTime = Math.max(tokenExpiryTime - Date.now() - (5 * 60 * 1000), 0);
    
    // If token is already expired or will expire soon, refresh immediately
    if (refreshTime < 60000) { // Less than a minute until expiry
      if (auth.currentUser) {
        refreshUserToken(auth.currentUser);
      }
      return;
    }
    
    // Schedule refresh
    TOKEN_REFRESH_TIMEOUT.current = setTimeout(() => {
      // Only refresh if user has been active recently
      if (Date.now() - LAST_ACTIVITY_TIME.current < INACTIVE_THRESHOLD && auth.currentUser) {
        refreshUserToken(auth.currentUser);
      }
    }, refreshTime);
  }, []);

  // Function to refresh the user's auth token
  const refreshUserToken = useCallback(async (currentUser) => {
    try {
      // Request a fresh token from Firebase auth
      const tokenResult = await currentUser.getIdTokenResult(true);
      
      // Calculate when the token will expire
      const EXPIRY_TIME = tokenResult.claims.exp * 1000; // Convert to milliseconds
      TOKEN_EXPIRY_TIME.current = EXPIRY_TIME;

      // Get user data from Firestore (includes roles and profile data)
      const userData = await getUserData(currentUser.uid);
      
      // Schedule token refresh
      scheduleTokenRefresh(EXPIRY_TIME);
      
      // Setup session warning
      setupSessionWarning(EXPIRY_TIME);
      
      // Construct full name from first/last name
      const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || null;
      
      // Update user state with fresh token, claims, and data from Firestore
      setUser({
        ...currentUser,
        roles: userData.roles, // Array of roles from Firestore
        role: tokenResult.claims.role, // Keep for backward compatibility
        token: tokenResult.token,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        fullName: fullName
      });
      
      setLoading(false);
    } catch (error) {
      console.error("Error refreshing token:", error);
      
      if (!HAS_SHOWN_EXPIRED_TOAST.current) {
        notification.error({
          message: 'Session Expired',
          description: 'Your session has expired. Please sign in again.',
        });
        HAS_SHOWN_EXPIRED_TOAST.current = true;
      }
      
      sessionStorage.setItem('previousUrl', location.pathname);
      signOut(false);
    }
  }, [getUserData, scheduleTokenRefresh, setupSessionWarning, location.pathname]);

  // Main auth state listener effect
  useEffect(() => {
    // Reset toast flags when component mounts
    HAS_SHOWN_EXPIRED_TOAST.current = false;
    HAS_SHOWN_SIGNOUT_TOAST.current = false;
    
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        await refreshUserToken(currentUser);
      } else {
        setUser(null);
        setProfileData(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      
      if (TOKEN_REFRESH_TIMEOUT.current) {
        clearTimeout(TOKEN_REFRESH_TIMEOUT.current);
      }
      
      if (SESSION_WARNING_TIMEOUT.current) {
        clearTimeout(SESSION_WARNING_TIMEOUT.current);
      }
    };
  }, [refreshUserToken]);

  // Effect to handle tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user) {
        const timeUntilExpiry = TOKEN_EXPIRY_TIME.current - Date.now();
        
        if (timeUntilExpiry < 10 * 60 * 1000) {
          refreshUserToken(auth.currentUser);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, refreshUserToken]);

  // Function to sign out the user
  const signOut = useCallback((showToast = true) => {
    // Clear any scheduled token refresh
    if (TOKEN_REFRESH_TIMEOUT.current) {
      clearTimeout(TOKEN_REFRESH_TIMEOUT.current);
    }
    
    // Clear any session warning
    if (SESSION_WARNING_TIMEOUT.current) {
      clearTimeout(SESSION_WARNING_TIMEOUT.current);
    }
    
    // Sign out from Firebase
    auth.signOut().then(() => {
      setUser(null);
      setProfileData(null);
      navigate("/");
      
      // Remove any stored user data
      sessionStorage.removeItem('userInfo');
      localStorage.removeItem('hasSession');
      
      // Show sign out notification only if requested AND not already shown
      if (showToast && !HAS_SHOWN_SIGNOUT_TOAST.current) {
        notification.success({
          message: 'Signed Out',
          description: 'You have been signed out! Have a great day!',
          placement: 'top'
        });
        HAS_SHOWN_SIGNOUT_TOAST.current = true;
      }
    });
  }, [navigate]);

  // Return the auth state and functions
  return { 
    user, 
    loading, 
    signOut,
    updateActivityTimestamp,
    refreshToken: () => {
      if (auth.currentUser) {
        refreshUserToken(auth.currentUser);
      }
    },
    profileData,
    getFullName,
    refreshUserData: async () => {
      if (auth.currentUser) {
        await getUserData(auth.currentUser.uid);
      }
    }
  };
};

export default useAuth;