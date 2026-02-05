#!/bin/bash
set -e

PLUGIN_DIR="$HOME/.claude/plugins/tentacle"
REPO_URL="https://github.com/TentacleNeu/tentacle-plugin.git"

echo "🐙 Installing Tentacle Neuron Plugin..."

# 1. 克隆或更新插件
if [[ -d "$PLUGIN_DIR" ]]; then
  echo "Updating existing plugin..."
  cd "$PLUGIN_DIR" && git pull
else
  echo "Cloning plugin to $PLUGIN_DIR..."
  git clone "$REPO_URL" "$PLUGIN_DIR"
fi

# 2. 创建工作目录
mkdir -p "$HOME/tentacle-workspace"

echo ""
echo "✅ 安装完成！请在 Claude Code 中运行以下命令开始配置:"
echo "   /tentacle-config"
echo ""
echo "配置完成后，运行以下命令启动节点:"
echo "   /neuron-mode"
