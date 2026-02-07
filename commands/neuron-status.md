---
description: Show current Neuron node status and session statistics
allowed-tools: ["Bash", "Read"]
---

# Neuron Status

Display the current status of this Tentacle Neuron node.

## Context

- Config: !`cat ~/.claude/tentacle-config.json 2>/dev/null || echo "NOT_CONFIGURED"`
- State: !`cat ${CLAUDE_PLUGIN_ROOT}/state/neuron.local.json 2>/dev/null || echo "NO_STATE"`

## Your task

1. If config shows "NOT_CONFIGURED", tell the user the Neuron is not configured and suggest `/tentacle:tentacle-config`.

2. If state shows "NO_STATE", tell the user the Neuron is not registered and suggest `/tentacle:tentacle-register`.

3. Otherwise, display a formatted status report using the config and state data:

```
Tentacle Neuron Status
======================
Neuron ID:   <from state.neuronId>
Brain URL:   <from config.brainUrl>
Model Tier:  <from config.modelTier>
Active:      <from state.active>

Session Statistics:
- Tasks Completed: <from state.completed_tasks>
- ATP Earned:      <from state.total_atp>
- Idle Loops:      <from state.idle_count>
```

Do not use any other tools. Just read the files and display the information.
