const completionsModel = require('../src/models/completionsModel');
const habitsModel = require('../src/models/habitsModel');

async function testCompletions() {
  try {
    console.log('Testing completions functionality...');
    
    // First create a habit to associate with completions
    const habitId = await habitsModel.createHabit({
      name: 'Morning Meditation',
      description: 'Meditate for 10 minutes in the morning',
      value: 5,
      max_completions_per_day: 1
    });
    console.log('Created habit with ID:', habitId);
    
    // Get all completions (should be empty initially)
    const initialCompletions = await completionsModel.getAllCompletions();
    console.log('Initial completions count:', initialCompletions.length);
    
    // Create a new completion
    const completionId = await completionsModel.createCompletion({
      habit_id: habitId,
      completed_date: '2023-10-01',
      previous_rewards: 0,
      new_rewards: 5
    });
    console.log('Created completion with ID:', completionId);
    
    // Get all completions (should have one now)
    const completionsAfterCreate = await completionsModel.getAllCompletions();
    console.log('Completions count after creation:', completionsAfterCreate.length);
    
    // Get completions for specific habit
    const habitCompletions = await completionsModel.getCompletionsByHabitId(habitId);
    console.log('Completions for habit:', habitCompletions.length);
    
    // Update the completion
    const changes = await completionsModel.updateCompletion(completionId, {
      habit_id: habitId,
      completed_date: '2023-10-01',
      previous_rewards: 5,
      new_rewards: 10
    });
    console.log('Changes made during update:', changes);
    
    // Delete the completion
    const deleteChanges = await completionsModel.deleteCompletion(completionId);
    console.log('Changes made during deletion:', deleteChanges);
    
    // Get all completions (should be empty again)
    const finalCompletions = await completionsModel.getAllCompletions();
    console.log('Final completions count:', finalCompletions.length);
    
    // Clean up - delete the habit
    await habitsModel.deleteHabit(habitId);
    console.log('Cleaned up test habit');
    
    console.log('Completions functionality test completed successfully!');
  } catch (error) {
    console.error('Error in completions test:', error);
  }
}

testCompletions();