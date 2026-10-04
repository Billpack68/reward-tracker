const express = require('express');
const router = express.Router();
const habitsModel = require('../models/habitsModel');

const normalizeMaxCompletions = (value) => (
  typeof value === 'string' && value.trim().toLowerCase() === 'unlimited'
    ? 0
    : value
);

// Get all habits
router.get('/', async (req, res) => {
  try {
    const habits = await habitsModel.getAllHabits();
    res.json(habits);
  } catch (error) {
    console.error('Error getting habits:', error);
    res.status(500).json({ error: 'Failed to get habits' });
  }
});

// Create a new habit
router.post('/', async (req, res) => {
  try {
    const { name, description, value, max_completions_per_day } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const habitId = await habitsModel.createHabit({
      name,
      description,
      value,
      max_completions_per_day: normalizeMaxCompletions(max_completions_per_day)
    });
    
    res.status(201).json({ 
      message: 'Habit created successfully', 
      id: habitId 
    });
  } catch (error) {
    console.error('Error creating habit:', error);
    res.status(500).json({ error: 'Failed to create habit' });
  }
});

// Update a habit
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, value, max_completions_per_day } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const changes = await habitsModel.updateHabit(id, {
      name,
      description,
      value,
      max_completions_per_day: normalizeMaxCompletions(max_completions_per_day)
    });
    
    if (changes === 0) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    
    res.json({ message: 'Habit updated successfully' });
  } catch (error) {
    console.error('Error updating habit:', error);
    res.status(500).json({ error: 'Failed to update habit' });
  }
});

// Delete a habit
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const changes = await habitsModel.deleteHabit(id);
    
    if (changes === 0) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    
    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    console.error('Error deleting habit:', error);
    res.status(500).json({ error: 'Failed to delete habit' });
  }
});

module.exports = router;
