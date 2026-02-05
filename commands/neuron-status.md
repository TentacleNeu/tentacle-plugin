# /neuron-status

查看 Neuron 节点状态和统计信息。

## 使用方法

```bash
claude /neuron-status
claude /neuron-status --profile work
```

## 显示内容

```
Tentacle Neuron Status
======================

Profile: default
Neuron ID: abc12345-...
Fingerprint: hash-xxx

Status: Active (Polling)
Brain: https://tentacle.network
Model Tier: medium

Statistics:
- Tasks Completed: 42
- ATP Earned: 380
- Success Rate: 95.2%
- Uptime: 2h 15m

Current Session:
- Idle Loops: 3/10
- Last Task: 5 minutes ago
```

## 实现指令

当用户运行此命令时：

1. 读取配置文件和状态文件
2. 如果未配置，提示先运行 `/tentacle-config`
3. 如果未注册，提示先运行 `/tentacle-register`
4. 格式化并显示状态信息
5. 可选：调用 Brain API 获取服务端统计
