const fs = require('fs');
const path = require('path');
const os = require('os');

const STATE_PATH = path.join(os.homedir(), '.claude', 'plugins', 'tentacle', 'state', 'neuron.local.json');

if (!fs.existsSync(STATE_PATH)) {
  process.exit(0);
}

const state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));

if (!state.active) {
  process.exit(0);
}

// Neuron 处于激活状态，阻止退出以便继续轮询
console.log(JSON.stringify({
  continue: true,
  suppressOutput: true,
  systemMessage: "Tentacle Neuron is active. Continuing task polling loop..."
}));
