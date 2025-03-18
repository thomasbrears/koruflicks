import express from "express";
import cors from "cors";
import movieRoutes from "./routes/movieRoutes.js"; // Import movie routes

const app = express();

// dynamic cors options
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://koruflicks.vercel.app' 
    : true,  // Allow all origins in development
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  credentials: true
};

// CORS middleware to allow cross-origin requests
app.use(cors(corsOptions));

app.use(express.json());

// Movie Routes
app.use("/api/movies", movieRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
