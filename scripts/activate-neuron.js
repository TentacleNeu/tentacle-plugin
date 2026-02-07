const { getState, saveState } = require('../lib/api.js');

const state = getState();

if (!state.neuronId) {
  console.error(JSON.stringify({ error: 'Neuron not registered. Run /tentacle:tentacle-register first.' }));
  process.exit(1);
}

const updatedState = {
  ...state,
  active: true,
  idle_count: 0
};

saveState(updatedState);
console.log(JSON.stringify({
  success: true,
  neuronId: updatedState.neuronId,
  message: `Neuron activated. ID: ${updatedState.neuronId}`
}));
