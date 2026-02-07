---
description: Stop the Neuron service and deactivate task polling
allowed-tools: ["Bash", "Read"]
---

# Stop Neuron

Deactivate the Neuron and stop polling for tasks.

## Context

- State: !`cat ${CLAUDE_PLUGIN_ROOT}/state/neuron.local.json 2>/dev/null || echo "NO_STATE"`

## Your task

1. If state shows "NO_STATE", tell user the Neuron is not running and stop.

2. Update the state file to deactivate:

```bash
node -e "
const fs = require('fs');
const path = require('path');
const statePath = path.join(require('os').homedir(), '.claude', 'plugins', 'tentacle', 'state', 'neuron.local.json');
if (!fs.existsSync(statePath)) { console.log('Neuron is not running.'); process.exit(0); }
const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
state.active = false;
fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
console.log('Neuron deactivated.');
console.log('Session stats - Tasks completed: ' + (state.completed_tasks || 0) + ', ATP earned: ' + (state.total_atp || 0));
"
```

3. Confirm to the user that the Neuron has been stopped.
