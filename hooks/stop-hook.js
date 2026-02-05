const fs = require('fs');
const path = require('path');
const os = require('os');

const STATE_PATH = path.join(os.homedir(), '.claude', 'plugins', 'tentacle', 'state', 'neuron.local.json');

if (!fs.existsSync(STATE_PATH)) {
  console.log(JSON.stringify({ decision: "allow" }));
  process.exit(0);
}

const state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));

if (!state.active) {
  console.log(JSON.stringify({ decision: "allow" }));
  process.exit(0);
}

// 如果处于激活状态且没有任务，则 block 以便继续轮询
console.log(JSON.stringify({
  decision: "block",
  reason: "Neuron 正在运行中，继续轮询任务...",
  systemMessage: "🔄 Tentacle Neuron 持续运行中"
}));
