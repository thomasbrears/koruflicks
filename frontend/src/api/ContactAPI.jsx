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

// Submit support ticket (works for both logged-in and guest users)
export const submitSupportTicket = async (ticketData) => {
  try {
    // Validate that all required fields are present before submitting
    const { name, email, category, subject, description } = ticketData;
    
    if (!name || !email || !category || !subject || !description) {
      console.error('Missing required fields in ticket data:', ticketData);
      throw new Error('All required fields must be filled in');
    }
    
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Add auth token if user is logged in
    const authToken = await getAuthToken();
    if (authToken) {
      headers.authtoken = authToken;
    } else {
      console.log('Sending ticket request as guest');
    }
  
    const submissionData = {
      ...ticketData,
      attachments: []
    };
        
    const response = await axios.post(`${API_URL}/tickets/submit`, submissionData, {
      headers
    });
    
    return response.data;
  } catch (error) {
    console.error('Error submitting support ticket:', error);
    
    // Error handling
    if (error.response) {
      // The request was made and the server responded with a status code outside the 2xx range
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      
      // Handle specific error messages from the server
      if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Server error: ' + error.response.status);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      throw new Error('No response from server. Please check your internet connection.');
    } else {
      // Something happened in setting up the request or its a client-side validation error
      console.error('Error:', error.message);
      throw error; // Re-throw the original error for client-side validation errors
    }
  }
};

// Get all tickets (admin only, requires authentication)
export const getAllTickets = async () => {
  try {
    const authToken = await getAuthToken();
    if (!authToken) {
      throw new Error('Authentication required');
    }

    const response = await axios.get(`${API_URL}/tickets/`, {
      headers: {
        authtoken: authToken
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching all tickets:', error);
    handleApiError(error);
    return [];
  }
};

// Get current user's tickets (requires authentication)
export const getCurrentUserTickets = async () => {
  try {
    const authToken = await getAuthToken();
    if (!authToken) {
      throw new Error('Authentication required');
    }
    
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not logged in');
    }

    const response = await axios.get(`${API_URL}/tickets/user/${currentUser.uid}`, {
      headers: {
        authtoken: authToken
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    handleApiError(error);
    return [];
  }
};

// Fetch user tickets by user ID (for Support Page)
export const fetchUserTickets = async (userId) => {
  try {
    const authToken = await getAuthToken();
    if (!authToken) {
      console.log('No auth token available, returning empty tickets array');
      return []; // Return empty array instead of throwing error
    }

    const response = await axios.get(`${API_URL}/tickets/user/${userId}`, {
      headers: {
        authtoken: authToken
      }
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching tickets for user ${userId}:`, error);
    
    // error handling
    if (error.response) {
      console.error('Server response:', error.response.status, error.response.data);
      
      // If we get a 500 error, it might be a backend issue
      if (error.response.status === 500) {
        console.warn('Backend error occurred, returning empty tickets array');
        return []; // Return empty array instead of throwing error for 500
      }
    }
    
    // For other errors, use standard handling
    handleApiError(error);
    return []; // Always return empty array instead of throwing
  }
};

// Get a specific ticket by ID (requires authentication)
export const getTicketById = async (ticketId) => {
  try {
    const authToken = await getAuthToken();
    if (!authToken) {
      throw new Error('Authentication required');
    }

    const response = await axios.get(`${API_URL}/tickets/${ticketId}`, {
      headers: {
        authtoken: authToken
      }
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching ticket ${ticketId}:`, error);
    handleApiError(error);
    return null;
  }
};

// Add reply to a ticket (requires authentication)
export const addTicketReply = async (ticketId, message, isStaff = false) => {
  try {
    const authToken = await getAuthToken();
    if (!authToken) {
      throw new Error('Authentication required');
    }

    const response = await axios.post(
      `${API_URL}/tickets/${ticketId}/reply`, 
      { message, isStaff }, 
      {
        headers: {
          authtoken: authToken
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Error adding reply to ticket ${ticketId}:`, error);
    handleApiError(error);
    return null;
  }
};

// Update ticket status (admin only, requires authentication)
export const updateTicketStatus = async (ticketId, status, adminNotes = '') => {
  try {
    const authToken = await getAuthToken();
    if (!authToken) {
      throw new Error('Authentication required');
    }

    const response = await axios.patch(
      `${API_URL}/tickets/${ticketId}/status`, 
      { status, adminNotes }, 
      {
        headers: {
          authtoken: authToken
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Error updating ticket ${ticketId} status:`, error);
    handleApiError(error);
    return null;
  }
};

// Delete a ticket (admin only, requires authentication)
export const deleteTicket = async (ticketId) => {
  try {
    const authToken = await getAuthToken();
    if (!authToken) {
      throw new Error('Authentication required');
    }

    const response = await axios.delete(`${API_URL}/tickets/${ticketId}`, {
      headers: {
        authtoken: authToken
      }
    });

    return response.data;
  } catch (error) {
    console.error(`Error deleting ticket ${ticketId}:`, error);
    handleApiError(error);
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