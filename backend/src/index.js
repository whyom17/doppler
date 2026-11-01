require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const githubRoutes = require('./routes/githubRoutes');
const deploymentRoutes = require('./routes/deploymentRoutes');
const { initRedisSubscribe, startSocketServer } = require('./services/buildService');

const app = express();
const PORT = process.env.PORT || 9000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/deployments', deploymentRoutes);

startSocketServer();
initRedisSubscribe();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'MongoDB' });
});

app.listen(PORT, () => {
  console.log(`API Server Running..${PORT}`);
});
