const express = require('express');
const router = express.Router();
const completionsModel = require('../models/completionsModel');

// Get all completions
router.get('/', async (req, res) => {
  try {
    const completions = await completionsModel.getAllCompletions();
    res.json(completions);
  } catch (error) {
    console.error('Error getting completions:', error);
    res.status(500).json({ error: 'Failed to get completions' });
  }
});

// Get completions for a specific habit
router.get('/habit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const completions = await completionsModel.getCompletionsByHabitId(id);
    res.json(completions);
  } catch (error) {
    console.error('Error getting completions for habit:', error);
    res.status(500).json({ error: 'Failed to get completions for habit' });
  }
});

// Get completions for a specific habit on a specific date
router.get('/habit/:id/date/:date', async (req, res) => {
  try {
    const { id, date } = req.params;
    const completions = await completionsModel.getCompletionsByHabitIdAndDate(id, date);
    res.json(completions);
  } catch (error) {
    console.error('Error getting completions for habit on date:', error);
    res.status(500).json({ error: 'Failed to get completions for habit on date' });
  }
});

// Create a new completion
router.post('/', async (req, res) => {
  try {
    const { habit_id, completed_date } = req.body;
    
    // Validate required fields
    if (!habit_id) {
      return res.status(400).json({ error: 'Habit ID is required' });
    }
    
    // Get the habit to get its value
    const habitsModel = require('../models/habitsModel');
    const habitData = await habitsModel.getHabitById(habit_id);
    
    if (!habitData) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    
    // Get current rewards
    const rewardsModel = require('../models/rewardsModel');
    const currentRewards = await rewardsModel.getPoints();
    
    // Calculate new rewards
    const newRewards = currentRewards + habitData.value;
    
    // Update rewards in database
    await rewardsModel.updatePoints(newRewards);
    
    // Create the completion with previous and new rewards
    const completionId = await completionsModel.createCompletion({
      habit_id,
      completed_date,
      previous_rewards: currentRewards,
      new_rewards: newRewards
    });
    
    res.status(201).json({ 
      message: 'Completion created successfully', 
      id: completionId,
      rewards: newRewards
    });
  } catch (error) {
    console.error('Error creating completion:', error);
    res.status(500).json({ error: 'Failed to create completion' });
  }
});

// Update a completion
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { habit_id, completed_date, previous_rewards, new_rewards } = req.body;
    
    // Validate required fields
    if (!habit_id) {
      return res.status(400).json({ error: 'Habit ID is required' });
    }
    
    const changes = await completionsModel.updateCompletion(id, {
      habit_id,
      completed_date,
      previous_rewards,
      new_rewards
    });
    
    if (changes === 0) {
      return res.status(404).json({ error: 'Completion not found' });
    }
    
    res.json({ message: 'Completion updated successfully' });
  } catch (error) {
    console.error('Error updating completion:', error);
    res.status(500).json({ error: 'Failed to update completion' });
  }
});

// Delete a completion
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const changes = await completionsModel.deleteCompletion(id);
    
    if (changes === 0) {
      return res.status(404).json({ error: 'Completion not found' });
    }
    
    res.json({ message: 'Completion deleted successfully' });
  } catch (error) {
    console.error('Error deleting completion:', error);
    res.status(500).json({ error: 'Failed to delete completion' });
  }
});

module.exports = router;