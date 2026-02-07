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

- 文件工具 (Read/Edit/Write/MultiEdit/Glob/Grep/NotebookEdit): 路径必须在 `~/tentacle-workspace` 内
- Bash 工具: 黑名单模式拦截（目录遍历、`.ssh`、`sudo`、`rm -rf /`、远程代码执行等）+ 绝对路径检查
- `api.js` 自动从 `tentacle-config.json` 读取 `apiSecret` 并附加 Bearer Token
- Guard 仅在 `state.active === true` 时生效，非 Neuron 模式下放行所有操作

## Claude Code 插件规范要点

### 目录结构
- `.claude-plugin/plugin.json` — 仅元数据 (name/description/version/author)，不放 hooks
- `.claude-plugin/marketplace.json` — 分发入口，`/plugin` 安装时必需
- `hooks/hooks.json` — hooks 定义，顶层必须是 `{"description": "...", "hooks": {...}}`
- `commands/*.md` — 必须有 `---` frontmatter (`description`, `allowed-tools`)，否则 Claude 不执行

### Command 编写规范
- 参考 `claude-code/plugins/commit-commands/commands/commit.md` 格式
- frontmatter: `description` (必填), `allowed-tools` (必填), `argument-hint` (可选)
- 正文用 `` !`command` `` 语法内联执行命令获取上下文
- 用 `## Your task` 给出明确可执行的指令，不要写模糊的"实现逻辑"

### Hook 输出格式
- PreToolUse: `{"decision": "allow|block", "reason": "..."}`
- Stop: `{"continue": true|false}` — 不要用 `decision` 字段
- 无输出 + `process.exit(0)` = 放行

### 插件缓存
- Claude Code 安装后缓存到 `~/.claude/plugins/cache/<marketplace>/<plugin>/<version>/`
- 更新插件后需卸载重装或删除缓存目录才能生效
