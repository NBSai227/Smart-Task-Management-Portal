require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

// Initialize MongoDB database connection
connectDB();

const app = express();

// Configure CORS to support standard HTTP methods and Headers (including authorization JWT tokens)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve static assets from frontend/dist
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

// Route Mountpoints
app.use('/api/users', authRoutes);
app.use('/api/tasks', taskRoutes);

// Unknown API endpoints handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API Endpoint Not Found' });
});

// Serve frontend build (index.html) for all other browser paths
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// Connect global error middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
