import React, { useState } from 'react';
import './App.css';

// Define types for our data structures
interface Habit {
  id: number;
  name: string;
  description: string;
  value: number;
  maxCompletionsPerDay: number; // New field for max completions per day
  completedToday: number; // Track how many times this habit was completed today
}

function App() {
  // State for rewards earned
  const [rewardsEarned, setRewardsEarned] = useState<number>(150);
  
  // State for habits
  const [habits, setHabits] = useState<Habit[]>([
    { id: 1, name: "Morning Meditation", description: "10 minutes of mindfulness", value: 10, maxCompletionsPerDay: 1, completedToday: 0 },
    { id: 2, name: "Exercise", description: "30 minutes of physical activity", value: 20, maxCompletionsPerDay: 1, completedToday: 0 },
    { id: 3, name: "Read Book", description: "Read for 30 minutes", value: 15, maxCompletionsPerDay: 2, completedToday: 0 },
  ]);
  
  // State for new habit form
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [newHabit, setNewHabit] = useState<Omit<Habit, 'id' | 'completedToday'>>({ 
    name: '', 
    description: '', 
    value: 0,
    maxCompletionsPerDay: 1
  });

  // Handle creating a new habit
  const handleCreateHabit = () => {
    if (newHabit.name.trim() === '') return;
    
    const habit: Habit = {
      ...newHabit,
      id: habits.length + 1,
      completedToday: 0
    };
    
    setHabits([...habits, habit]);
    setShowCreateForm(false);
    setNewHabit({ name: '', description: '', value: 0, maxCompletionsPerDay: 1 });
  };

  // Handle completing a habit
  const handleCompleteHabit = (id: number) => {
    setHabits(habits.map(habit => {
      // Check if this habit has reached its daily limit
      if (habit.id === id) {
        // If maxCompletionsPerDay is 0, it means unlimited completions
        if (habit.maxCompletionsPerDay !== 0 && habit.completedToday >= habit.maxCompletionsPerDay) {
          return habit; // Don't allow completion if limit reached
        }
        
        // Increase rewards and completed count
        setRewardsEarned(rewardsEarned + habit.value);
        return { 
          ...habit, 
          completedToday: habit.completedToday + 1 
        };
      }
      return habit;
    }));
  };

  // Handle input change for maxCompletionsPerDay
  const handleMaxCompletionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === 'unlimited') {
      setNewHabit({...newHabit, maxCompletionsPerDay: 0});
    } else {
      setNewHabit({...newHabit, maxCompletionsPerDay: parseInt(value) || 1});
    }
  };

  // Reset daily completions (this would typically be called once per day)
  const resetDailyCompletions = () => {
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
                <p>Max per day: {habit.maxCompletionsPerDay === 0 ? 'Unlimited' : habit.maxCompletionsPerDay}</p>
                <p>Completed today: {habit.completedToday}</p>
              </div>
              <button 
                onClick={() => handleCompleteHabit(habit.id)}
                disabled={habit.maxCompletionsPerDay !== 0 && habit.completedToday >= habit.maxCompletionsPerDay}
                className="complete-button"
              >
                Complete
              </button>
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
                value={newHabit.maxCompletionsPerDay === 0 ? 'unlimited' : newHabit.maxCompletionsPerDay}
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
