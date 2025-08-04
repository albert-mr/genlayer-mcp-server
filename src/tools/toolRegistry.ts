import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { GenLayerTools } from "./genLayerTools.js";
import { toolDefinitions } from "./toolDefinitions.js";
import { toolSchemas, type ToolName } from "./schemas.js";
import { ZodError } from 'zod';
import { SecurityValidator } from '../utils/security.js';

// Generic tool handler with type safety and validation
async function handleToolCall(toolName: ToolName, args: unknown): Promise<{
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
}> {
  try {
    // Get the appropriate schema for validation
    const schema = toolSchemas[toolName];
    if (!schema) {
      return {
        content: [{ type: "text", text: `Error: Unknown tool '${toolName}'` }],
        isError: true
      };
    }

    // Validate input parameters with Zod
    const validatedArgs = schema.parse(args);

    // Additional security validation
    const securityValidation = SecurityValidator.validateToolInput(toolName, validatedArgs);
    if (!securityValidation.isValid) {
      return {
        content: [{ 
          type: "text", 
          text: `Security Validation Error: ${securityValidation.errors.join(', ')}` 
        }],
        isError: true
      };
    }

    // Log security warnings if any
    if (securityValidation.warnings.length > 0) {
      console.warn(`Security warnings for tool ${toolName}:`, securityValidation.warnings);
    }

    // Use sanitized parameters
    const sanitizedArgs = securityValidation.sanitizedParams || validatedArgs;

    // Call the appropriate tool method with proper type casting
    let result;
    switch (toolName) {
      case "generate_intelligent_contract":
        result = await GenLayerTools.generateIntelligentContract(sanitizedArgs as any);
        break;
      case "generate_contract_template":
        result = await GenLayerTools.generateContractTemplate(sanitizedArgs as any);
        break;
      case "create_prediction_market":
        result = await GenLayerTools.createPredictionMarket(sanitizedArgs as any);
        break;
      case "create_vector_store":
        result = await GenLayerTools.createVectorStore(sanitizedArgs as any);
        break;
      case "add_equivalence_principle":
        result = await GenLayerTools.addEquivalencePrinciple(sanitizedArgs as any);
        break;
      case "add_web_data_access":
        result = await GenLayerTools.addWebDataAccess(sanitizedArgs as any);
        break;
      case "explain_genlayer_concepts":
        result = await GenLayerTools.explainGenLayerConcepts(sanitizedArgs as any);
        break;
      case "explain_genlayer_types":
        result = await GenLayerTools.explainGenLayerTypes(sanitizedArgs as any);
        break;
      case "explain_storage_patterns":
        result = await GenLayerTools.explainStoragePatterns(sanitizedArgs as any);
        break;
      case "generate_deployment_script":
        result = await GenLayerTools.generateDeploymentScript(sanitizedArgs as any);
        break;
      case "generate_debugging_guide":
        result = await GenLayerTools.generateDebuggingGuide(sanitizedArgs as any);
        break;
      case "generate_genlayerjs_integration":
        result = await GenLayerTools.generateGenLayerJSIntegration(sanitizedArgs as any);
        break;
      case "generate_contract_interaction_examples":
        result = await GenLayerTools.generateContractInteractionExamples(sanitizedArgs as any);
        break;
      case "generate_testing_framework":
        result = await GenLayerTools.generateTestingFramework(sanitizedArgs as any);
        break;
      case "generate_project_boilerplate":
        result = await GenLayerTools.generateProjectBoilerplate(sanitizedArgs as any);
        break;
      default:
        return {
          content: [{ type: "text", text: `Error: Unhandled tool '${toolName}'` }],
          isError: true
        };
    }

    return {
      content: [{ type: "text", text: result.content }],
      isError: result.isError || false
    };

  } catch (error) {
    if (error instanceof ZodError) {
      const validationErrors = error.issues.map((err: any) => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ');
      
      return {
        content: [{ 
          type: "text", 
          text: `Validation Error: ${validationErrors}` 
        }],
        isError: true
      };
    }

    return {
      content: [{ 
        type: "text", 
        text: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}` 
      }],
      isError: true
    };
  }
}

export function registerGenLayerTools(server: Server): void {
  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: toolDefinitions
    };
  });

  // Handle tool calls with type safety
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    // Validate tool name and delegate to generic handler
    if (name in toolSchemas) {
      return handleToolCall(name as ToolName, args);
    }

    return {
      content: [{ type: "text", text: `Error: Unknown tool '${name}'` }],
      isError: true
    };
  });
}

