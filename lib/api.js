const fs = require('fs');
const path = require('path');
const os = require('os');

const CONFIG_PATH = path.join(os.homedir(), '.claude', 'tentacle-config.json');
const STATE_PATH = path.join(os.homedir(), '.claude', 'plugins', 'tentacle', 'state', 'neuron.local.json');

function getConfig() {
  if (!fs.existsSync(CONFIG_PATH)) return null;
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
}

function getState() {
  if (!fs.existsSync(STATE_PATH)) return { active: false, idle_count: 0, total_atp: 0, completed_tasks: 0 };
  return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
}

function saveState(state) {
  const dir = path.dirname(STATE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

async function callBrain(endpoint, method = 'GET', body = null) {
  const config = getConfig();
  if (!config) throw new Error('Not configured. Run /tentacle-config first.');

  const url = `${config.brainUrl}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
  };

  if (method === 'POST' && body && body.taskId) {
    // 自动生成幂等键
    headers['X-Idempotency-Key'] = `task-${body.taskId}-${Date.now()}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Request failed');
  }

  return await response.json();
}

module.exports = { getConfig, getState, saveState, callBrain };
