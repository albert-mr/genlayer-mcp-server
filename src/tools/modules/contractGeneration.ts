// Core Contract Generation Tools
import { GenLayerContractGenerator } from "../../utils/contractGenerator.js";

export interface ToolResult {
  content: string;
  isError?: boolean;
}

export class ContractGenerationTools {
  static async generateIntelligentContract(params: {
    contract_name: string;
    requirements: string;
    use_llm?: boolean;
    web_access?: boolean;
    storage_fields?: Array<{ name: string; type: string; description?: string }>;
    template_type?: string;
  }): Promise<ToolResult> {
    try {
      // Input validation
      if (!params.contract_name || !params.contract_name.match(/^[A-Z][a-zA-Z0-9]*$/)) {
        return {
          content: `Error: Contract name must be in PascalCase and start with a capital letter. Got: ${params.contract_name}`,
          isError: true,
        };
      }

      if (!params.requirements || params.requirements.trim().length < 10) {
        return {
          content: `Error: Requirements must be at least 10 characters long and describe what the contract should do.`,
          isError: true,
        };
      }

      let contractCode: string;
      
      // Use template if specified
      if (params.template_type && params.template_type !== 'basic') {
        contractCode = GenLayerContractGenerator.generateAdvancedContractTemplate(
          params.template_type,
          params.contract_name,
          {}
        );
      } else {
        // Generate base contract
        contractCode = GenLayerContractGenerator.generateBaseContract(
          params.contract_name,
          params.storage_fields || []
        );

        // Add LLM capabilities if requested
        if (params.use_llm) {
          contractCode = GenLayerContractGenerator.addLLMInteractions(
            contractCode,
            params.requirements
          );
        }

        // Add web access if requested
        if (params.web_access) {
          contractCode = GenLayerContractGenerator.addWebDataAccess(
            contractCode,
            "https://api.example.com/data", // Default URL template
            params.requirements
          );
        }
      }

      return {
        content: `# Generated Intelligent Contract: ${params.contract_name}

## Requirements
${params.requirements}

## Features
- Template: ${params.template_type || 'basic'}
- LLM Integration: ${params.use_llm ? 'Yes' : 'No'}
- Web Access: ${params.web_access ? 'Yes' : 'No'}
- Storage Fields: ${params.storage_fields?.length || 0}

## Contract Code

\`\`\`python
${contractCode}
\`\`\`

## Usage Notes
- Deploy this contract to GenLayer testnet or mainnet
- All methods marked with @gl.public.view are read-only
- Methods marked with @gl.public.write modify contract state
- LLM methods use equivalence principles for consensus
- Web data methods fetch real-time information

## Next Steps
1. Review the generated contract code
2. Customize the business logic as needed
3. Test on GenLayer Studio: https://studio.genlayer.com/
4. Deploy to your preferred GenLayer network`,
      };
    } catch (error) {
      return {
        content: `Error generating contract: ${(error as Error).message}\n\nPlease check your parameters and try again.`,
        isError: true,
      };
    }
  }

  static async generateContractTemplate(params: {
    template_type: string;
    contract_name: string;
    custom_parameters?: any;
  }): Promise<ToolResult> {
    try {
      const contractCode = GenLayerContractGenerator.generateAdvancedContractTemplate(
        params.template_type,
        params.contract_name,
        params.custom_parameters || {}
      );

      return {
        content: `# Generated ${params.template_type} Template: ${params.contract_name}

## Template Features
${this.getTemplateFeatures(params.template_type)}

## Contract Code

\`\`\`python
${contractCode}
\`\`\`

## Usage Instructions
1. Review the generated template code
2. Customize parameters and business logic
3. Test on GenLayer Studio
4. Deploy when ready

## Template-Specific Notes
${this.getTemplateNotes(params.template_type)}`,
      };
    } catch (error) {
      return {
        content: `Error generating template: ${(error as Error).message}`,
        isError: true,
      };
    }
  }

  static async createPredictionMarket(params: {
    market_name: string;
    description: string;
    resolution_criteria: string;
    web_sources: string[];
    resolution_deadline?: string;
    category?: string;
  }): Promise<ToolResult> {
    try {
      // Enhanced validation
      if (!params.market_name.match(/^[A-Z][a-zA-Z0-9]*Market$/)) {
        return {
          content: `Error: Market name should be in PascalCase and end with 'Market'. Example: BitcoinPriceMarket`,
          isError: true,
        };
      }

      if (!params.resolution_criteria || params.resolution_criteria.length < 20) {
        return {
          content: `Error: Resolution criteria must be specific and detailed (at least 20 characters).`,
          isError: true,
        };
      }

      const marketCode = GenLayerContractGenerator.createPredictionMarket(
        params.market_name,
        params.description,
        params.resolution_criteria,
        params.web_sources || []
      );

      return {
        content: `# Generated Prediction Market: ${params.market_name}

## Market Details
- **Category**: ${params.category || 'General'}
- **Description**: ${params.description}
- **Resolution Criteria**: ${params.resolution_criteria}
- **Resolution Deadline**: ${params.resolution_deadline || 'No specific deadline'}
- **Web Sources**: ${params.web_sources?.length || 0} configured

## Contract Code

\`\`\`python
${marketCode}
\`\`\`

## Market Features
- **Betting System**: Users can place yes/no bets with ETH
- **AI Resolution**: Uses LLM to analyze web sources for resolution
- **Payout System**: Winners receive proportional payouts
- **Multi-Source Validation**: Checks multiple web sources for accuracy

## Usage Instructions
1. Deploy the contract with proper constructor arguments
2. Users can place bets using place_bet() method
3. Resolve market using resolve_market() when deadline reached
4. Winners can claim payouts using claim_winnings()

## Next Steps
1. Review and customize the resolution logic
2. Test with small amounts on testnet
3. Configure reliable web sources
4. Deploy to mainnet when ready`,
      };
    } catch (error) {
      return {
        content: `Error creating prediction market: ${(error as Error).message}`,
        isError: true,
      };
    }
  }

  static async createVectorStore(params: {
    store_name: string;
    description: string;
    metadata_fields?: Array<{ name: string; type: string }>;
  }): Promise<ToolResult> {
    try {
      const vectorStoreCode = GenLayerContractGenerator.createVectorStore(
        params.store_name,
        params.description,
        params.metadata_fields || []
      );

      return {
        content: `# Generated Vector Store: ${params.store_name}

## Store Configuration
- **Description**: ${params.description}
- **Metadata Fields**: ${params.metadata_fields?.length || 0} configured

## Contract Code

\`\`\`python
${vectorStoreCode}
\`\`\`

## Vector Store Features
- **Semantic Search**: Built-in embedding and similarity search
- **Metadata Support**: Rich metadata for enhanced filtering
- **Gas Optimized**: Efficient storage and retrieval operations
- **AI Integration**: Compatible with GenLayer's LLM features

## Usage Instructions
1. Deploy the vector store contract
2. Add texts using add_text() method
3. Search using search_similar() method
4. Query store info with get_store_info()

## Next Steps
1. Configure metadata schema for your use case
2. Test with sample data
3. Integrate with your application
4. Scale as needed`,
      };
    } catch (error) {
      return {
        content: `Error creating vector store: ${(error as Error).message}`,
        isError: true,
      };
    }
  }

  static async addEquivalencePrinciple(params: {
    contract_code: string;
    method_name: string;
    validation_type: "comparative" | "non_comparative";
    tolerance?: number;
  }): Promise<ToolResult> {
    try {
      const updatedCode = GenLayerContractGenerator.addEquivalencePrinciple(
        params.contract_code,
        params.method_name,
        params.validation_type,
        params.tolerance
      );

      return {
        content: `# Updated Contract with Equivalence Principle

## Validation Configuration
- **Method**: ${params.method_name}
- **Type**: ${params.validation_type}
- **Tolerance**: ${params.tolerance || 'default'}

## Updated Contract Code

\`\`\`python
${updatedCode}
\`\`\`

## Equivalence Principle Notes
- **Comparative**: Uses tolerance-based comparison for numerical results
- **Non-comparative**: Uses qualitative assessment for subjective decisions
- **Consensus**: Ensures validator agreement on non-deterministic operations

## Next Steps
1. Review the added validation logic
2. Test the consensus behavior
3. Adjust tolerance if needed
4. Deploy and monitor validator agreement`,
      };
    } catch (error) {
      return {
        content: `Error adding equivalence principle: ${(error as Error).message}`,
        isError: true,
      };
    }
  }

  static async addWebDataAccess(params: {
    contract_code: string;
    url_template: string;
    data_processing_logic: string;
  }): Promise<ToolResult> {
    try {
      const updatedCode = GenLayerContractGenerator.addWebDataAccess(
        params.contract_code,
        params.url_template,
        params.data_processing_logic
      );

      return {
        content: `# Updated Contract with Web Data Access

## Web Access Configuration
- **URL Template**: ${params.url_template}
- **Processing Logic**: ${params.data_processing_logic}

## Updated Contract Code

\`\`\`python
${updatedCode}
\`\`\`

## Web Access Features
- **Real-time Data**: Fetch live data from external APIs
- **Consensus Validation**: Multiple validators verify web data
- **Error Handling**: Robust handling of network issues
- **Caching**: Efficient data caching for gas optimization

## Next Steps
1. Test the web data fetching functionality
2. Verify data processing logic
3. Monitor validator consensus on web data
4. Deploy and monitor performance`,
      };
    } catch (error) {
      return {
        content: `Error adding web data access: ${(error as Error).message}`,
        isError: true,
      };
    }
  }

  private static getTemplateFeatures(templateType: string): string {
    const features = {
      dao_governance: "• AI-powered proposal analysis\n• Voting mechanisms\n• Member management\n• Treasury operations",
      content_moderation: "• AI content analysis\n• Violation detection\n• Severity scoring\n• Appeal system",
      sentiment_tracker: "• Real-time sentiment analysis\n• Historical tracking\n• Trend analysis\n• Alert system",
      multi_oracle: "• Multi-source data aggregation\n• Consensus mechanisms\n• Data validation\n• Reliability scoring"
    };
    return features[templateType as keyof typeof features] || "• Advanced smart contract features";
  }

  private static getTemplateNotes(templateType: string): string {
    const notes = {
      dao_governance: "Configure voting thresholds and member requirements according to your DAO structure.",
      content_moderation: "Adjust moderation strictness based on your community guidelines and tolerance levels.",
      sentiment_tracker: "Define relevant categories and topics for your specific use case and audience.",
      multi_oracle: "Set up reliable data sources and configure consensus parameters for accuracy."
    };
    return notes[templateType as keyof typeof notes] || "Customize the template according to your specific requirements.";
  }
}