import { admin } from '../firebase.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authToken = req.headers.authtoken;
    
    if (!authToken) {
      return res.status(401).json({ message: 'Access denied. No authentication token provided.' });
    }
    
    try {
      const decodedToken = await admin.auth().verifyIdToken(authToken);
      req.user = decodedToken;
      
      // Log success for debugging
      console.log(`Authentication successful for user: ${decodedToken.uid}`);
      
      next();
    } catch (error) {
      console.error('Error verifying authentication token:', error);
      
      // More detailed error logging
      if (error.code === 'auth/id-token-expired') {
        return res.status(401).json({ message: 'Token expired. Please login again.' });
      } else if (error.code === 'auth/id-token-revoked') {
        return res.status(401).json({ message: 'Token has been revoked. Please login again.' });
      } else if (error.code === 'auth/invalid-id-token') {
        return res.status(403).json({ message: 'Invalid token provided.' });
      } else {
        return res.status(403).json({ 
          message: 'Access denied. Invalid or expired token.',
          error: error.message 
        });
      }
    }
  } catch (error) {
    console.error('Error in auth middleware:', error);
    return res.status(500).json({ 
      message: 'Internal server error.',
      error: error.message 
    });
  }
};