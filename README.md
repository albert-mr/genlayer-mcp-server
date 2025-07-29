# GenLayer MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

A comprehensive MCP (Model Context Protocol) server for generating sophisticated GenLayer Intelligent Contracts with AI-native blockchain capabilities.

## ⚠️ Disclaimer

**This project was created as an experimental proof-of-concept to test the capabilities of combining [Goose](https://github.com/block/goose) + [Qwen3-Coder](https://github.com/QwenLM/Qwen3-Coder) and [Claude Code](https://github.com/anthropics/claude-code).** This has been vibecoded, so be aware of that. Errors or inconsistencies may occur. Use in production environments is not recommended without thorough testing and validation.

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

## 🏁 Quick Start

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** or **yarn** package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/albert-mr/genlayer-mcp-server.git
cd genlayer-mcp-server

# Install dependencies
npm install

# Build the project
npm run build

# Run tests to verify installation
npm test
```

### Usage with Claude Desktop

Add this configuration to your Claude Desktop settings:

```json
{
  \"mcpServers\": {
    \"genlayer\": {
      \"command\": \"node\",
      \"args\": [\"/path/to/genlayer-mcp-server/dist/index.js\"]
    }
  }
}
```

### Standalone Usage

```bash
# Start the MCP server
npm start

# Or run in development mode with auto-reload
npm run dev
```

## 📖 Usage Examples

### 1. Generate a Basic Intelligent Contract

```typescript
// Request to Claude with GenLayer MCP
\"Generate an intelligent contract called 'UserRegistry' that stores user profiles with name, email, and registration date. Include LLM capabilities for profile validation.\"
```

**Generated Output:**

```python
# { \"Depends\": \"py-genlayer:test\" }
from genlayer import *
import typing
import json
import re

class UserRegistry(gl.Contract):
    \"\"\"Intelligent Contract UserRegistry running on GenLayer\"\"\"

    # Storage fields
    name: str # User name
    email: str # User email
    registration_date: str # Registration date

    def __init__(self, name: str = \"\", email: str = \"\", registration_date: str = \"\"):
        self.name = name
        self.email = email
        self.registration_date = registration_date

    @gl.public.view
    def get_info(self) -> str:
        return \"Intelligent Contract UserRegistry running on GenLayer\"

    @gl.public.write
    def validate_profile(self, profile_data: str) -> str:
        \"\"\"Validate user profile using AI\"\"\"
        def llm_validation() -> str:
            task = f\"\"\"Validate this user profile data: {profile_data}

            Check for:
            1. Valid email format
            2. Reasonable name length
            3. Proper data formatting

            Return JSON: {{\"valid\": true/false, \"issues\": [\"list of issues\"]}}\"\"\"

            result = gl.exec_prompt(task)
            return result.strip()

        validation_result = gl.eq_principle_strict_eq(llm_validation)
        return validation_result
```

### 2. Create a Prediction Market

```typescript
// Request example
\"Create a prediction market for Bitcoin price reaching $100,000 by end of 2024\"
```

**Generated Output:**

- Complete prediction market contract with AI-powered resolution
- Multi-source data verification (CoinDesk, CoinGecko APIs)
- Sophisticated betting mechanisms with confidence levels
- Proportional payout system
- User position tracking and betting history

### 3. Generate Advanced Templates

#### DAO Governance Contract

```python
class GovernanceDAO(gl.Contract):
    \"\"\"Intelligent DAO with AI-powered proposal analysis\"\"\"

    @gl.public.write
    def create_proposal(self, title: str, description: str) -> typing.Any:
        # AI analyzes proposal for validity and impact
        def analyze_proposal() -> str:
            task = f\"\"\"Analyze DAO proposal:
            Title: {title}
            Description: {description}

            Return: {{\"validity\": true/false, \"impact\": \"low/medium/high\"}}\"\"\"
            return gl.exec_prompt(task)

        analysis = gl.eq_principle_strict_eq(analyze_proposal)
        # Store proposal with AI analysis...
```

#### Content Moderation System

```python
class ContentModerator(gl.Contract):
    \"\"\"AI-powered content moderation\"\"\"

    @gl.public.write
    def moderate_content(self, content: str) -> typing.Any:
        # Non-comparative equivalence for subjective decisions
        result = gl.eq_principle_prompt_non_comparative(
            lambda: gl.exec_prompt(f\"Moderate: {content}\"),
            task=\"Apply community guidelines\",
            criteria=\"Fair, unbiased, consistent moderation\"
        )
        return result
```

### 4. Vector Store for Semantic Search

```python
class DocumentStore(gl.Contract):
    \"\"\"Semantic document search with vector embeddings\"\"\"
    vector_store: VecDB[np.float32, typing.Literal[384], DocumentEntry]

    def get_embedding(self, text: str) -> np.ndarray:
        return genlayermodelwrappers.SentenceTransformer(\"all-MiniLM-L6-v2\")(text)

    @gl.public.write
    def add_document(self, text: str, metadata: dict) -> u256:
        embedding = self.get_embedding(text)
        entry = DocumentEntry(text=text, metadata=metadata)
        self.vector_store.insert(embedding, entry)
        return entry_id

    @gl.public.view
    def search_similar(self, query: str, top_k: int = 5) -> DynArray[dict]:
        query_embedding = self.get_embedding(query)
        results = list(self.vector_store.knn(query_embedding, top_k))
        # Return formatted results...
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

```
genlayer-mcp-server/
├── src/
│   ├── index.ts                 # Main MCP server implementation
│   ├── tools/
│   │   └── genLayerTools.ts     # GenLayer-specific tool implementations
│   ├── utils/
│   │   └── contractGenerator.ts # Contract generation utilities
│   └── config/
│       └── tools.ts             # Configuration constants
├── tests/
│   ├── tools.test.ts            # Tool unit tests
│   ├── contractGenerator.test.ts # Generator unit tests
│   ├── integration.test.ts      # Integration tests
│   └── setup.ts                 # Test configuration
├── dist/                        # Compiled JavaScript output
└── coverage/                    # Test coverage reports
```

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

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests
4. **Run the test suite**: `npm test`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Workflow

```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Run tests during development
npm run test:watch

# Check code quality
npm run lint

# Run full validation before committing
npm run validate
```

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

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/albert-mr/genlayer-mcp-server/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/albert-mr/genlayer-mcp-server/discussions)
- 💬 **Community Support**: [Discord](https://discord.gg/8Jm4v89VAu)
- 📧 **Direct Contact**: [support@genlayer.com](mailto:support@genlayer.com)

---

**Built with ❤️ for the GenLayer ecosystem**

_Empowering developers to build the next generation of AI-powered decentralized applications_
