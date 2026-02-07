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

2. Deactivate the Neuron:

```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/deactivate-neuron.js
```

3. Confirm to the user that the Neuron has been stopped, and display the session stats from the output.
