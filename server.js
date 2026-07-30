const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Load environment variables
dotenv.config();

// Verify critical environment variables at startup
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET environment variable is not defined.');
  process.exit(1);
}

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const authMiddleware = require('./src/middleware/authMiddleware');

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/accounts', authMiddleware, require('./src/routes/accountRoutes'));
app.use('/api/users', authMiddleware, require('./src/routes/userRoutes'));


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
