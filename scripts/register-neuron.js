const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { getConfig, saveState } = require('../lib/api.js');

const emailOverride = process.argv[2];

const config = getConfig();
if (!config) {
  console.error(JSON.stringify({ error: 'Not configured. Run /tentacle:tentacle-config first.' }));
  process.exit(1);
}

const email = emailOverride || config.token;
if (!email) {
  console.error(JSON.stringify({ error: 'No email provided. Pass as argument or set in config.' }));
  process.exit(1);
}

const fingerprint = crypto
  .createHash('sha256')
  .update(`${email}:${process.platform}:${process.arch}:${config.modelTier || 'medium'}`)
  .digest('hex')
  .substring(0, 16);

const body = {
  wallet: config.wallet || 'default-wallet',
  skills: ['code_analysis', 'code_generation'],
  token: email,
  modelTier: config.modelTier || 'medium',
  acceptLowerTier: config.acceptLowerTier !== false,
  fingerprint
};

fetch(`${config.brainUrl}/api/neurons/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
})
  .then(r => r.json())
  .then(res => {
    if (!res.success) {
      console.error(JSON.stringify({ error: `Registration failed: ${res.error}` }));
      process.exit(1);
    }

    // Save state
    const state = {
      neuronId: res.data.id,
      userId: res.data.userId,
      active: false,
      idle_count: 0,
      total_atp: 0,
      completed_tasks: 0
    };
    saveState(state);

    // Save apiSecret to config
    if (res.data.apiSecret) {
      const configPath = path.join(os.homedir(), '.claude', 'tentacle-config.json');
      const updatedConfig = { ...config, apiSecret: res.data.apiSecret };
      fs.writeFileSync(configPath, JSON.stringify(updatedConfig, null, 2));
    }

    console.log(JSON.stringify({
      success: true,
      neuronId: res.data.id,
      modelTier: res.data.modelTier,
      apiSecretSaved: !!res.data.apiSecret,
      message: 'Registration successful!'
    }));
  })
  .catch(e => {
    console.error(JSON.stringify({ error: `Registration error: ${e.message}` }));
    process.exit(1);
  });
