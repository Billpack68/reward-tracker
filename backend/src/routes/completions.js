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

// Create a new completion
router.post('/', async (req, res) => {
  try {
    const { habit_id, completed_date, previous_rewards, new_rewards } = req.body;
    
    // Validate required fields
    if (!habit_id) {
      return res.status(400).json({ error: 'Habit ID is required' });
    }
    
    const completionId = await completionsModel.createCompletion({
      habit_id,
      completed_date,
      previous_rewards,
      new_rewards
    });
    
    res.status(201).json({ 
      message: 'Completion created successfully', 
      id: completionId 
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