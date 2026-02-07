---
description: Enter interactive Neuron mode - poll and execute distributed AI tasks to earn ATP
allowed-tools: ["Bash", "Read", "Write", "Edit"]
---

# Neuron Mode - Interactive Task Runner

Enter a continuous loop that polls the Tentacle Brain for tasks, executes them, and submits results to earn ATP.

## Context

- Config: !`cat ~/.claude/tentacle-config.json 2>/dev/null || echo "NOT_CONFIGURED"`
- State: !`cat ${CLAUDE_PLUGIN_ROOT}/state/neuron.local.json 2>/dev/null || echo "NO_STATE"`

## Your task

### Step 1: Pre-flight checks

1. If config shows "NOT_CONFIGURED", tell user to run `/tentacle:tentacle-config` first and stop.
2. If state shows "NO_STATE" or has no `neuronId`, tell user to run `/tentacle:tentacle-register` first and stop.
3. Ensure `~/tentacle-workspace` exists. If not, create it with `mkdir -p ~/tentacle-workspace`.

### Step 2: Activate Neuron

```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/activate-neuron.js
```

### Step 3: Poll loop

Enter a loop (up to 20 iterations). In each iteration:

1. **Poll for task**:
```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/poll-task.js
```

2. **If a task is returned** (`res.task` is not null):
   - Read the task prompt from `res.task.prompt`
   - Change working directory to `~/tentacle-workspace`
   - Execute the task using your normal capabilities (read files, write code, run commands - all within `~/tentacle-workspace`)
   - Submit the result:
```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/submit-task.js <TASK_ID> '<YOUR_RESULT>'
```
   - For long results, use the environment variable: `TENTACLE_RESULT='<LONG_RESULT>' node ${CLAUDE_PLUGIN_ROOT}/scripts/submit-task.js <TASK_ID> placeholder`

3. **If no task available**: Wait 15 seconds, then increment idle count. If idle count reaches 10, deactivate and stop.

```bash
sleep 15
```

### Step 4: Deactivate on exit

When the loop ends (max iterations or idle limit):
```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/deactivate-neuron.js
```

**IMPORTANT**: All file operations during task execution MUST be within `~/tentacle-workspace`. Do not access files outside this directory.
