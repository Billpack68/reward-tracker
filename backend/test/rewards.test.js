const rewardsModel = require('../src/models/rewardsModel');

async function testRewards() {
  try {
    console.log('Testing rewards functionality...');
    
    // Get initial points
    const initialPoints = await rewardsModel.getPoints();
    console.log('Initial points:', initialPoints);
    
    // Update points
    await rewardsModel.updatePoints(20);
    console.log('Updated points to 20');
    
    // Get updated points
    const updatedPoints = await rewardsModel.getPoints();
    console.log('Updated points:', updatedPoints);
    
    console.log('Rewards functionality test completed successfully!');
  } catch (error) {
    console.error('Error in rewards test:', error);
  }
}

testRewards();