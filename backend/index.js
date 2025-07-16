import express from "express";
import cors from "cors";
import TicketRoutes from "./routes/TicketRoutes.js";
import UserContentRoutes from "./routes/UserContentRoutes.js";

const app = express();

// dynamic cors (v2.1)
const corsOptions = {
  origin: (origin, callback) => {
    // List of allowed origins
    const allowedOrigins = [
      'https://dev-koruflicks.vercel.app',
      'https://koruflicks.vercel.app'
    ];
    
    // Check for thomasbrears-projects pattern matching
    const isThomaseProject = origin && 
      (origin.startsWith('https://thomasbrears-projects.vercel.app') || 
       origin.includes('-thomasbrears-projects.vercel.app'));
    
    // In production, check against allowed list or pattern
    if (process.env.NODE_ENV === 'production') {
      // Check if origin is allowed or matches Thomasbrears pattern
      if (!origin || allowedOrigins.includes(origin) || isThomaseProject) {
        callback(null, true);
      } else {
        console.log(`CORS rejected: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      // In development, allow all origins
      callback(null, true);
    }
  },
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  credentials: true
};

// CORS middleware to allow cross-origin requests
app.use(cors(corsOptions));

app.use(express.json());

// Ticket Routes
app.use("/api/tickets", TicketRoutes);

// User Content Routes
app.use("/api/user-content", UserContentRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
