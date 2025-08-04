// GenLayer MCP Tools Implementation

import { GenLayerContractGenerator } from '../utils/contractGenerator.js';
import { ContractGenerationTools } from './modules/contractGeneration.js';
import { TypesAndStorageTools } from './modules/typesAndStorage.js';
import { DeploymentAndDebuggingTools } from './modules/deploymentAndDebugging.js';
import { InteractionAndIntegrationTools } from './modules/interactionAndIntegration.js';
import { ConceptsExplanationTools } from './modules/conceptsExplanation.js';

export interface ToolResult {
  content: string;
  isError?: boolean;
}

export class GenLayerTools {
  static async generateIntelligentContract(params: {
    contract_name: string;
    requirements: string;
    use_llm?: boolean;
    web_access?: boolean;
    storage_fields?: Array<{ name: string; type: string; description?: string }>;
    template_type?: string;
  }): Promise<ToolResult> {
    return ContractGenerationTools.generateIntelligentContract(params);
  }

  static async addEquivalencePrinciple(params: {
    contract_code: string;
    method_name: string;
    validation_type: 'comparative' | 'non_comparative';
    tolerance?: number;
  }): Promise<ToolResult> {
    return ContractGenerationTools.addEquivalencePrinciple(params);
  }

  static async createVectorStore(params: {
    store_name: string;
    description: string;
    metadata_fields?: Array<{ name: string; type: string }>;
  }): Promise<ToolResult> {
    return ContractGenerationTools.createVectorStore(params);
  }

  static async addWebDataAccess(params: {
    contract_code: string;
    url_template: string;
    data_processing_logic: string;
  }): Promise<ToolResult> {
    return ContractGenerationTools.addWebDataAccess(params);
  }

  static async createPredictionMarket(params: {
    market_name: string;
    description: string;
    resolution_criteria: string;
    web_sources: string[];
    resolution_deadline?: string;
    category?: string;
  }): Promise<ToolResult> {
    return ContractGenerationTools.createPredictionMarket(params);
  }

  static async generateContractTemplate(params: {
    template_type: string;
    contract_name: string;
    custom_parameters?: any;
  }): Promise<ToolResult> {
    return ContractGenerationTools.generateContractTemplate(params);
  }

  static async explainGenLayerConcepts(params: {
    concept: string;
    include_examples?: boolean;
    detail_level?: string;
  }): Promise<ToolResult> {
    return ConceptsExplanationTools.explainGenLayerConcepts(params);
  }

  static async explainGenLayerTypes(params: {
    type_category: string;
    include_examples?: boolean;
    include_comparisons?: boolean;
  }): Promise<ToolResult> {
    return TypesAndStorageTools.explainGenLayerTypes(params);
  }

  static async explainStoragePatterns(params: {
    storage_topic: string;
    include_examples?: boolean;
    complexity_level?: string;
  }): Promise<ToolResult> {
    return TypesAndStorageTools.explainStoragePatterns(params);
  }

  static async generateDeploymentScript(params: {
    script_type: string;
    network_target?: string;
    contract_path: string;
    constructor_args?: Array<{ name: string; type: string; value: string; description?: string }>;
    deployment_options?: any;
  }): Promise<ToolResult> {
    return DeploymentAndDebuggingTools.generateDeploymentScript(params);
  }

  static async generateDebuggingGuide(params: {
    debug_topic: string;
    include_code_examples?: boolean;
    include_troubleshooting?: boolean;
  }): Promise<ToolResult> {
    return DeploymentAndDebuggingTools.generateDebuggingGuide(params);
  }

  static async generateGenLayerJSIntegration(params: {
    integration_type: string;
    framework?: string;
    contract_methods?: any[];
    network_config?: any;
  }): Promise<ToolResult> {
    return InteractionAndIntegrationTools.generateGenLayerJSIntegration(params);
  }

  static async generateContractInteractionExamples(params: {
    interaction_method: string;
    contract_type?: string;
    example_operations?: string[];
    include_error_handling?: boolean;
  }): Promise<ToolResult> {
    return InteractionAndIntegrationTools.generateContractInteractionExamples(params);
  }

  static async generateTestingFramework(params: {
    test_framework: string;
    test_types?: string[];
    contract_features?: string[];
    mock_external_services?: boolean;
  }): Promise<ToolResult> {
    return InteractionAndIntegrationTools.generateTestingFramework(params);
  }

  static async generateProjectBoilerplate(params: {
    project_name: string;
    project_type?: string;
    include_frontend?: boolean;
    frontend_framework?: string;
    include_tests?: boolean;
    include_deployment?: boolean;
    package_manager?: string;
  }): Promise<ToolResult> {
    return InteractionAndIntegrationTools.generateProjectBoilerplate(params);
  }
}
