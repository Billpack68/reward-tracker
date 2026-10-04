import React, { useState, useEffect } from 'react';
import './App.css';
import { api } from './api';

// Define types for our data structures
interface Habit {
  id: number;
  name: string;
  description: string;
  value: number;
  max_completions_per_day: number; // New field for max completions per day (snake_case to match backend)
  completedToday: number; // Track how many times this habit was completed today
}

// Helper function to get today's date in Mountain Time (UTC-7/UTC-6 depending on DST)
const getTodayInMountainTime = (): string => {
  const now = new Date();
  // Create a date in Mountain Time (UTC-7 or UTC-6)
  const mountainTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Denver"}));
  // Format as YYYY-MM-DD
  return mountainTime.toISOString().split('T')[0];
};

function App() {
  // State for rewards earned
  const [rewardsEarned, setRewardsEarned] = useState<number>(0);
  
  // State for habits
  const [habits, setHabits] = useState<Habit[]>([]);
  
  // State for new habit form
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [newHabit, setNewHabit] = useState<Omit<Habit, 'id' | 'completedToday'>>({ 
    name: '', 
    description: '', 
    value: 0,
    max_completions_per_day: 1
  });

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get current rewards
        const rewards = await api.getRewards();
        setRewardsEarned(rewards);
        
        // Get all habits
        const habitData = await api.getHabits();
        
        // Get completions for each habit to determine completedToday counts
        const updatedHabits = await Promise.all(habitData.map(async (habit: any) => {
          try {
            // Get today's date in Mountain Time
            const today = getTodayInMountainTime();
            
            // Fetch completions for this habit on today's date
            const completions = await api.getCompletionsByHabitAndDate(habit.id, today);
            
            return {
              ...habit,
              completedToday: completions.length // Set completedToday to count of completions for today
            };
          } catch (error) {
            console.error(`Error fetching completions for habit ${habit.id}:`, error);
            return {
              ...habit,
              completedToday: 0
            };
          }
        }));
        
        setHabits(updatedHabits);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  // Handle creating a new habit
  const handleCreateHabit = async () => {
    if (newHabit.name.trim() === '') return;
    
    try {
      // Create the new habit via API
      const createdHabit = await api.createHabit(newHabit);
      
      // Refresh habits list to get updated data
      const habitData = await api.getHabits();
      
      // Get completions for each habit to determine completedToday counts
      const updatedHabits = await Promise.all(habitData.map(async (habit: any) => {
        try {
          // Get today's date in Mountain Time
          const today = getTodayInMountainTime();
          
          // Fetch completions for this habit on today's date
          const completions = await api.getCompletionsByHabitAndDate(habit.id, today);
          
          return {
            ...habit,
            completedToday: completions.length // Set completedToday to count of completions for today
          };
        } catch (error) {
          console.error(`Error fetching completions for habit ${habit.id}:`, error);
          return {
            ...habit,
            completedToday: 0
          };
        }
      }));
      
      setHabits(updatedHabits);
      
      setShowCreateForm(false);
      setNewHabit({ name: '', description: '', value: 0, max_completions_per_day: 1 });
    } catch (error) {
      console.error('Error creating habit:', error);
    }
  };

  // Handle completing a habit
  const handleCompleteHabit = async (id: number) => {
    try {
      // Record the new completion via API with today's date in Mountain Time
      const today = getTodayInMountainTime();
      const result = await api.createCompletion({ 
        habit_id: id,
        completed_date: today
      });
      
      // Update rewards with the returned value from the completion creation
      if (result.rewards !== undefined) {
        setRewardsEarned(result.rewards);
      } else {
        // Fallback to getting rewards directly if not included in response
        const updatedRewards = await api.getRewards();
        setRewardsEarned(updatedRewards);
      }
      
      // Refresh habits list to update completedToday counts
      const habitData = await api.getHabits();
      
      // Get completions for each habit to determine updated completedToday counts
      const updatedHabits = await Promise.all(habitData.map(async (habit: any) => {
        try {
          // Get today's date in Mountain Time
          const today = getTodayInMountainTime();
          
          // Fetch completions for this habit on today's date
          const completions = await api.getCompletionsByHabitAndDate(habit.id, today);
          
          return {
            ...habit,
            completedToday: completions.length // Set completedToday to count of completions for today
          };
        } catch (error) {
          console.error(`Error fetching completions for habit ${habit.id}:`, error);
          return {
            ...habit,
            completedToday: 0
          };
        }
      }));
      
      setHabits(updatedHabits);
    } catch (error) {
      console.error('Error completing habit:', error);
    }
  };

  // Handle deleting a habit
  const handleDeleteHabit = async (id: number) => {
    try {
      // Delete the habit via API
      await api.deleteHabit(id);
      
      // Refresh habits list to remove deleted habit
      const habitData = await api.getHabits();
      
      // Get completions for each habit to determine completedToday counts
      const updatedHabits = await Promise.all(habitData.map(async (habit: any) => {
        try {
          // Get today's date in Mountain Time
          const today = getTodayInMountainTime();
          
          // Fetch completions for this habit on today's date
          const completions = await api.getCompletionsByHabitAndDate(habit.id, today);
          
          return {
            ...habit,
            completedToday: completions.length // Set completedToday to count of completions for today
          };
        } catch (error) {
          console.error(`Error fetching completions for habit ${habit.id}:`, error);
          return {
            ...habit,
            completedToday: 0
          };
        }
      }));
      
      setHabits(updatedHabits);
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  // Handle input change for maxCompletionsPerDay
  const handleMaxCompletionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === 'unlimited') {
      setNewHabit({...newHabit, max_completions_per_day: 0});
    } else {
      setNewHabit({...newHabit, max_completions_per_day: parseInt(value) || 1});
    }
  };

  // Reset daily completions (this would typically be called once per day)
  const resetDailyCompletions = async () => {
    // In a real app, this would involve calling an API to reset completions
    // For now, we'll just reset the local state
    setHabits(habits.map(habit => ({ ...habit, completedToday: 0 })));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Reward Tracker</h1>
        <div className="rewards-display">
          <p>Rewards Earned: {rewardsEarned}</p>
        </div>
        
        <div className="habits-container">
          <h2>Your Habits</h2>
          {habits.map(habit => (
            <div key={habit.id} className="habit-row">
              <div className="habit-info">
                <h3>{habit.name}</h3>
                <p>{habit.description}</p>
                <p>Value: {habit.value} points</p>
                <p>Max per day: {habit.max_completions_per_day === 0 ? 'Unlimited' : habit.max_completions_per_day}</p>
                <p>Completed today: {habit.completedToday}</p>
              </div>
              <div className="habit-buttons">
                <button 
                  onClick={() => handleCompleteHabit(habit.id)}
                  disabled={habit.max_completions_per_day !== 0 && habit.completedToday >= habit.max_completions_per_day}
                  className="complete-button"
                >
                  Complete
                </button>
                <button 
                  onClick={() => handleDeleteHabit(habit.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => setShowCreateForm(true)}
          className="create-habit-button"
        >
          Create New Habit
        </button>
        
        {/* Reset daily completions button for demo purposes */}
        <button 
          onClick={resetDailyCompletions}
          className="reset-button"
        >
          Reset Daily Completions
        </button>
        
        {showCreateForm && (
          <div className="modal">
            <div className="modal-content">
              <h2>Create New Habit</h2>
              <input
                type="text"
                placeholder="Habit name"
                value={newHabit.name}
                onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                className="habit-input"
              />
              <input
                type="text"
                placeholder="Description"
                value={newHabit.description}
                onChange={(e) => setNewHabit({...newHabit, description: e.target.value})}
                className="habit-input"
              />
              <input
                type="number"
                placeholder="Value (points)"
                value={newHabit.value || ''}
                onChange={(e) => setNewHabit({...newHabit, value: parseInt(e.target.value) || 0})}
                className="habit-input"
              />
              <input
                type="text"
                placeholder="Max completions per day (0 for unlimited)"
                value={newHabit.max_completions_per_day === 0 ? 'unlimited' : newHabit.max_completions_per_day}
                onChange={handleMaxCompletionsChange}
                className="habit-input"
              />
              <div className="modal-buttons">
                <button onClick={handleCreateHabit} className="save-button">Save</button>
                <button onClick={() => setShowCreateForm(false)} className="cancel-button">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
