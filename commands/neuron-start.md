---
description: Start the Neuron service (alias for neuron-mode)
allowed-tools: ["Bash", "Read", "Write", "Edit"]
---

# Start Neuron

This is an alias for `/tentacle:neuron-mode`. Start polling the Tentacle Brain for tasks.

## Context

- Config: !`cat ~/.claude/tentacle-config.json 2>/dev/null || echo "NOT_CONFIGURED"`
- State: !`cat ${CLAUDE_PLUGIN_ROOT}/state/neuron.local.json 2>/dev/null || echo "NO_STATE"`

## Your task

Follow the exact same steps as `/tentacle:neuron-mode`:

1. Check config and state exist. If not, guide user to run `/tentacle:tentacle-config` and `/tentacle:tentacle-register`.
2. Activate the Neuron (set `active: true` in state file).
3. Enter the poll loop: poll for tasks, execute them in `~/tentacle-workspace`, submit results.
4. Deactivate on exit.

See `/tentacle:neuron-mode` for detailed implementation.
