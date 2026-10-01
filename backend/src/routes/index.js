const express = require('express');
const router = express.Router();

// Import routes
const rewardsRouter = require('./rewards');
const habitsRouter = require('./habits');
const completionsRouter = require('./completions');
// const userRoutes = require('./user');

// Middleware to log all requests
router.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Base route
router.get('/', (req, res) => {
  res.json({
    message: 'Habit Tracker API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      rewards: '/rewards',
      habits: '/habits',
      completions: '/completions'
    }
  });
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Rewards routes
router.use('/rewards', rewardsRouter);

// Habits routes
router.use('/habits', habitsRouter);

// Completions routes
router.use('/completions', completionsRouter);

module.exports = router;