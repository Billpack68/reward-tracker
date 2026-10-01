const habitsModel = require('../src/models/habitsModel');

async function testHabits() {
  try {
    console.log('Testing habits functionality...');
    
    // Get all habits (should be empty initially)
    const initialHabits = await habitsModel.getAllHabits();
    console.log('Initial habits count:', initialHabits.length);
    
    // Create a new habit
    const habitId = await habitsModel.createHabit({
      name: 'Morning Meditation',
      description: 'Meditate for 10 minutes in the morning',
      value: 5,
      max_completions_per_day: 1
    });
    console.log('Created habit with ID:', habitId);
    
    // Get all habits (should have one now)
    const habitsAfterCreate = await habitsModel.getAllHabits();
    console.log('Habits count after creation:', habitsAfterCreate.length);
    
    // Update the habit
    const changes = await habitsModel.updateHabit(habitId, {
      name: 'Morning Meditation Updated',
      description: 'Meditate for 10 minutes in the morning (updated)',
      value: 10,
      max_completions_per_day: 2
    });
    console.log('Changes made during update:', changes);
    
    // Get updated habit
    const updatedHabits = await habitsModel.getAllHabits();
    const updatedHabit = updatedHabits.find(h => h.id === habitId);
    console.log('Updated habit name:', updatedHabit.name);
    
    // Delete the habit
    const deleteChanges = await habitsModel.deleteHabit(habitId);
    console.log('Changes made during deletion:', deleteChanges);
    
    // Get all habits (should be empty again)
    const finalHabits = await habitsModel.getAllHabits();
    console.log('Final habits count:', finalHabits.length);
    
    console.log('Habits functionality test completed successfully!');
  } catch (error) {
    console.error('Error in habits test:', error);
  }
}

testHabits();