const fs = require('fs');
const path = require('path');
const os = require('os');

const STATE_PATH = path.join(os.homedir(), '.claude', 'plugins', 'tentacle', 'state', 'neuron.local.json');

if (!fs.existsSync(STATE_PATH)) {
  process.exit(0);
}

try {
  const state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));

  if (state.active === true) {
    const updatedState = {
      ...state,
      active: false
    };
    fs.writeFileSync(STATE_PATH, JSON.stringify(updatedState, null, 2));

    const stats = `Tasks completed: ${state.completed_tasks || 0}, ATP earned: ${state.total_atp || 0}`;
    console.log(JSON.stringify({
      continue: false,
      systemMessage: `Neuron 已自动停止。本次会话统计: ${stats}`
    }));
  }
} catch {
  // state 文件损坏，忽略
}
