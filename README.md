# GenLayer MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

A comprehensive MCP (Model Context Protocol) server for generating sophisticated GenLayer Intelligent Contracts with AI-native blockchain capabilities.

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features) 
- [Quick Start](#-quick-start)
- [Installation Guide](#-installation-guide)
  - [NPX Method (Recommended)](#npx-method-recommended)
  - [IDE Integrations](#ide-integrations)
  - [Self-Hosting Options](#self-hosting-options)
- [Available Tools](#-available-tools)
- [Testing](#-testing)
- [Architecture](#%EF%B8%8F-architecture)
- [Development](#-development)
- [GenLayer Resources](#-genlayer-resources)
- [Contributing](#-contributing)
- [Support](#-support)

## ⚠️ Disclaimer

**This project was created as an experimental proof-of-concept to test the capabilities of combining [Goose](https://github.com/block/goose) + [Qwen3-Coder](https://github.com/QwenLM/Qwen3-Coder) and [Claude Code](https://github.com/anthropics/claude-code).** This has been vibecoded, so be aware of that. Errors or inconsistencies may occur.

## 🌟 Overview

GenLayer is the first AI-native blockchain that enables **Intelligent Contracts** - smart contracts that can:

- 🧠 **Process natural language** instructions and human-readable requirements
- 🌐 **Access real-time web data** without external oracles
- 🤖 **Handle non-deterministic operations** through Optimistic Democracy consensus
- 🔍 **Leverage Large Language Models** (LLMs) for complex reasoning and decision-making
- 📊 **Perform semantic search** with built-in vector stores
- ⚖️ **Reach consensus on AI outputs** using the Equivalence Principle

This MCP server provides powerful tools for generating various types of GenLayer Intelligent Contracts, from basic storage contracts to sophisticated prediction markets, DAO governance systems, and AI-powered oracles.

## 🚀 Features

### 🛠️ Contract Generation Tools

| Tool                              | Description                                           | Key Capabilities                                            |
| --------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------- |
| **generate_intelligent_contract** | Generate custom contracts with advanced features      | LLM integration, web access, proper GenLayer syntax         |
| **create_prediction_market**      | AI-powered prediction markets                         | Multi-source resolution, sophisticated betting mechanisms   |
| **generate_contract_template**    | Predefined templates for common use cases             | DAO governance, content moderation, sentiment tracking      |
| **create_vector_store**           | Semantic search capabilities                          | Embedding generation, similarity search, metadata filtering |
| **add_web_data_access**           | Real-time web data integration                        | Multiple data formats, AI-powered processing                |
| **add_equivalence_principle**     | Consensus mechanisms for non-deterministic operations | Comparative and non-comparative validation                  |
| **explain_genlayer_concepts**     | Comprehensive documentation and examples              | Interactive learning with code samples                      |

### 🔧 Advanced Features

- **🎯 Template System**: Pre-built contracts for DAO governance, content moderation, sentiment analysis, and multi-oracle systems
- **🧪 Comprehensive Testing**: Unit tests, integration tests, and end-to-end validation
- **📋 Schema Validation**: Input validation with detailed error messages and suggestions
- **📚 Educational Tools**: Built-in explanations of GenLayer concepts with code examples
- **🔍 Type Safety**: Full TypeScript implementation with proper type annotations
- **⚡ Performance Optimized**: Efficient contract generation with caching and optimization

## 🚀 Quick Start

The easiest way to get started is with **NPX** - zero installation required!

### 1. Add to Your AI Client

**Claude Desktop:**
```json
{
  "mcpServers": {
    "genlayer": {
      "command": "npx",
      "args": ["-y", "@genlayer/mcp-server@latest"]
    }
  }
}
```

**Cursor:**
```json
{
  "mcpServers": {
    "genlayer": {
      "command": "npx", 
      "args": ["-y", "@genlayer/mcp-server@latest"]
    }
  }
}
```

### 2. Start Using GenLayer Tools

Ask your AI client:
```
"Generate a GenLayer intelligent contract called 'HelloWorld' that stores a greeting message"
```

That's it! The server downloads and runs automatically. 🎉

---

## 📋 Installation Guide

### NPX Method (Recommended)

**No installation required!** Just add the NPX configuration to your MCP client and it works automatically.

```bash
# The server runs automatically when referenced by MCP clients
# No manual startup needed!
```

**Supported Clients:**
- ✅ Claude Desktop
- ✅ Claude Code
- ✅ Cursor
- ✅ Windsurf  
- ✅ VS Code (with MCP extension)
- ✅ Gemini CLI

### IDE Integrations

<details>
<summary><strong>🎯 Claude Desktop</strong></summary>

#### Installation Steps:
1. Open **Settings** → **Developer** → **Edit Config**
2. Add this configuration:

```json
{
  "mcpServers": {
    "genlayer": {
      "command": "npx",
      "args": ["-y", "@genlayer/mcp-server@latest"]
    }
  }
}
```

#### Alternative (Manual):
```json
{
  "mcpServers": {
    "genlayer": {
      "command": "node",
      "args": ["/absolute/path/to/genlayer-mcp-server/dist/index.js"]
    }
  }
}
```

</details>

<details>
<summary><strong>🚀 Claude Code</strong></summary>

```bash
# Add with NPX (recommended)
claude mcp add -t stdio genlayer "npx -y @genlayer/mcp-server@latest"

# Verify installation
claude mcp list
claude mcp test genlayer
```

</details>

<details>
<summary><strong>🎨 Cursor</strong></summary>

1. Open **Settings** (Cmd+Shift+J) → **Tools & Integrations** → **New MCP Server**
2. Add configuration:

```json
{
  "mcpServers": {
    "genlayer": {
      "command": "npx",
      "args": ["-y", "@genlayer/mcp-server@latest"]
    }
  }
}
```

</details>

<details>
<summary><strong>💻 Visual Studio Code</strong></summary>

1. Install **MCP for VS Code** extension
2. Open Command Palette → **MCP: Add Server**
3. Use this configuration:

```json
{
  "servers": {
    "genlayer": {
      "command": "npx",
      "args": ["-y", "@genlayer/mcp-server@latest"]
    }
  }
}
```

</details>

<details>
<summary><strong>🌊 Windsurf</strong></summary>

1. Open **Settings** (Cmd+,) → **MCP Servers** → **Manage MCP servers** → **View raw config**
2. Add configuration:

```json
{
  "mcpServers": {
    "genlayer": {
      "command": "npx",
      "args": ["-y", "@genlayer/mcp-server@latest"]
    }
  }
}
```

</details>

<details>
<summary><strong>💎 Gemini CLI</strong></summary>

1. Install Gemini CLI: `npm install -g @google-ai/gemini-cli`
2. Edit `~/.gemini/settings.json`:

```json
{
  "mcpServers": {
    "genlayer": {
      "command": "npx",
      "args": ["-y", "@genlayer/mcp-server@latest"]
    }
  }
}
```

</details>

### Self-Hosting Options

#### Local Development

**Prerequisites:**
- Node.js 18.0.0+
- npm or yarn

```bash
# Clone and install
git clone https://github.com/albert-mr/genlayer-mcp-server.git
cd genlayer-mcp-server
npm install
npm run build

# Test the server
npm start
```

#### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
CMD ["node", "dist/index.js"]
```

```bash
# Build and run
docker build -t genlayer-mcp-server .
docker run genlayer-mcp-server
```

#### Custom NPM Package

To publish your own version:

```bash
# Build and test
npm run build
npm test

# Publish to npm  
npm publish

# Users can then use:
# npx -y @your-org/mcp-server@latest
```

## 🧪 Testing

The project includes comprehensive testing:

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests
npm run test:integration

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Test the server manually
npm run test:server
```

### Test Coverage

- **Unit Tests**: Individual tool and utility function testing
- **Integration Tests**: Full MCP server functionality testing
- **End-to-End Tests**: Complete contract generation workflows
- **Performance Tests**: Concurrent request handling and response consistency

## 🏗️ Architecture

### Project Structure

```
genlayer-mcp-server/
├── src/                         # Source code
│   ├── index.ts                 # 🚀 Main entry point (IIFE startup pattern)
│   ├── server.ts                # 🏭 MCP server factory (OpenZeppelin-style)
│   ├── tools/                   # 🛠️ Tool system (modular architecture)
│   │   ├── toolRegistry.ts      #   ├─ Registration & request handling
│   │   ├── toolDefinitions.ts   #   ├─ Schema definitions & metadata
│   │   └── genLayerTools.ts     #   └─ Business logic implementations
│   ├── utils/                   # 🔧 Utilities
│   │   └── contractGenerator.ts #   └─ GenLayer contract generation engine
│   └── config/                  # ⚙️ Configuration
│       └── tools.ts             #   └─ Constants & type mappings
├── tests/                       # 🧪 Test suite
│   ├── tools.test.ts            #   ├─ Tool unit tests
│   ├── contractGenerator.test.ts #   ├─ Generator unit tests
│   ├── integration.test.ts      #   ├─ End-to-end integration tests
│   └── setup.ts                 #   └─ Test configuration & mocks
├── .github/                     # 🤖 Repository governance
│   ├── workflows/               #   ├─ CI/CD automation
│   ├── ISSUE_TEMPLATE/          #   ├─ Issue templates
│   ├── CODEOWNERS               #   ├─ Code review assignments
│   └── dependabot.yml           #   └─ Automated dependency updates
├── dist/                        # 📦 Compiled JavaScript output
├── coverage/                    # 📊 Test coverage reports
└── README.md                    # 📖 Project documentation
```

### Architecture Patterns

#### 🏭 **Factory Pattern (OpenZeppelin-inspired)**
```typescript
// src/server.ts - Server factory
export function createServer(): Server {
  const server = new Server({
    name: "genlayer-mcp-server",
    version,
  }, {
    capabilities: { tools: {} }
  });
  
  registerGenLayerTools(server);
  return server;
}
```

#### 🚀 **IIFE Startup Pattern**
```typescript
// src/index.ts - Auto-starting server
const transport = new StdioServerTransport();
(async () => {
  const server = createServer();
  await server.connect(transport);
})();
```

#### 🛠️ **Modular Tool System**
```typescript
// Separation of concerns across three layers:
// 1. toolDefinitions.ts  → Schema & metadata
// 2. toolRegistry.ts     → MCP protocol integration  
// 3. genLayerTools.ts    → Business logic
```

### Key Components

#### 🎯 **Core Server Architecture**
- **Entry Point** (`index.ts`): Stdio-based MCP server with IIFE auto-startup for NPX deployment
- **Server Factory** (`server.ts`): Configurable server creation following OpenZeppelin patterns
- **Transport Layer**: MCP SDK stdio transport enabling seamless AI client integration

#### 🛠️ **Tool System Architecture** 
- **Tool Definitions** (`toolDefinitions.ts`): Centralized schema definitions with Zod validation
- **Tool Registry** (`toolRegistry.ts`): MCP protocol handlers and request routing
- **Tool Implementations** (`genLayerTools.ts`): High-level business logic with error handling

#### ⚙️ **Generation Engine**
- **Contract Generator** (`contractGenerator.ts`): Core GenLayer syntax and template engine
- **Configuration** (`tools.ts`): Type mappings, templates, and generation constants
- **Template System**: Pre-built patterns (DAO, oracles, prediction markets, vector stores)

#### 🧪 **Testing Architecture**
- **Unit Tests**: Individual component validation with comprehensive mocking
- **Integration Tests**: Full MCP server workflow testing with real protocol communication  
- **Coverage**: Multi-Node.js version testing (18.x, 20.x, 22.x) via GitHub Actions

#### 🤖 **DevOps & Governance**
- **Branch Protection**: Required PR reviews, CI checks, code owner approval
- **Automated Testing**: Multi-environment validation with coverage reporting
- **Dependency Management**: Weekly Dependabot updates with security monitoring
- **NPM Publishing**: Automated releases triggered by GitHub releases

## 📚 Available Tools

### 1. `generate_intelligent_contract`

Generate comprehensive GenLayer Intelligent Contracts with customizable features.

**Parameters:**

- `contract_name` (string): Contract class name (PascalCase)
- `requirements` (string): Detailed contract requirements
- `use_llm` (boolean): Include LLM interaction capabilities
- `web_access` (boolean): Include web data access
- `storage_fields` (array): Contract storage fields with types
- `template_type` (enum): Use predefined templates

**Example Usage:**

```json
{
  \"contract_name\": \"SmartOracle\",
  \"requirements\": \"An oracle that fetches and validates data from multiple sources\",
  \"use_llm\": true,
  \"web_access\": true,
  \"storage_fields\": [
    {\"name\": \"data_sources\", \"type\": \"list\", \"description\": \"List of data source URLs\"},
    {\"name\": \"last_update\", \"type\": \"integer\", \"description\": \"Timestamp of last update\"}
  ]
}
```

### 2. `create_prediction_market`

Generate sophisticated prediction markets with AI-powered resolution.

**Parameters:**

- `market_name` (string): Market contract name (must end with 'Market')
- `description` (string): What the market predicts
- `resolution_criteria` (string): Specific resolution criteria
- `web_sources` (array): Data source URLs for resolution
- `resolution_deadline` (string): When market resolves
- `category` (enum): Market category

### 3. `generate_contract_template`

Generate contracts from predefined templates for common use cases.

**Available Templates:**

- `dao_governance`: DAO governance with AI proposal analysis
- `content_moderation`: AI-powered content filtering
- `sentiment_tracker`: Sentiment analysis and tracking
- `multi_oracle`: Multi-source data oracle with consensus

### 4. `explain_genlayer_concepts`

Get detailed explanations of GenLayer concepts with code examples.

**Available Concepts:**

- `equivalence_principle`: Consensus for non-deterministic operations
- `optimistic_democracy`: GenLayer's consensus mechanism
- `llm_integration`: AI integration in smart contracts
- `web_data_access`: Native web connectivity
- `vector_stores`: Semantic search capabilities
- `intelligent_contracts`: Overview of intelligent contracts
- `genvm`: GenLayer virtual machine
- `genlayer_types`: Data types and storage
- `best_practices`: Security and development guidelines

## 🔗 Integration Examples

### With Claude Desktop

1. Install and configure the MCP server
2. Ask Claude: _\"Generate a DAO governance contract with AI-powered proposal validation\"_
3. Claude will use the GenLayer MCP tools to create sophisticated contracts

### With Other MCP Clients

The server implements the standard MCP protocol and works with any compatible client:

```javascript
// Example MCP client integration
const client = new MCPClient();
await client.connect("stdio", { command: "node", args: ["dist/index.js"] });

const tools = await client.listTools();
const result = await client.callTool("generate_intelligent_contract", {
  contract_name: "MyContract",
  requirements: "A contract for managing digital assets",
});
```

## 🌐 GenLayer Resources

### Documentation

- 📖 [GenLayer Documentation](https://docs.genlayer.com/) - Complete developer documentation
- 🎓 [Intelligent Contracts Guide](https://docs.genlayer.com/developers/intelligent-contracts/introduction) - Learn to build intelligent contracts
- 🔧 [GenLayer CLI](https://docs.genlayer.com/developers/intelligent-contracts/tools/genlayer-cli) - Command-line development tools
- ⚡ [Quick Start Guide](https://docs.genlayer.com/developers/intelligent-contracts/your-first-contract) - Get started quickly

### Tools & Platforms

- 🖥️ [GenLayer Studio](https://studio.genlayer.com/) - Browser-based development environment
- 📦 [GenLayer JS SDK](https://docs.genlayer.com/developers/decentralized-applications/genlayer-js) - JavaScript/TypeScript SDK
- 🐍 [Python SDK](https://docs.genlayer.com/developers/intelligent-contracts/tooling-setup) - Python development tools

### Community

- 💬 [Discord Community](https://discord.gg/8Jm4v89VAu) - Join the developer community
- 📱 [Telegram](https://t.me/genlayer) - Real-time discussions
- 🐙 [GitHub](https://github.com/genlayerlabs) - Open source repositories
- 🐦 [Twitter](https://twitter.com/genlayer) - Latest news and updates

### Examples & Tutorials

- 📋 [Contract Examples](https://docs.genlayer.com/developers/intelligent-contracts/examples/storage) - Real-world contract examples
- 🎯 [Use Case Ideas](https://docs.genlayer.com/developers/intelligent-contracts/ideas) - Inspiration for your projects
- 🏗️ [Project Boilerplate](https://docs.genlayer.com/developers/decentralized-applications/project-boilerplate) - Starter templates

## 🛠️ Development

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

### Project Structure

```
src/
├── index.ts                 # Main MCP server entry point
├── server.ts                # MCP server factory
├── tools/
│   ├── toolRegistry.ts      # Tool registration and handling
│   ├── toolDefinitions.ts   # Tool schema definitions
│   └── genLayerTools.ts     # Tool implementations
├── utils/
│   └── contractGenerator.ts # Contract generation utilities
└── config/
    └── tools.ts             # Configuration constants
```

### Testing Strategy

- **Unit Tests**: Individual tool and utility function testing
- **Integration Tests**: Full MCP server functionality testing
- **End-to-End Tests**: Complete contract generation workflows

### Configuration

#### Environment Variables

```bash
# Set debug mode
export DEBUG=mcp:*

# GenLayer network configuration
export GENLAYER_NETWORK=testnet
```

#### Custom Tool Configuration

Edit `src/config/tools.ts` to customize:
- Default contract templates
- GenLayer type mappings
- Tool descriptions and schemas
- Validation rules

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests
4. **Run the test suite**: `npm test`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Code Quality Standards

- **TypeScript**: Full type safety with strict configuration
- **Testing**: Comprehensive unit and integration test coverage
- **Documentation**: Clear code comments and README updates
- **Error Handling**: Proper validation and error messages
- **Performance**: Efficient algorithms and resource usage

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **GenLayer Team** - For creating the first AI-native blockchain
- **MCP Community** - For the Model Context Protocol specification
- **Contributors** - Thank you to all who have contributed to this project

## 📞 Support

### Getting Help

1. **Check the logs** - Most issues are revealed in server logs
2. **Test connectivity** - Use the provided test commands:
   ```bash
   # Basic functionality test
   npm run test:unit
   
   # Test server startup  
   npm start
   ```
3. **Try the examples** - Ask your AI client:
   ```
   "List the available tools from the GenLayer MCP server"
   "Generate a simple GenLayer contract called 'Test'"
   ```

### Troubleshooting

#### Issue: "Command not found" or "Module not found"
**Solution:**
- Ensure Node.js 18.0.0+ is installed
- Verify absolute paths in manual configurations
- Check that build was successful: `npm run build`

#### Issue: "Server not found" (NPX mode)
**Solution:**
- Ensure internet connection for npm package download
- Clear npm cache: `npm cache clean --force`
- Verify package name: `@genlayer/mcp-server`

#### Issue: "Tools not available"
**Solution:**
- Restart your IDE/client after configuration changes
- Verify MCP server configuration syntax
- Check server logs for errors

### Community & Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/albert-mr/genlayer-mcp-server/issues)
- 💬 **Community Support**: [Discord](https://discord.gg/8Jm4v89VAu)
- 📱 **Real-time Chat**: [Telegram](https://t.me/genlayer)

---

**Built with ❤️ for the GenLayer ecosystem**

_Empowering developers to build the next generation of AI-powered decentralized applications_
