# Tentacle Plugin 开发指南

## 项目结构
- `.claude-plugin/`: 插件定义
- `commands/`: 交互指令定义
- `hooks/`: 生命周期钩子 (JavaScript)
- `lib/`: 共享逻辑
- `state/`: 本地运行时状态 (不提交)

## 开发流程
1. 修改代码
2. 运行 `claude /reload` (如果 Claude Code 支持) 或重启会话
3. 验证 Hook 逻辑
