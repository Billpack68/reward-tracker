const express = require('express');
const router = express.Router();
const rewardsModel = require('../models/rewardsModel');

// Get current rewards points
router.get('/', async (req, res) => {
  try {
    const points = await rewardsModel.getPoints();
    res.json({ points });
  } catch (error) {
    console.error('Error getting rewards:', error);
    res.status(500).json({ error: 'Failed to get rewards' });
  }
});

// Update rewards points
router.put('/', async (req, res) => {
  try {
    const { points } = req.body;
    
    // Validate input
    if (points === undefined || points < 0) {
      return res.status(400).json({ error: 'Invalid points value' });
    }
    
    await rewardsModel.updatePoints(points);
    res.json({ message: 'Rewards updated successfully', points });
  } catch (error) {
    console.error('Error updating rewards:', error);
    res.status(500).json({ error: 'Failed to update rewards' });
  }
});

module.exports = router;