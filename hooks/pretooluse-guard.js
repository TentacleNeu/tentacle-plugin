const fs = require('fs');
const path = require('path');
const os = require('os');

const input = JSON.parse(fs.readFileSync(0, 'utf8'));
const toolName = input.tool_name;
const args = input.arguments || {};

const WORKSPACE = path.join(os.homedir(), 'tentacle-workspace');

// 如果是文件操作工具，检查路径是否在工作区内
if (['Read', 'Edit', 'Write', 'MultiEdit'].includes(toolName)) {
  const filePath = args.file_path;
  if (filePath && !filePath.startsWith(WORKSPACE)) {
    console.log(JSON.stringify({
      decision: "block",
      reason: `路径越界: ${filePath}。Neuron 模式仅允许访问 ${WORKSPACE}`,
      systemMessage: "❌ 安全拦截：Neuron 禁止访问工作区以外的文件"
    }));
    process.exit(0);
  }
}

console.log(JSON.stringify({ decision: "allow" }));
