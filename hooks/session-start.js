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
    // 上次会话异常中断，自动重置
    const updatedState = {
      ...state,
      active: false
    };
    fs.writeFileSync(STATE_PATH, JSON.stringify(updatedState, null, 2));

    console.log(JSON.stringify({
      decision: "allow",
      systemMessage: "⚠️ 检测到上次 Neuron 会话未正常关闭，已自动重置。如需继续挖矿请运行 /tentacle:neuron-mode"
    }));
  }
} catch {
  // state 文件损坏，忽略
}
