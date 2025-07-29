#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

import { GenLayerTools } from "./tools/genLayerTools.js";
import { TOOLS_CONFIG } from "./config/tools.js";

class GenLayerMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "genlayer-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "generate_intelligent_contract",
            description: "Generate a comprehensive GenLayer Intelligent Contract with advanced features including LLM integration, web data access, and proper GenLayer syntax",
            inputSchema: {
              type: "object",
              properties: {
                contract_name: {
                  type: "string",
                  description: "Name of the contract class (PascalCase recommended)",
                  pattern: "^[A-Z][a-zA-Z0-9]*$"
                },
                requirements: {
                  type: "string",
                  description: "Detailed description of what the contract should accomplish, including business logic and use cases"
                },
                use_llm: {
                  type: "boolean",
                  description: "Include LLM interaction capabilities with proper equivalence principles",
                  default: false
                },
                web_access: {
                  type: "boolean",
                  description: "Include web data access capabilities for real-time information",
                  default: false
                },
                storage_fields: {
                  type: "array",
                  description: "Storage fields for the contract with GenLayer type mappings",
                  items: {
                    type: "object",
                    properties: {
                      name: { 
                        type: "string",
                        description: "Field name (snake_case recommended)"
                      },
                      type: { 
                        type: "string",
                        description: "Field type (string, integer, boolean, address, list, dict, etc.)",
                        enum: ["string", "integer", "boolean", "address", "list", "dict", "float", "bytes"]
                      },
                      description: { 
                        type: "string",
                        description: "Optional description of the field's purpose"
                      }
                    },
                    required: ["name", "type"]
                  },
                  default: []
                },
                template_type: {
                  type: "string",
                  description: "Use a predefined contract template for specific use cases",
                  enum: ["basic", "dao_governance", "content_moderation", "sentiment_tracker", "multi_oracle"],
                  default: "basic"
                }
              },
              required: ["contract_name", "requirements"]
            }
          },
          {
            name: "add_equivalence_principle",
            description: "Add Equivalence Principle validation to a contract method for handling non-deterministic operations",
            inputSchema: {
              type: "object",
              properties: {
                contract_code: {
                  type: "string",
                  description: "The existing contract code"
                },
                method_name: {
                  type: "string",
                  description: "Name of the method to add validation to"
                },
                validation_type: {
                  type: "string",
                  enum: ["comparative", "non_comparative"],
                  description: "Type of validation to apply"
                },
                tolerance: {
                  type: "number",
                  description: "Tolerance level for validation (optional)",
                  default: 0.1
                }
              },
              required: ["contract_code", "method_name", "validation_type"]
            }
          },
          {
            name: "create_vector_store",
            description: "Create a GenLayer Vector Store contract for semantic search capabilities",
            inputSchema: {
              type: "object",
              properties: {
                store_name: {
                  type: "string",
                  description: "Name of the vector store contract"
                },
                description: {
                  type: "string",
                  description: "Description of the vector store's purpose"
                },
                metadata_fields: {
                  type: "array",
                  description: "Metadata fields for stored vectors",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      type: { type: "string" }
                    },
                    required: ["name", "type"]
                  },
                  default: []
                }
              },
              required: ["store_name", "description"]
            }
          },
          {
            name: "add_web_data_access",
            description: "Add web data access capabilities to an existing contract",
            inputSchema: {
              type: "object",
              properties: {
                contract_code: {
                  type: "string",
                  description: "The existing contract code"
                },
                url_template: {
                  type: "string",
                  description: "URL template for web data access"
                },
                data_processing_logic: {
                  type: "string",
                  description: "Description of how to process the fetched data"
                }
              },
              required: ["contract_code", "url_template", "data_processing_logic"]
            }
          },
          {
            name: "create_prediction_market",
            description: "Create an advanced prediction market contract with AI-powered resolution using multiple web sources and sophisticated betting mechanisms",
            inputSchema: {
              type: "object",
              properties: {
                market_name: {
                  type: "string",
                  description: "Name of the prediction market contract (PascalCase)",
                  pattern: "^[A-Z][a-zA-Z0-9]*Market$"
                },
                description: {
                  type: "string",
                  description: "Detailed description of what the market is predicting, including context and scope"
                },
                resolution_criteria: {
                  type: "string",
                  description: "Specific, measurable criteria for resolving the market (e.g., 'Bitcoin price above $50,000 on January 1, 2025')"
                },
                web_sources: {
                  type: "array",
                  description: "Reliable web sources to check for market resolution (URLs)",
                  items: {
                    type: "string",
                    format: "uri"
                  },
                  minItems: 1,
                  default: ["https://api.coindesk.com/v1/bpi/currentprice.json"]
                },
                resolution_deadline: {
                  type: "string",
                  description: "When the market should be resolved (descriptive)",
                  default: "No specific deadline"
                },
                category: {
                  type: "string",
                  description: "Market category for organization",
                  enum: ["crypto", "sports", "politics", "technology", "finance", "weather", "entertainment", "other"],
                  default: "other"
                }
              },
              required: ["market_name", "description", "resolution_criteria"]
            }
          },
          {
            name: "generate_contract_template",
            description: "Generate a contract from predefined templates for common use cases like DAO governance, content moderation, or sentiment tracking",
            inputSchema: {
              type: "object",
              properties: {
                template_type: {
                  type: "string",
                  description: "Type of contract template to generate",
                  enum: ["dao_governance", "content_moderation", "sentiment_tracker", "multi_oracle"]
                },
                contract_name: {
                  type: "string",
                  description: "Name for the generated contract",
                  pattern: "^[A-Z][a-zA-Z0-9]*$"
                },
                custom_parameters: {
                  type: "object",
                  description: "Template-specific customization parameters",
                  properties: {
                    voting_threshold: {
                      type: "number",
                      description: "For DAO: percentage needed to pass proposals",
                      minimum: 1,
                      maximum: 100,
                      default: 60
                    },
                    moderation_strictness: {
                      type: "string",
                      description: "For content moderation: how strict the moderation should be",
                      enum: ["lenient", "moderate", "strict"],
                      default: "moderate"
                    },
                    sentiment_categories: {
                      type: "array",
                      description: "For sentiment tracker: categories to track",
                      items: { type: "string" },
                      default: ["general", "product", "service"]
                    },
                    data_sources: {
                      type: "array",
                      description: "For multi-oracle: default data source URLs",
                      items: { type: "string", format: "uri" },
                      default: []
                    }
                  },
                  default: {}
                }
              },
              required: ["template_type", "contract_name"]
            }
          },
          {
            name: "explain_genlayer_concepts",
            description: "Get detailed explanations of GenLayer concepts, features, and best practices for Intelligent Contract development",
            inputSchema: {
              type: "object",
              properties: {
                concept: {
                  type: "string",
                  description: "GenLayer concept to explain",
                  enum: [
                    "equivalence_principle",
                    "optimistic_democracy",
                    "llm_integration",
                    "web_data_access",
                    "vector_stores",
                    "consensus_mechanisms",
                    "intelligent_contracts",
                    "genvm",
                    "genlayer_types",
                    "best_practices"
                  ]
                },
                include_examples: {
                  type: "boolean",
                  description: "Include code examples in the explanation",
                  default: true
                },
                detail_level: {
                  type: "string",
                  description: "Level of detail for the explanation",
                  enum: ["basic", "intermediate", "advanced"],
                  default: "intermediate"
                }
              },
              required: ["concept"]
            }
          }
        ]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "generate_intelligent_contract": {
            const result = await GenLayerTools.generateIntelligentContract(args as any);
            return {
              content: [
                {
                  type: "text",
                  text: result.content
                }
              ],
              isError: result.isError
            };
          }
          
          case "generate_contract_template": {
            const result = await GenLayerTools.generateContractTemplate(args as any);
            return {
              content: [
                {
                  type: "text",
                  text: result.content
                }
              ],
              isError: result.isError
            };
          }
          
          case "explain_genlayer_concepts": {
            const result = await GenLayerTools.explainGenLayerConcepts(args as any);
            return {
              content: [
                {
                  type: "text",
                  text: result.content
                }
              ],
              isError: result.isError
            };
          }

          case "add_equivalence_principle": {
            const result = await GenLayerTools.addEquivalencePrinciple(args as any);
            return {
              content: [
                {
                  type: "text",
                  text: result.content
                }
              ],
              isError: result.isError
            };
          }

          case "create_vector_store": {
            const result = await GenLayerTools.createVectorStore(args as any);
            return {
              content: [
                {
                  type: "text",
                  text: result.content
                }
              ],
              isError: result.isError
            };
          }

          case "add_web_data_access": {
            const result = await GenLayerTools.addWebDataAccess(args as any);
            return {
              content: [
                {
                  type: "text",
                  text: result.content
                }
              ],
              isError: result.isError
            };
          }

          case "create_prediction_market": {
            const result = await GenLayerTools.createPredictionMarket(args as any);
            return {
              content: [
                {
                  type: "text",
                  text: result.content
                }
              ],
              isError: result.isError
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("GenLayer MCP Server running on stdio");
  }
}

const server = new GenLayerMCPServer();
server.run().catch(console.error);