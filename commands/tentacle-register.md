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

2. **Register the Neuron**: Run the registration script, optionally passing an email override:

```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/register-neuron.js $ARGUMENTS
```

3. **Report result**: Show the Neuron ID and tell the user to run `/tentacle:neuron-mode` to start accepting tasks.
