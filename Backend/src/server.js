const express = require('express');
const cors = require('cors');
require('dotenv').config();
const meetingRoutes = require("./routes/meetingRoutes");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const pool = require('./config/db');

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/meetings", meetingRoutes);
app.use("/api/auth", authRoutes);

app.get("/",(req,res)=>{
  res.json({
    message:"Meeting Management API is running",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

