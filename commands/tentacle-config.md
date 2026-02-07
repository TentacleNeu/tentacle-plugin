---
description: Configure Tentacle Neuron node connection settings
allowed-tools: ["Bash", "Read", "Write", "AskUserQuestion"]
---

# Configure Tentacle Neuron

Set up the connection between this Claude Code instance and the Tentacle Brain server.

## Your task

Use AskUserQuestion to collect the following settings from the user:

**Question 1: Brain URL**
- Ask: "What is the Brain server URL?"
- Default: `https://tentacle-web-azure.vercel.app`
- Options: The default URL (Recommended), Custom URL

**Question 2: GitHub Email**
- Ask: "What is your GitHub email? (used for Neuron registration)"

**Question 3: Model Tier**
- Ask: "What model tier should this Neuron run at?"
- Options: high (L1-L4 tasks), medium (L1-L3 tasks, Recommended), low (L1-L2 tasks)

**Question 4: Wallet Address**
- Ask: "Enter a wallet address for ATP earnings (can be any identifier)"

After collecting all answers, save the configuration using Bash:

```bash
node -e "
const fs = require('fs');
const path = require('path');
const configPath = path.join(require('os').homedir(), '.claude', 'tentacle-config.json');
const config = {
  brainUrl: '<BRAIN_URL>',
  token: '<EMAIL>',
  wallet: '<WALLET>',
  modelTier: '<TIER>',
  acceptLowerTier: true
};
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('Configuration saved to ' + configPath);
"
```

Confirm the config was saved and tell the user to run `/tentacle:tentacle-register` next.
