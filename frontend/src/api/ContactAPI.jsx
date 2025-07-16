import apiHandler from './apiHandler';

// Submit support ticket (works for both logged-in and guest users)
export const submitSupportTicket = async (ticketData) => {
  try {
    // Validate that all required fields are present before submitting
    const { name, email, category, subject, description } = ticketData;
    
    if (!name || !email || !category || !subject || !description) {
      console.error('Missing required fields in ticket data:', ticketData);
      throw new Error('All required fields must be filled in');
    }

    const submissionData = {
      ...ticketData,
      attachments: []
    };
        
    return await apiHandler.post('/tickets/submit', submissionData, { 
      requireAuth: false // Support tickets can be submitted by guests
    });
  } catch (error) {
    console.error('Error submitting support ticket:', error);
    
    // Maintain the original detailed error handling for ticket submission
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      
      if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Server error: ' + error.response.status);
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
      throw new Error('No response from server. Please check your internet connection.');
    } else {
      console.error('Error:', error.message);
      throw error; // Re-throw the original error for client-side validation errors
    }
  }
};

// Get all tickets (admin only, requires authentication)
export const getAllTickets = async () => {
  try {
    return await apiHandler.get('/tickets/', { returnEmptyOnError: true }) || [];
  } catch (error) {
    console.error('Error fetching all tickets:', error);
    return [];
  }
};

// Get current user's tickets (requires authentication)
export const getCurrentUserTickets = async () => {
  try {
    const currentUserId = apiHandler.getCurrentUserId();
    if (!currentUserId) {
      throw new Error('User not logged in');
    }

    return await apiHandler.get(`/tickets/user/${currentUserId}`, { returnEmptyOnError: true }) || [];
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    return [];
  }
};

// Fetch user tickets by user ID (for Support Page)
export const fetchUserTickets = async (userId) => {
  try {
    const isAuthenticated = await apiHandler.isAuthenticated();
    if (!isAuthenticated) {
      console.log('No auth token available, returning empty tickets array');
      return [];
    }

    const result = await apiHandler.get(`/tickets/user/${userId}`, { returnEmptyOnError: true });
    return result || [];
  } catch (error) {
    console.error(`Error fetching tickets for user ${userId}:`, error);
    
    // Maintain original error handling logic
    if (error.response) {
      console.error('Server response:', error.response.status, error.response.data);
      
      if (error.response.status === 500) {
        console.warn('Backend error occurred, returning empty tickets array');
        return [];
      }
    }
    
    return [];
  }
};

// Get a specific ticket by ID (requires authentication)
export const getTicketById = async (ticketId) => {
  try {
    return await apiHandler.get(`/tickets/${ticketId}`);
  } catch (error) {
    console.error(`Error fetching ticket ${ticketId}:`, error);
    return null;
  }
};

// Add reply to a ticket (requires authentication)
export const addTicketReply = async (ticketId, message, isStaff = false) => {
  try {
    return await apiHandler.post(`/tickets/${ticketId}/reply`, { message, isStaff });
  } catch (error) {
    console.error(`Error adding reply to ticket ${ticketId}:`, error);
    return null;
  }
};

// Update ticket status (admin only, requires authentication)
export const updateTicketStatus = async (ticketId, status, adminNotes = '') => {
  try {
    return await apiHandler.patch(`/tickets/${ticketId}/status`, { status, adminNotes });
  } catch (error) {
    console.error(`Error updating ticket ${ticketId} status:`, error);
    return null;
  }
};

// Delete a ticket (admin only, requires authentication)
export const deleteTicket = async (ticketId) => {
  try {
    return await apiHandler.delete(`/tickets/${ticketId}`);
  } catch (error) {
    console.error(`Error deleting ticket ${ticketId}:`, error);
    return null;
  }
};