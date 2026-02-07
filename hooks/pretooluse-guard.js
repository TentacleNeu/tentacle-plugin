const fs = require('fs');
const path = require('path');
const os = require('os');

const input = JSON.parse(fs.readFileSync(0, 'utf8'));
const toolName = input.tool_name;
const args = input.arguments || {};

const WORKSPACE = path.join(os.homedir(), 'tentacle-workspace');
const WORKSPACE_ABS = path.resolve(WORKSPACE);
const WORKSPACE_NORMALIZED = WORKSPACE_ABS.replace(/\\/g, '/');

// 文件操作工具：路径必须在工作区内
if (['Read', 'Edit', 'Write', 'MultiEdit', 'NotebookEdit', 'Glob', 'Grep'].includes(toolName)) {
  // 根据工具类型提取路径参数
  let filePath;
  if (toolName === 'Glob' || toolName === 'Grep') {
    filePath = args.path;
  } else if (toolName === 'NotebookEdit') {
    filePath = args.notebook_path;
  } else {
    filePath = args.file_path;
  }

  if (filePath) {
    // 将路径统一为绝对路径进行比较
    const resolvedPath = path.resolve(filePath);
    if (!resolvedPath.startsWith(WORKSPACE_ABS)) {
      console.log(JSON.stringify({
        decision: "block",
        reason: `路径越界: ${filePath}。Neuron 模式仅允许访问 ${WORKSPACE}`,
        systemMessage: "❌ 安全拦截：Neuron 禁止访问工作区以外的文件"
      }));
      process.exit(0);
    }
  }
}

// Bash 工具命令安全检查
if (toolName === 'Bash') {
  const command = args.command || '';

  // 禁止的命令模式
  const blockedPatterns = [
    /\.\.\//,                                 // 目录遍历
    /[~\/\\]\.ssh/i,                          // SSH 目录
    /[~\/\\]\.env\b/i,                        // 环境变量文件
    /[~\/\\]\.claude/i,                       // Claude 配置
    /\/etc\//i,                               // 系统配置 (Unix)
    /\\windows\\system32/i,                   // 系统目录 (Windows)
    /\bsudo\s/i,                              // 提权
    /\brm\s+(-[a-z]*[rf][a-z]*\s+)?[\/\\]/i, // 危险删除 (根路径)
    /\bchmod\s+777/i,                         // 不安全权限
    /\bcurl\b.*\|\s*(ba)?sh/i,               // 远程代码执行
    /\bwget\b.*\|\s*(ba)?sh/i,               // 远程代码执行
    /\beval\s/i,                              // eval 注入
  ];

  // 敏感文件/目录访问模式
  const sensitivePathPatterns = [
    /[~\/\\]\.aws/i,
    /[~\/\\]\.kube/i,
    /[~\/\\]\.docker\/config/i,
    /[~\/\\]\.gitconfig/i,
    /[~\/\\]\.npmrc/i,
    /[~\/\\]\.pypirc/i,
    /id_rsa/i,
    /id_ed25519/i,
    /\.pem\b/i,
    /credentials/i,
    /secrets?\.(ya?ml|json|toml)/i,
  ];

  const allPatterns = [...blockedPatterns, ...sensitivePathPatterns];

  for (const pattern of allPatterns) {
    if (pattern.test(command)) {
      console.log(JSON.stringify({
        decision: "block",
        reason: `危险命令被拦截: 匹配规则 ${pattern}`,
        systemMessage: "❌ 安全拦截：Neuron 禁止执行可能访问敏感资源的命令"
      }));
      process.exit(0);
    }
  }

  // 检查命令中的绝对路径是否在工作区外
  // 匹配 Unix 绝对路径 (/xxx) 和 Windows 绝对路径 (C:\xxx)
  const absolutePathRegex = /(?:^|\s|["'])(\/(?!dev\/null)[^\s"']+)/g;
  const winAbsolutePathRegex = /(?:^|\s|["'])([A-Za-z]:[\\\/][^\s"']*)/g;
  const homePathRegex = /~\//g;

  let match;

  while ((match = absolutePathRegex.exec(command)) !== null) {
    const absPath = match[1];
    if (!absPath.startsWith(WORKSPACE_NORMALIZED) && !absPath.startsWith('/dev/null')) {
      console.log(JSON.stringify({
        decision: "block",
        reason: `命令包含工作区外的路径: ${absPath}`,
        systemMessage: "❌ 安全拦截：Neuron 禁止访问工作区以外的路径"
      }));
      process.exit(0);
    }
  }

  while ((match = winAbsolutePathRegex.exec(command)) !== null) {
    const absPath = match[1];
    const resolvedPath = path.resolve(absPath);
    if (!resolvedPath.startsWith(WORKSPACE_ABS)) {
      console.log(JSON.stringify({
        decision: "block",
        reason: `命令包含工作区外的路径: ${absPath}`,
        systemMessage: "❌ 安全拦截：Neuron 禁止访问工作区以外的路径"
      }));
      process.exit(0);
    }
  }

  if (homePathRegex.test(command) && !command.includes('~/tentacle-workspace')) {
    console.log(JSON.stringify({
      decision: "block",
      reason: `命令包含 home 目录访问: ~/`,
      systemMessage: "❌ 安全拦截：Neuron 禁止访问 home 目录（~/tentacle-workspace 除外）"
    }));
    process.exit(0);
  }
}

console.log(JSON.stringify({ decision: "allow" }));
