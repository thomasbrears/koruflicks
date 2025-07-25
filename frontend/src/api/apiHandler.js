import axios from 'axios';
import { auth } from '../firebaseConfig';

// Dynamic API URL for local or deployed environments
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://koruflicks.vercel.app/api'
  : 'http://localhost:8000/api';

// Helper to get current user's auth token
const getAuthToken = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  
  try {
    return await currentUser.getIdToken();
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Helper function to handle API errors
const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code outside the 2xx range
    if (error.response.status === 401 || error.response.status === 403) {
      throw new Error('Authentication error: You do not have access to this resource');
    }
    throw new Error(error.response.data?.message || 'Server error');
  } else if (error.request) {
    // The request was made but no response was received
    throw new Error('No response from server. Please check your internet connection.');
  } else {
    // Something happened in setting up the request
    throw new Error('Failed to connect to server');
  }
};

// Create axios instance with interceptors
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.authtoken = token;
    }
    
    // Ensure content type is set for POST/PUT requests
    if (!config.headers['Content-Type'] && (config.method === 'post' || config.method === 'put' || config.method === 'patch')) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    // Handle specific error cases
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please try again.';
    }
    
    return Promise.reject(error);
  }
);

// Main API handler class
class ApiHandler {
  constructor() {
    this.client = apiClient;
  }

  // Generic GET request
  async get(endpoint, options = {}) {
    try {
      const { requireAuth = true, returnEmptyOnError = false, ...axiosOptions } = options;
      
      if (requireAuth) {
        const token = await getAuthToken();
        if (!token) {
          if (returnEmptyOnError) {
            console.log('No auth token available, returning empty result');
            return null;
          }
          throw new Error('Authentication required');
        }
      }

      const response = await this.client.get(endpoint, axiosOptions);
      return response.data;
    } catch (error) {
      if (options.returnEmptyOnError && error.response?.status === 500) {
        console.warn(`Backend error for ${endpoint}, returning empty result`);
        return null;
      }
      
      handleApiError(error);
      return null;
    }
  }

  // Generic POST request
  async post(endpoint, data = {}, options = {}) {
    try {
      const { requireAuth = true, ...axiosOptions } = options;
      
      if (requireAuth) {
        const token = await getAuthToken();
        if (!token) {
          throw new Error('Authentication required');
        }
      }

      const response = await this.client.post(endpoint, data, axiosOptions);
      return response.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  }

  // Generic PUT request
  async put(endpoint, data = {}, options = {}) {
    try {
      const { requireAuth = true, ...axiosOptions } = options;
      
      if (requireAuth) {
        const token = await getAuthToken();
        if (!token) {
          throw new Error('Authentication required');
        }
      }

      const response = await this.client.put(endpoint, data, axiosOptions);
      return response.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  }

  // Generic PATCH request
  async patch(endpoint, data = {}, options = {}) {
    try {
      const { requireAuth = true, ...axiosOptions } = options;
      
      if (requireAuth) {
        const token = await getAuthToken();
        if (!token) {
          throw new Error('Authentication required');
        }
      }

      const response = await this.client.patch(endpoint, data, axiosOptions);
      return response.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  }

  // Generic DELETE request
  async delete(endpoint, options = {}) {
    try {
      const { requireAuth = true, ...axiosOptions } = options;
      
      if (requireAuth) {
        const token = await getAuthToken();
        if (!token) {
          throw new Error('Authentication required');
        }
      }

      const response = await this.client.delete(endpoint, axiosOptions);
      return response.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  }

  // Helper method to check authentication status
  async isAuthenticated() {
    const token = await getAuthToken();
    return !!token;
  }

  // Helper method to get current user ID
  getCurrentUserId() {
    return auth.currentUser?.uid || null;
  }

  // Helper method to build URLs with optional user ID
  buildUserUrl(baseEndpoint, userId = null) {
    if (userId) {
      return `${baseEndpoint}/${userId}`;
    }
    return baseEndpoint;
  }
}

// Create singleton instance
const apiHandler = new ApiHandler();

export default apiHandler;

// Export individual methods for convenience
export const { get, post, put, patch, delete: del } = apiHandler;

// Export utility functions
export { getAuthToken, handleApiError };