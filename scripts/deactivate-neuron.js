const { getState, saveState } = require('../lib/api.js');

const state = getState();

const updatedState = {
  ...state,
  active: false
};

saveState(updatedState);
console.log(JSON.stringify({
  success: true,
  message: 'Neuron deactivated.',
  completed_tasks: updatedState.completed_tasks || 0,
  total_atp: updatedState.total_atp || 0
}));
