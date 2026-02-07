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

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function callBrainWithRetry(endpoint, method = 'GET', body = null, maxRetries = 3) {
  let lastError;
  // 在重试循环外生成幂等键，确保所有重试使用同一个 key
  const idempotencyKey = (method === 'POST' && body && body.taskId)
    ? `task-${body.taskId}-${Date.now()}`
    : null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await callBrain(endpoint, method, body, idempotencyKey);
      return result;
    } catch (error) {
      lastError = error;

      // 4xx 错误（非 429）不重试
      if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500 && error.statusCode !== 429) {
        throw error;
      }

      // 最后一次尝试，直接抛出
      if (attempt >= maxRetries) {
        throw error;
      }

      // 429: 读取 Retry-After header
      if (error.statusCode === 429 && error.retryAfter) {
        const waitMs = error.retryAfter * 1000;
        await sleep(Math.min(waitMs, 30000));
        continue;
      }

      // 网络错误或 5xx: 指数退避
      const backoffMs = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
      await sleep(backoffMs);
    }
  }

  throw lastError;
}

async function callBrain(endpoint, method = 'GET', body = null, idempotencyKey = null) {
  const config = getConfig();
  if (!config) throw new Error('Not configured. Run /tentacle-config first.');

  const url = `${config.brainUrl}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
  };

  // 附加 Bearer Token 认证
  if (config.apiSecret) {
    headers['Authorization'] = `Bearer ${config.apiSecret}`;
  }

  // 使用外部传入的幂等键，或为 POST+taskId 请求自动生成
  if (idempotencyKey) {
    headers['X-Idempotency-Key'] = idempotencyKey;
  } else if (method === 'POST' && body && body.taskId) {
    headers['X-Idempotency-Key'] = `task-${body.taskId}-${Date.now()}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  if (!response.ok) {
    let errBody;
    try {
      errBody = await response.json();
    } catch {
      errBody = { error: `HTTP ${response.status}` };
    }
    const error = new Error(errBody.error || 'Request failed');
    error.statusCode = response.status;
    const retryAfter = response.headers.get('Retry-After');
    if (retryAfter) {
      error.retryAfter = parseInt(retryAfter, 10);
    }
    throw error;
  }

  return await response.json();
}

module.exports = { getConfig, getState, saveState, callBrain, callBrainWithRetry };
