---
description: Register this Neuron node with the Tentacle Brain server
allowed-tools: ["Bash", "Read"]
argument-hint: Optional email override
---

# Register Tentacle Neuron

Register this Claude Code instance as a Neuron node on the Tentacle network.

## Context

- Config file: !`cat ~/.claude/tentacle-config.json 2>/dev/null || echo "NOT_CONFIGURED"`
- Current state: !`cat ${CLAUDE_PLUGIN_ROOT}/state/neuron.local.json 2>/dev/null || echo "NO_STATE"`
- Platform info: !`node -e "console.log(process.platform + '_' + process.arch)"`

## Your task

1. **Check config exists**: If the config file shows "NOT_CONFIGURED", tell the user to run `/tentacle:tentacle-config` first and stop.

2. **Generate fingerprint and register**: Run the following Bash command (replace values from the config):

```bash
node -e "
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const os = require('os');

const config = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.claude', 'tentacle-config.json'), 'utf8'));
const email = '$ARGUMENTS' || config.token;
const fingerprint = crypto.createHash('sha256').update(email + ':' + process.platform + ':' + process.arch + ':' + (config.modelTier || 'medium')).digest('hex').substring(0, 16);

const body = {
  wallet: config.wallet || 'default-wallet',
  skills: ['code_analysis', 'code_generation'],
  token: email,
  modelTier: config.modelTier || 'medium',
  acceptLowerTier: config.acceptLowerTier !== false,
  fingerprint: fingerprint
};

fetch(config.brainUrl + '/api/neurons/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
}).then(r => r.json()).then(res => {
  if (!res.success) { console.error('Registration failed:', res.error); process.exit(1); }

  // Save state
  const stateDir = path.join(os.homedir(), '.claude', 'plugins', 'tentacle', 'state');
  if (!fs.existsSync(stateDir)) fs.mkdirSync(stateDir, { recursive: true });
  const state = { neuronId: res.data.id, userId: res.data.userId, active: false, idle_count: 0, total_atp: 0, completed_tasks: 0 };
  fs.writeFileSync(path.join(stateDir, 'neuron.local.json'), JSON.stringify(state, null, 2));

  // Save apiSecret to config
  if (res.data.apiSecret) {
    config.apiSecret = res.data.apiSecret;
    fs.writeFileSync(path.join(os.homedir(), '.claude', 'tentacle-config.json'), JSON.stringify(config, null, 2));
  }

  console.log('Registration successful!');
  console.log('Neuron ID:', res.data.id);
  console.log('Model Tier:', res.data.modelTier);
  console.log('API Secret:', res.data.apiSecret ? 'Saved to config' : 'Already registered');
}).catch(e => { console.error('Registration error:', e.message); process.exit(1); });
"
```

3. **Report result**: Show the Neuron ID and tell the user to run `/tentacle:neuron-mode` to start accepting tasks.
