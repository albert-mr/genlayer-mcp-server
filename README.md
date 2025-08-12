# GenLayer MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

A comprehensive MCP (Model Context Protocol) server for generating sophisticated
GenLayer Intelligent Contracts with AI-native blockchain capabilities.

## ⚠️ Disclaimer

**This project was created as an experimental proof-of-concept to test the
capabilities of combining [Goose](https://github.com/block/goose) +
[Qwen3-Coder](https://github.com/QwenLM/Qwen3-Coder) and
[Claude Code](https://github.com/anthropics/claude-code).** This has been
vibecoded, so be aware of that. Errors or inconsistencies may occur.

## 🌟 Overview

GenLayer is the first AI-native blockchain that enables **Intelligent
Contracts** - smart contracts that can:

- 🧠 **Process natural language** instructions and human-readable requirements
- 🌐 **Access real-time web data** without external oracles
- 🤖 **Handle non-deterministic operations** through Optimistic Democracy
  consensus
- 🔍 **Leverage Large Language Models** (LLMs) for complex reasoning and
  decision-making
- 📊 **Perform semantic search** with built-in vector stores
- ⚖️ **Reach consensus on AI outputs** using the Equivalence Principle

This MCP server provides tools for generating various types of GenLayer
Intelligent Contracts—ranging from basic storage contracts to sophisticated
prediction markets, AI-powered oracles, and more—and is designed to make the
developer experience easier and more streamlined when building, testing, and
deploying intelligent contracts.

## 🚀 Installation & Usage

### Quick Setup with Claude Code

**Add the MCP server** (no installation needed):
Simply run this command in Claude Code:
```bash
claude mcp add genlayer npx -- -y @albert-mr/genlayer-mcp-server@latest
```

### Alternative IDE Setup

For other IDEs that support MCP:

**Use directly with npx** (no installation required):
Add to your MCP configuration:
```json
{
  "mcpServers": {
    "genlayer": {
      "command": "npx",
      "args": [
        "-y",
        "@albert-mr/genlayer-mcp-server@latest"
      ]
    }
  }
}
```

## 🌐 GenLayer Resources

### Documentation

- 📖 [GenLayer Documentation](https://docs.genlayer.com/) - Complete developer
  documentation
- 🎓
  [Intelligent Contracts Guide](https://docs.genlayer.com/developers/intelligent-contracts/introduction) -
  Learn to build intelligent contracts
- 🔧
  [GenLayer CLI](https://docs.genlayer.com/developers/intelligent-contracts/tools/genlayer-cli) -
  Command-line development tools
- ⚡
  [Quick Start Guide](https://docs.genlayer.com/developers/intelligent-contracts/your-first-contract) -
  Get started quickly

### Tools & Platforms

- 🖥️ [GenLayer Studio](https://studio.genlayer.com/) - Browser-based development
  environment
- 📦
  [GenLayer JS SDK](https://docs.genlayer.com/developers/decentralized-applications/genlayer-js) -
  JavaScript/TypeScript SDK
- 🐍
  [Python SDK](https://docs.genlayer.com/developers/intelligent-contracts/tooling-setup) -
  Python development tools

### Community

- 💬 [Discord Community](https://discord.gg/8Jm4v89VAu) - Join the developer
  community
- 📱 [Telegram](https://t.me/genlayer) - Real-time discussions
- 🐙 [GitHub](https://github.com/genlayerlabs) - Open source repositories
- 🐦 [Twitter](https://twitter.com/genlayer) - Latest news and updates

### Examples & Tutorials

- 📋
  [Contract Examples](https://docs.genlayer.com/developers/intelligent-contracts/examples/storage) -
  Real-world contract examples
- 🎯
  [Use Case Ideas](https://docs.genlayer.com/developers/intelligent-contracts/ideas) -
  Inspiration for your projects
- 🏗️
  [Project Boilerplate](https://docs.genlayer.com/developers/decentralized-applications/project-boilerplate) -
  Starter templates

## 🛠️ Development

We welcome contributions! Here's how to get started:

### Development Setup

```bash
# Clone the repository
git clone https://github.com/albert-mr/genlayer-mcp-server.git
cd genlayer-mcp-server

# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Run tests during development
npm run test:watch

# Type checking
npm run lint

# Full validation
npm run validate
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.

## Community & Support

- 🐛 **Bug Reports**:
  [GitHub Issues](https://github.com/albert-mr/genlayer-mcp-server/issues)
- 💬 **Community Support**: [Discord](https://discord.gg/8Jm4v89VAu)
- 📱 **Real-time Chat**: [Telegram](https://t.me/genlayer)

---

**Built with ❤️ for the GenLayer ecosystem**

_Empowering developers to build the next generation of AI-powered decentralized
applications_
