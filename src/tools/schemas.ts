// Zod schemas and TypeScript types for tool validation
import { z } from 'zod';
import {
  DEFAULT_VALUES,
  VALIDATION_PATTERNS,
  ERROR_MESSAGES,
  GENLAYER_NETWORKS
} from '../config/constants.js';
import { SecurityValidator } from '../utils/security.js';

// Storage field schema
const StorageFieldSchema = z.object({
  name: z.string(),
  type: z.enum(['string', 'integer', 'boolean', 'address', 'list', 'dict', 'float', 'bytes']),
  description: z.string().optional()
});

// Constructor argument schema
const ConstructorArgSchema = z.object({
  name: z.string(),
  type: z.string(),
  value: z.string(),
  description: z.string().optional()
});

// Metadata field schema
const MetadataFieldSchema = z.object({
  name: z.string(),
  type: z.string()
});

// Contract method schema
const ContractMethodSchema = z.object({
  name: z.string(),
  type: z.enum(['view', 'write']),
  parameters: z
    .array(
      z.object({
        name: z.string(),
        type: z.string()
      })
    )
    .default([]),
  returns: z.string().optional()
});

// Network config schema
const NetworkConfigSchema = z.object({
  rpc_url: z.string().default(DEFAULT_VALUES.rpcUrl),
  chain_id: z.number().default(DEFAULT_VALUES.chainId),
  network_name: z.string().default(DEFAULT_VALUES.networkName)
});

// Deployment options schema
const DeploymentOptionsSchema = z.object({
  gas_limit: z.number().default(DEFAULT_VALUES.gasLimit),
  wait_for_confirmation: z.boolean().default(true),
  verify_deployment: z.boolean().default(true)
});

// Tool parameter schemas
export const GenerateIntelligentContractSchema = z.object({
  contract_name: z
    .string()
    .regex(VALIDATION_PATTERNS.pascalCase, ERROR_MESSAGES.contract.nameFormat),
  requirements: z
    .string()
    .min(DEFAULT_VALUES.minRequirementsLength, ERROR_MESSAGES.contract.requirementsTooShort),
  use_llm: z.boolean().default(false),
  web_access: z.boolean().default(false),
  storage_fields: z.array(StorageFieldSchema).default([]),
  template_type: z.string().default(DEFAULT_VALUES.templateType)
});

export const GenerateContractTemplateSchema = z.object({
  template_type: z.enum([
    'dao_governance',
    'content_moderation',
    'sentiment_tracker',
    'multi_oracle'
  ]),
  contract_name: z
    .string()
    .regex(VALIDATION_PATTERNS.pascalCase, ERROR_MESSAGES.contract.nameFormat),
  custom_parameters: z
    .object({
      voting_threshold: z.number().min(1).max(100).optional(),
      moderation_strictness: z.enum(['lenient', 'moderate', 'strict']).optional(),
      sentiment_categories: z.array(z.string()).optional(),
      data_sources: z.array(z.string().url()).optional()
    })
    .default({})
});

export const CreatePredictionMarketSchema = z.object({
  market_name: z
    .string()
    .regex(VALIDATION_PATTERNS.marketName, ERROR_MESSAGES.contract.marketNameFormat),
  description: z
    .string()
    .min(
      DEFAULT_VALUES.minDescriptionLength,
      ERROR_MESSAGES.validation.minLength('Description', DEFAULT_VALUES.minDescriptionLength)
    ),
  resolution_criteria: z
    .string()
    .min(DEFAULT_VALUES.minCriteriaLength, ERROR_MESSAGES.contract.criteriaTooShort),
  web_sources: z.array(z.string().url()).min(1, 'At least one web source is required'),
  resolution_deadline: z.string().default('No specific deadline'),
  category: z
    .enum([
      'crypto',
      'sports',
      'politics',
      'technology',
      'finance',
      'weather',
      'entertainment',
      'other'
    ])
    .default('other')
});

export const CreateVectorStoreSchema = z.object({
  store_name: z.string().regex(VALIDATION_PATTERNS.pascalCase, ERROR_MESSAGES.contract.nameFormat),
  description: z
    .string()
    .min(
      DEFAULT_VALUES.minDescriptionLength,
      ERROR_MESSAGES.validation.minLength('Description', DEFAULT_VALUES.minDescriptionLength)
    ),
  metadata_fields: z.array(MetadataFieldSchema).default([])
});

export const AddEquivalencePrincipleSchema = z.object({
  contract_code: z.string().min(1, 'Contract code is required'),
  method_name: z.string().min(1, 'Method name is required'),
  validation_type: z.enum(['comparative', 'non_comparative']),
  tolerance: z.number().min(0).max(1).optional()
});

export const AddWebDataAccessSchema = z.object({
  contract_code: z.string().min(1, ERROR_MESSAGES.validation.required),
  url_template: z
    .string()
    .url(ERROR_MESSAGES.validation.invalidUrl)
    .refine(
      url => {
        const result = SecurityValidator.validateUrl(url);
        return result.isValid;
      },
      { message: 'URL failed security validation' }
    ),
  data_processing_logic: z
    .string()
    .min(
      DEFAULT_VALUES.minDescriptionLength,
      ERROR_MESSAGES.validation.minLength(
        'Data processing logic',
        DEFAULT_VALUES.minDescriptionLength
      )
    )
});

export const ExplainGenLayerConceptsSchema = z.object({
  concept: z.enum([
    'equivalence_principle',
    'optimistic_democracy',
    'llm_integration',
    'web_data_access',
    'vector_stores',
    'consensus_mechanisms',
    'intelligent_contracts',
    'genvm',
    'genlayer_types',
    'best_practices'
  ]),
  detail_level: z
    .enum(['basic', 'intermediate', 'advanced'])
    .default(DEFAULT_VALUES.detailLevel as 'intermediate'),
  include_examples: z.boolean().default(DEFAULT_VALUES.includeExamples)
});

export const ExplainGenLayerTypesSchema = z.object({
  type_category: z.enum([
    'primitive_types',
    'collection_types',
    'custom_types',
    'calldata_types',
    'storage_restrictions',
    'type_conversions',
    'all_types'
  ]),
  include_examples: z.boolean().default(DEFAULT_VALUES.includeExamples),
  include_comparisons: z.boolean().default(DEFAULT_VALUES.includeExamples)
});

export const ExplainStoragePatternsSchema = z.object({
  storage_topic: z.enum([
    'storage_basics',
    'dynarray_usage',
    'treemap_usage',
    'custom_storage_types',
    'storage_optimization',
    'storage_patterns',
    'storage_best_practices'
  ]),
  include_examples: z.boolean().default(true),
  complexity_level: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate')
});

export const GenerateDeploymentScriptSchema = z.object({
  script_type: z.enum(['typescript', 'python', 'cli_command', 'deploy_config']),
  contract_path: z.string().min(1, 'Contract path is required'),
  network_target: z
    .enum(['localnet', 'studionet', 'testnet_asimov', 'all_networks'])
    .default('localnet'),
  constructor_args: z.array(ConstructorArgSchema).default([]),
  deployment_options: DeploymentOptionsSchema.optional()
});

export const GenerateDebuggingGuideSchema = z.object({
  debug_topic: z.enum([
    'contract_debugging',
    'transaction_debugging',
    'consensus_debugging',
    'llm_debugging',
    'web_access_debugging',
    'studio_debugging',
    'cli_debugging',
    'testing_strategies'
  ]),
  include_code_examples: z.boolean().default(true),
  include_troubleshooting: z.boolean().default(true)
});

export const GenerateGenLayerJSIntegrationSchema = z.object({
  integration_type: z.enum([
    'basic_setup',
    'contract_interaction',
    'transaction_monitoring',
    'account_management',
    'event_subscription',
    'error_handling',
    'complete_example'
  ]),
  framework: z.enum(['react', 'vue', 'angular', 'vanilla', 'nextjs']).default('react'),
  contract_methods: z.array(ContractMethodSchema).default([]),
  network_config: NetworkConfigSchema.optional()
});

export const GenerateContractInteractionExamplesSchema = z.object({
  interaction_method: z.enum([
    'genlayerjs_read',
    'genlayerjs_write',
    'python_sdk_read',
    'python_sdk_write',
    'cli_interaction',
    'all_methods'
  ]),
  contract_type: z
    .enum([
      'simple_storage',
      'prediction_market',
      'dao_governance',
      'vector_store',
      'llm_contract',
      'custom_contract'
    ])
    .default('simple_storage'),
  example_operations: z
    .array(
      z.enum([
        'read_state',
        'write_state',
        'call_llm_method',
        'handle_events',
        'batch_operations',
        'error_handling',
        'gas_optimization'
      ])
    )
    .default(['read_state', 'write_state']),
  include_error_handling: z.boolean().default(true)
});

export const GenerateTestingFrameworkSchema = z.object({
  test_framework: z.enum(['pytest', 'jest', 'hardhat_style', 'custom']).default('pytest'),
  test_types: z
    .array(
      z.enum([
        'unit_tests',
        'integration_tests',
        'consensus_tests',
        'llm_behavior_tests',
        'web_access_tests',
        'performance_tests',
        'security_tests'
      ])
    )
    .default(['unit_tests', 'integration_tests']),
  contract_features: z
    .array(
      z.enum([
        'basic_operations',
        'llm_integration',
        'web_data_access',
        'consensus_mechanisms',
        'storage_operations',
        'event_emission',
        'access_control'
      ])
    )
    .default(['basic_operations']),
  mock_external_services: z.boolean().default(true)
});

export const GenerateProjectBoilerplateSchema = z.object({
  project_name: z
    .string()
    .regex(/^[a-z][a-z0-9-]*$/, 'Project name must be lowercase with hyphens'),
  project_type: z
    .enum([
      'basic_contract',
      'dao_project',
      'prediction_market',
      'ai_oracle',
      'defi_protocol',
      'social_platform',
      'full_dapp'
    ])
    .default('basic_contract'),
  include_frontend: z.boolean().default(false),
  frontend_framework: z.enum(['react', 'vue', 'nextjs', 'vanilla']).default('react'),
  include_tests: z.boolean().default(true),
  include_deployment: z.boolean().default(true),
  package_manager: z.enum(['npm', 'yarn', 'pnpm']).default('npm')
});

// Type definitions derived from schemas
export type GenerateIntelligentContractParams = z.infer<typeof GenerateIntelligentContractSchema>;
export type GenerateContractTemplateParams = z.infer<typeof GenerateContractTemplateSchema>;
export type CreatePredictionMarketParams = z.infer<typeof CreatePredictionMarketSchema>;
export type CreateVectorStoreParams = z.infer<typeof CreateVectorStoreSchema>;
export type AddEquivalencePrincipleParams = z.infer<typeof AddEquivalencePrincipleSchema>;
export type AddWebDataAccessParams = z.infer<typeof AddWebDataAccessSchema>;
export type ExplainGenLayerConceptsParams = z.infer<typeof ExplainGenLayerConceptsSchema>;
export type ExplainGenLayerTypesParams = z.infer<typeof ExplainGenLayerTypesSchema>;
export type ExplainStoragePatternsParams = z.infer<typeof ExplainStoragePatternsSchema>;
export type GenerateDeploymentScriptParams = z.infer<typeof GenerateDeploymentScriptSchema>;
export type GenerateDebuggingGuideParams = z.infer<typeof GenerateDebuggingGuideSchema>;
export type GenerateGenLayerJSIntegrationParams = z.infer<
  typeof GenerateGenLayerJSIntegrationSchema
>;
export type GenerateContractInteractionExamplesParams = z.infer<
  typeof GenerateContractInteractionExamplesSchema
>;
export type GenerateTestingFrameworkParams = z.infer<typeof GenerateTestingFrameworkSchema>;
export type GenerateProjectBoilerplateParams = z.infer<typeof GenerateProjectBoilerplateSchema>;

// Schema lookup map
export const toolSchemas = {
  generate_intelligent_contract: GenerateIntelligentContractSchema,
  generate_contract_template: GenerateContractTemplateSchema,
  create_prediction_market: CreatePredictionMarketSchema,
  create_vector_store: CreateVectorStoreSchema,
  add_equivalence_principle: AddEquivalencePrincipleSchema,
  add_web_data_access: AddWebDataAccessSchema,
  explain_genlayer_concepts: ExplainGenLayerConceptsSchema,
  explain_genlayer_types: ExplainGenLayerTypesSchema,
  explain_storage_patterns: ExplainStoragePatternsSchema,
  generate_deployment_script: GenerateDeploymentScriptSchema,
  generate_debugging_guide: GenerateDebuggingGuideSchema,
  generate_genlayerjs_integration: GenerateGenLayerJSIntegrationSchema,
  generate_contract_interaction_examples: GenerateContractInteractionExamplesSchema,
  generate_testing_framework: GenerateTestingFrameworkSchema,
  generate_project_boilerplate: GenerateProjectBoilerplateSchema
} as const;

export type ToolName = keyof typeof toolSchemas;
