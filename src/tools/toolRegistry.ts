import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { GenLayerTools } from "./genLayerTools.js";
import { toolDefinitions } from "./toolDefinitions.js";

export function registerGenLayerTools(server: Server): void {
  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: toolDefinitions
    };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
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

        case "explain_genlayer_types": {
          const result = await GenLayerTools.explainGenLayerTypes(args as any);
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

        case "explain_storage_patterns": {
          const result = await GenLayerTools.explainStoragePatterns(args as any);
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

        case "generate_deployment_script": {
          const result = await GenLayerTools.generateDeploymentScript(args as any);
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

        case "generate_debugging_guide": {
          const result = await GenLayerTools.generateDebuggingGuide(args as any);
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

        case "generate_genlayerjs_integration": {
          const result = await GenLayerTools.generateGenLayerJSIntegration(args as any);
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

        case "generate_contract_interaction_examples": {
          const result = await GenLayerTools.generateContractInteractionExamples(args as any);
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

        case "generate_testing_framework": {
          const result = await GenLayerTools.generateTestingFramework(args as any);
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

        case "generate_project_boilerplate": {
          const result = await GenLayerTools.generateProjectBoilerplate(args as any);
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