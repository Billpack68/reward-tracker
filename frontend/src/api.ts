// API helper functions for communicating with the backend
import { API_URL} from "./config"

const BASE_URL = API_URL

export const api = {
  // Get current rewards points
  getRewards: async () => {
    try {
      const response = await fetch(`${BASE_URL}/rewards`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.points || 0;
    } catch (error) {
      console.error('Error fetching rewards:', error);
      throw error;
    }
  },

  // Get all habits
  getHabits: async () => {
    try {
      const response = await fetch(`${BASE_URL}/habits`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching habits:', error);
      throw error;
    }
  },

  // Create a new habit
  createHabit: async (habitData: any) => {
    try {
      const response = await fetch(`${BASE_URL}/habits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(habitData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating habit:', error);
      throw error;
    }
  },

  // Delete a habit
  deleteHabit: async (habitId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/habits/${habitId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      console.error('Error deleting habit:', error);
      throw error;
    }
  },

  // Create a new completion
  createCompletion: async (completionData: any) => {
    try {
      const response = await fetch(`${BASE_URL}/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completionData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating completion:', error);
      throw error;
    }
  },

  // Get completions for a specific habit
  getCompletionsByHabit: async (habitId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/completions/habit/${habitId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching completions:', error);
      throw error;
    }
  },
  
  // Get completions for a specific habit on a specific date
  getCompletionsByHabitAndDate: async (habitId: number, date: string) => {
    try {
      const response = await fetch(`${BASE_URL}/completions/habit/${habitId}/date/${date}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching completions by date:', error);
      throw error;
    }
  }
};