import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Create the auth context
export const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Process auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Get user's ID token result with claims
          const tokenResult = await currentUser.getIdTokenResult();
          
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          
          // Combine auth user with additional data
          setUser({
            ...currentUser,
            uid: currentUser.uid,
            email: currentUser.email,
            emailVerified: currentUser.emailVerified,
            displayName: currentUser.displayName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
            roles: userData.roles || ['user'],
            role: tokenResult.claims.role || 'user', // For backward compatibility
            token: tokenResult.token,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            createdAt: userData.createdAt || null,
            lastLogin: userData.lastLogin || null
          });
        } catch (error) {
          console.error("Error setting up user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;