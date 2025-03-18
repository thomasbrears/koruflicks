export const authMiddleware = async (req, res, next) => {
  // List of public routes that do not require authentication
  const publicRoutes = ['/api/movies/popular'];

  // If the route is public, skip authentication
  if (publicRoutes.includes(req.originalUrl)) {
    return next();
  }

  const { authtoken } = req.headers;

  if (authtoken) {
    try {
      // Verify the ID token using Firebase Admin SDK
      req.user = await admin.auth().verifyIdToken(authtoken);
      next();  // Token is valid, proceed to the next middleware or route handler
    } catch (e) {
      console.error("Invalid token:", e);  // Log the error
      return res.status(401).send("Unauthorised");  // Invalid token
    }
  } else {
    return res.status(401).send("Unauthorised");  // No token provided
  }
};
