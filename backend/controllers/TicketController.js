import { db } from "../firebase.js";
import { sendEmail } from "../utils/mailjet.js";
import admin from "firebase-admin";

// Submit support ticket
export const submitTicket = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      category, 
      subject, 
      description, 
      userId,
      attachments = []
    } = req.body;
    
    // Validate required fields
    if (!name || !email || !category || !subject || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Initialise authentication variables
    let isLoggedIn = false;
    let authenticatedUserId = null;
    
    // Check if userId is provided in the request body
    if (userId) {
      isLoggedIn = true;
      authenticatedUserId = userId;
    } else {
      // Check auth token as fallback
      const authToken = req.headers.authtoken;
      if (authToken) {
        try {
          // Verify the token
          const decodedToken = await admin.auth().verifyIdToken(authToken);
          authenticatedUserId = decodedToken.uid;
          isLoggedIn = true;
        } catch (authError) {
          console.error('Error verifying auth token:', authError);
          // Continue processing even if authentication fails
        }
      }
    }

    // Generate ticket number
    const ticketNumber = 'TKT-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    // Get priority based on category
    let priority = 'normal';
    switch(category) {
      case 'account':
      case 'billing':
        priority = 'high';
        break;
      case 'playback':
      case 'content':
        priority = 'medium';
        break;
      default:
        priority = 'normal';
    }
    
    // Save to Firebase
    const newTicket = {
      ticketNumber,
      name,
      email,
      category,
      subject,
      description,
      priority,
      createdAt: new Date(),
      status: 'open',
      userId: authenticatedUserId || null,
      isLoggedIn,
      attachments: attachments || []
    };
    
    const docRef = await db.collection("supportTickets").add(newTicket);
    
    // Create user confirmation email body
    const userEmailBody = `
      <h1>Kia ora ${name}!</h1>
      <p>Thank you for contacting our Koru Flicks. We have received your ticket and will be in touch soon.</p>
      <br>
      <h3>Your ticket details:</h3>
      <p><strong>Ticket Number:</strong> ${ticketNumber}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Description:</strong><br>${description.replace(/\n/g, '<br>')}</p>

      <p>If you have any further questions, please feel free to reply to this email</p>
      <p>PLease remember to include your ticket number in any correspondence.</p>
      <hr>
      <p>Thank you for using our Koru Flicks!</p>

      <br>
      <p><small>This is an automated message. (Reference ID: ${docRef.id})<small></p>
    `;

    // Send confirmation email to user
    await sendEmail(
      email, 
      `Your Support Ticket: ${ticketNumber} has been created`,
      userEmailBody,
      null, // No reply-to for confirmation email
      [] // No CC for confirmation email
    );
    
    // Create admin notification email body
    const adminEmailSubject = `New Support Ticket: ${ticketNumber} - ${subject}`;
    
    const adminEmailBody = `
      <h3>New Support Ticket Submitted</h3>
      <p><strong>Ticket Number:</strong> ${ticketNumber}</p>
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Status:</strong> ${isLoggedIn ? 'Registered User' : 'Guest User'}</p>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Priority:</strong> ${priority}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Description:</strong><br>${description.replace(/\n/g, '<br>')}</p>
      ${attachments.length > 0 ? `<p><strong>Attachments:</strong> ${attachments.length} file(s)</p>` : ''}
      <p><small>Reference ID: ${docRef.id}<small></p>
     `;
    
    // Get admin email from environment or use default email
    const adminEmail = process.env.ADMIN_EMAIL || "koruflicks@brears.xyz";
    
    // Send admin notification
    await sendEmail(
      adminEmail,
      adminEmailSubject,
      adminEmailBody,
      email // Set reply-to as users email
    );
    
    res.status(201).json({ 
      message: 'Support ticket submitted successfully',
      ticketNumber,
      id: docRef.id
    });
  } catch (error) {
    console.error('Error submitting ticket:', error);
    res.status(500).json({ message: 'Failed to submit ticket', error: error.message });
  }
};

// Get all tickets (authenticated)
export const getAllTickets = async (req, res) => {
  try {
    const snapshot = await db.collection("supportTickets")
      .orderBy("createdAt", "desc")
      .get();
    
    const tickets = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert timestamp to ISO string for consistent formatting
      createdAt: doc.data().createdAt?.toDate().toISOString() || null,
      updatedAt: doc.data().updatedAt?.toDate().toISOString() || null
    }));
    
    res.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Failed to fetch tickets", error: error.message });
  }
};

// Get tickets for a specific user
export const getUserTickets = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    
    // Verify the requesting user matches the userId in the request or has admin privileges
    if (req.user.uid !== userId) {
      console.log("User ID mismatch, checking for admin privileges");
      
      try {
        const userDoc = await db.collection("users").doc(req.user.uid).get();
        
        if (!userDoc.exists) {
          console.log("User document not found");
          return res.status(403).json({ message: "Access denied. User not found." });
        }
        
        const userData = userDoc.data();
        
        // Check if the user is an admin
        if (!userData || !userData.isAdmin) {
          console.log("User is not an admin");
          return res.status(403).json({ 
            message: "Access denied. You can only view your own tickets unless you're an admin."
          });
        }
        } catch (dbError) {
        console.error("Error querying user document:", dbError);
        return res.status(500).json({ 
          message: "Error verifying user permissions",
          error: dbError.message
        });
      }
    }
    
    // If we get here, the user is either requesting their own tickets or is an admin requesting someone elses tickets
    try {
      const snapshot = await db.collection("supportTickets")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .get();
            
      const tickets = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Convert Firestore timestamps to ISO strings
          createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : null,
          updatedAt: data.updatedAt?.toDate?.() ? data.updatedAt.toDate().toISOString() : null
        };
      });
      
      res.json(tickets);
    } catch (queryError) {
      console.error("Error querying tickets:", queryError);
      return res.status(500).json({ 
        message: "Failed to fetch user tickets", 
        error: queryError.message 
      });
    }
  } catch (error) {
    console.error("Unhandled error in getUserTickets:", error);
    res.status(500).json({ 
      message: "Failed to fetch user tickets", 
      error: error.message 
    });
  }
};

// Get a ticket by ID
export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const docSnapshot = await db.collection("supportTickets").doc(id).get();
    
    if (!docSnapshot.exists) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    
    const ticketData = {
      id: docSnapshot.id,
      ...docSnapshot.data(),
      createdAt: docSnapshot.data().createdAt?.toDate().toISOString() || null,
      updatedAt: docSnapshot.data().updatedAt?.toDate().toISOString() || null
    };
    
    // Check if the user has access to this ticket
    if (req.user.uid !== ticketData.userId) {
      const userDoc = await db.collection("users").doc(req.user.uid).get();
      const userData = userDoc.data();
      
      // Check if the user is an admin
      if (!userData || !userData.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }
    }
    
    res.json(ticketData);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ message: "Failed to fetch ticket", error: error.message });
  }
};

// Update ticket status
export const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    
    const docRef = db.collection("supportTickets").doc(id);
    const docSnapshot = await docRef.get();
    
    if (!docSnapshot.exists) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    
    const ticketData = docSnapshot.data();
    
    // Update the ticket
    const updateData = {
      status,
      updatedAt: new Date(),
      updatedBy: req.user.uid
    };
    
    // Add admin notes if provided
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }
    
    await docRef.update(updateData);
    
    // If status changed to resolved or closed, send notification to user
    if ((status === 'resolved' || status === 'closed') && ticketData.email) {
      const userEmailBody = `
        <h1>Ticket Status Update</h1>
        <p>Kia ora ${ticketData.name},</p>
        <p>Your support ticket has been marked as <strong>${status}</strong>.</p>
        <p><strong>Ticket Number:</strong> ${ticketData.ticketNumber}</p>
        <p><strong>Subject:</strong> ${ticketData.subject}</p>
        ${adminNotes ? `<p><strong>Notes:</strong> ${adminNotes}</p>` : ''}
        <p>If you have any further questions, please feel free to reply to this email or create a new ticket.</p>
        <p>Thank you for your patience.</p>
      `;
      
      await sendEmail(
        ticketData.email,
        `Your Ticket #${ticketData.ticketNumber} has been ${status}`,
        userEmailBody
      );
    }
    
    res.json({ 
      message: "Ticket status updated successfully",
      status
    });
  } catch (error) {
    console.error("Error updating ticket status:", error);
    res.status(500).json({ message: "Failed to update ticket status", error: error.message });
  }
};

// Add a reply to a ticket
export const addTicketReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, isStaff } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: "Reply message is required" });
    }
    
    const docRef = db.collection("supportTickets").doc(id);
    const docSnapshot = await docRef.get();
    
    if (!docSnapshot.exists) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    
    const ticketData = docSnapshot.data();
    
    // Create the reply object
    const reply = {
      message,
      createdAt: new Date(),
      userId: req.user.uid,
      isStaff: isStaff || false
    };
    
    // Add to replies array (create if it doesn't exist)
    if (!ticketData.replies) {
      await docRef.update({
        replies: [reply],
        updatedAt: new Date(),
        status: 'in-progress' // Update status when first reply is added
      });
    } else {
      await docRef.update({
        replies: [...ticketData.replies, reply],
        updatedAt: new Date(),
        status: isStaff ? 'in-progress' : ticketData.status // Update status if staff replies
      });
    }
    
    // Send email notification
    if (isStaff && ticketData.email) {
      // Notify user of staff reply
      const userEmailBody = `
        <h1>New Reply to Your Support Ticket</h1>
        <p>Kia ora ${ticketData.name},</p>
        <p>We've added a reply to your support ticket <strong>#${ticketData.ticketNumber}</strong>.</p>
        <p><strong>Subject:</strong> ${ticketData.subject}</p>
        <p><strong>Reply:</strong><br>${message.replace(/\n/g, '<br>')}</p>
        <p>You can reply to this email or log in to your account to continue the conversation.</p>
      `;
      
      await sendEmail(
        ticketData.email,
        `New Reply to Your Ticket #${ticketData.ticketNumber}`,
        userEmailBody
      );
    } else {
      // Notify admin of user reply
      const adminEmail = process.env.ADMIN_EMAIL || "koruflicks@brears.xyz";
      
      const adminEmailBody = `
        <h3>New User Reply to Support Ticket</h3>
        <p><strong>Ticket Number:</strong> ${ticketData.ticketNumber}</p>
        <p><strong>From:</strong> ${ticketData.name} (${ticketData.email})</p>
        <p><strong>Subject:</strong> ${ticketData.subject}</p>
        <p><strong>Reply:</strong><br>${message.replace(/\n/g, '<br>')}</p>
      `;
      
      await sendEmail(
        adminEmail,
        `New User Reply - Ticket #${ticketData.ticketNumber}`,
        adminEmailBody,
        ticketData.email // Set reply-to as user's email
      );
    }
    
    res.json({ 
      message: "Reply added successfully", 
      reply 
    });
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ message: "Failed to add reply", error: error.message });
  }
};

// Delete a ticket (admin only)
export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user is admin
    const userDoc = await db.collection("users").doc(req.user.uid).get();
    const userData = userDoc.data();
    
    if (!userData || !userData.isAdmin) {
      return res.status(403).json({ message: "Only administrators can delete tickets" });
    }
    
    const docRef = db.collection("supportTickets").doc(id);
    const docSnapshot = await docRef.get();
    
    if (!docSnapshot.exists) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    
    await docRef.delete();
    
    res.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ message: "Failed to delete ticket", error: error.message });
  }
};