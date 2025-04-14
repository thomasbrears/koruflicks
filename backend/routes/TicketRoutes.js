import express from "express";
import { 
  submitTicket, 
  getAllTickets, 
  getUserTickets,
  getTicketById, 
  updateTicketStatus, 
  addTicketReply,
  deleteTicket 
} from "../controllers/TicketController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route for submitting support ticket
router.post("/submit", submitTicket);

// Private routes
router.get("/", authMiddleware, getAllTickets);  // Fetch all tickets (admin)
router.get("/user/:userId", authMiddleware, getUserTickets);  // Fetch user's tickets
router.get("/:id", authMiddleware, getTicketById);  // Get ticket by ID
router.patch("/:id/status", authMiddleware, updateTicketStatus);  // Update ticket status
router.post("/:id/reply", authMiddleware, addTicketReply);  // Add reply to ticket
router.delete("/:id", authMiddleware, deleteTicket);  // Delete ticket (admin only)

export default router;