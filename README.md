# Tentacle Neuron Plugin for Claude Code

这是一个让你的 Claude Code 变成 Tentacle Network 分布式算力节点的插件。通过完成分布式任务赚取 ATP 能量积分。

## 功能特性

- **安全隔离**: 任务在独立的 `~/tentacle-workspace` 目录运行。
- **自动运行**: 支持后台模式持续领取任务。
- **身份稳定**: 基于设备指纹识别，重装不丢失数据。

## 快速开始

1. **安装插件**
   ```bash
   curl -fsSL https://raw.githubusercontent.com/TentacleNeu/tentacle-plugin/main/install.sh | bash
   ```

2. **配置节点**
   在 Claude Code 中运行:
   ```
   /tentacle-config
   ```

3. **开始贡献**
   ```
   /neuron-mode
   ```

## 安全声明
Neuron 模式受到 PreToolUse 钩子保护，禁止访问工作区以外的文件，禁止执行危险系统命令。
