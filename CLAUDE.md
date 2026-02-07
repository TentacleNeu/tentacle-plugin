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

## 安全守卫 (pretooluse-guard.js)

- 文件工具 (Read/Edit/Write/MultiEdit): 路径必须在 `~/tentacle-workspace` 内
- Bash 工具: 黑名单模式拦截（目录遍历、`.ssh`、`sudo`、`rm -rf /`、远程代码执行等）+ 绝对路径检查
- `api.js` 自动从 `tentacle-config.json` 读取 `apiSecret` 并附加 Bearer Token
