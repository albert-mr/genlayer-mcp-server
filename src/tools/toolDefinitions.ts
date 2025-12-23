import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const toolDefinitions: Tool[] = [
  {
    name: 'generate_intelligent_contract',
    description:
      'Generate a comprehensive GenLayer Intelligent Contract with advanced features including LLM integration, web data access, and proper GenLayer syntax',
    inputSchema: {
      type: 'object',
      properties: {
        contract_name: {
          type: 'string',
          description: 'Name of the contract class (PascalCase recommended)',
          pattern: '^[A-Z][a-zA-Z0-9]*$'
        },
        requirements: {
          type: 'string',
          description:
            'Detailed description of what the contract should accomplish, including business logic and use cases'
        },
        use_llm: {
          type: 'boolean',
          description: 'Include LLM interaction capabilities with proper equivalence principles',
          default: false
        },
        web_access: {
          type: 'boolean',
          description: 'Include web data access capabilities for real-time information',
          default: false
        },
        storage_fields: {
          type: 'array',
          description: 'Storage fields for the contract with GenLayer type mappings',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Field name (snake_case recommended)'
              },
              type: {
                type: 'string',
                description: 'Field type (string, integer, boolean, address, list, dict, etc.)',
                enum: ['string', 'integer', 'boolean', 'address', 'list', 'dict', 'float', 'bytes']
              },
              description: {
                type: 'string',
                description: "Optional description of the field's purpose"
              }
            },
            required: ['name', 'type']
          },
          default: []
        },
        template_type: {
          type: 'string',
          description: 'Use a predefined contract template for specific use cases',
          enum: [
            'basic',
            'dao_governance',
            'content_moderation',
            'sentiment_tracker',
            'multi_oracle'
          ],
          default: 'basic'
        }
      },
      required: ['contract_name', 'requirements']
    }
  },
  {
    name: 'add_equivalence_principle',
    description:
      'Add Equivalence Principle validation to a contract method for handling non-deterministic operations',
    inputSchema: {
      type: 'object',
      properties: {
        contract_code: {
          type: 'string',
          description: 'The existing contract code'
        },
        method_name: {
          type: 'string',
          description: 'Name of the method to add validation to'
        },
        validation_type: {
          type: 'string',
          enum: ['comparative', 'non_comparative'],
          description: 'Type of validation to apply'
        },
        tolerance: {
          type: 'number',
          description: 'Tolerance level for validation (optional)',
          default: 0.1
        }
      },
      required: ['contract_code', 'method_name', 'validation_type']
    }
  },
  {
    name: 'create_vector_store',
    description: 'Create a GenLayer Vector Store contract for semantic search capabilities',
    inputSchema: {
      type: 'object',
      properties: {
        store_name: {
          type: 'string',
          description: 'Name of the vector store contract'
        },
        description: {
          type: 'string',
          description: "Description of the vector store's purpose"
        },
        metadata_fields: {
          type: 'array',
          description: 'Metadata fields for stored vectors',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              type: { type: 'string' }
            },
            required: ['name', 'type']
          },
          default: []
        }
      },
      required: ['store_name', 'description']
    }
  },
  {
    name: 'add_web_data_access',
    description: 'Add web data access capabilities to an existing contract',
    inputSchema: {
      type: 'object',
      properties: {
        contract_code: {
          type: 'string',
          description: 'The existing contract code'
        },
        url_template: {
          type: 'string',
          description: 'URL template for web data access'
        },
        data_processing_logic: {
          type: 'string',
          description: 'Description of how to process the fetched data'
        }
      },
      required: ['contract_code', 'url_template', 'data_processing_logic']
    }
  },
  {
    name: 'create_prediction_market',
    description:
      'Create an advanced prediction market contract with AI-powered resolution using multiple web sources and sophisticated betting mechanisms',
    inputSchema: {
      type: 'object',
      properties: {
        market_name: {
          type: 'string',
          description: 'Name of the prediction market contract (PascalCase)',
          pattern: '^[A-Z][a-zA-Z0-9]*Market$'
        },
        description: {
          type: 'string',
          description:
            'Detailed description of what the market is predicting, including context and scope'
        },
        resolution_criteria: {
          type: 'string',
          description:
            "Specific, measurable criteria for resolving the market (e.g., 'Bitcoin price above $50,000 on January 1, 2025')"
        },
        web_sources: {
          type: 'array',
          description: 'Reliable web sources to check for market resolution (URLs)',
          items: {
            type: 'string',
            format: 'uri'
          },
          minItems: 1,
          default: ['https://api.coindesk.com/v1/bpi/currentprice.json']
        },
        resolution_deadline: {
          type: 'string',
          description: 'When the market should be resolved (descriptive)',
          default: 'No specific deadline'
        },
        category: {
          type: 'string',
          description: 'Market category for organization',
          enum: [
            'crypto',
            'sports',
            'politics',
            'technology',
            'finance',
            'weather',
            'entertainment',
            'other'
          ],
          default: 'other'
        }
      },
      required: ['market_name', 'description', 'resolution_criteria']
    }
  },
  {
    name: 'generate_contract_template',
    description:
      'Generate a contract from predefined templates for common use cases like DAO governance, content moderation, or sentiment tracking',
    inputSchema: {
      type: 'object',
      properties: {
        template_type: {
          type: 'string',
          description: 'Type of contract template to generate',
          enum: ['dao_governance', 'content_moderation', 'sentiment_tracker', 'multi_oracle']
        },
        contract_name: {
          type: 'string',
          description: 'Name for the generated contract',
          pattern: '^[A-Z][a-zA-Z0-9]*$'
        },
        custom_parameters: {
          type: 'object',
          description: 'Template-specific customization parameters',
          properties: {
            voting_threshold: {
              type: 'number',
              description: 'For DAO: percentage needed to pass proposals',
              minimum: 1,
              maximum: 100,
              default: 60
            },
            moderation_strictness: {
              type: 'string',
              description: 'For content moderation: how strict the moderation should be',
              enum: ['lenient', 'moderate', 'strict'],
              default: 'moderate'
            },
            sentiment_categories: {
              type: 'array',
              description: 'For sentiment tracker: categories to track',
              items: { type: 'string' },
              default: ['general', 'product', 'service']
            },
            data_sources: {
              type: 'array',
              description: 'For multi-oracle: default data source URLs',
              items: { type: 'string', format: 'uri' },
              default: []
            }
          },
          default: {}
        }
      },
      required: ['template_type', 'contract_name']
    }
  },
  {
    name: 'explain_genlayer_concepts',
    description:
      'Get detailed explanations of GenLayer concepts, features, and best practices for Intelligent Contract development',
    inputSchema: {
      type: 'object',
      properties: {
        concept: {
          type: 'string',
          description: 'GenLayer concept to explain',
          enum: [
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
          ]
        },
        include_examples: {
          type: 'boolean',
          description: 'Include code examples in the explanation',
          default: true
        },
        detail_level: {
          type: 'string',
          description: 'Level of detail for the explanation',
          enum: ['basic', 'intermediate', 'advanced'],
          default: 'intermediate'
        }
      },
      required: ['concept']
    }
  },
  {
    name: 'explain_genlayer_types',
    description:
      "Get comprehensive explanations and examples of GenLayer's type system including primitive types, collection types, storage restrictions, and best practices",
    inputSchema: {
      type: 'object',
      properties: {
        type_category: {
          type: 'string',
          description: 'Category of types to explain',
          enum: [
            'primitive_types',
            'collection_types',
            'custom_types',
            'calldata_types',
            'storage_restrictions',
            'type_conversions',
            'all_types'
          ]
        },
        include_examples: {
          type: 'boolean',
          description: 'Include code examples for each type',
          default: true
        },
        include_comparisons: {
          type: 'boolean',
          description: 'Include comparisons with standard Python types',
          default: true
        }
      },
      required: ['type_category']
    }
  },
  {
    name: 'explain_storage_patterns',
    description:
      'Explain GenLayer storage patterns, persistent data handling, TreeMap/DynArray usage, and storage optimization techniques',
    inputSchema: {
      type: 'object',
      properties: {
        storage_topic: {
          type: 'string',
          description: 'Storage topic to explain in detail',
          enum: [
            'storage_basics',
            'dynarray_usage',
            'treemap_usage',
            'custom_storage_types',
            'storage_optimization',
            'storage_patterns',
            'storage_best_practices'
          ]
        },
        include_examples: {
          type: 'boolean',
          description: 'Include practical code examples',
          default: true
        },
        complexity_level: {
          type: 'string',
          description: 'Complexity level of examples and explanations',
          enum: ['beginner', 'intermediate', 'advanced'],
          default: 'intermediate'
        }
      },
      required: ['storage_topic']
    }
  },
  {
    name: 'generate_deployment_script',
    description:
      'Generate deployment scripts for GenLayer contracts supporting different networks (localnet, studionet, testnet) with configuration options',
    inputSchema: {
      type: 'object',
      properties: {
        script_type: {
          type: 'string',
          description: 'Type of deployment script to generate',
          enum: ['typescript', 'python', 'cli_command', 'deploy_config']
        },
        network_target: {
          type: 'string',
          description: 'Target network for deployment',
          enum: ['localnet', 'studionet', 'testnet_asimov', 'all_networks'],
          default: 'localnet'
        },
        contract_path: {
          type: 'string',
          description: 'Path to the contract file',
          default: 'contracts/my_contract.py'
        },
        constructor_args: {
          type: 'array',
          description: 'Constructor arguments for contract deployment',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              type: { type: 'string' },
              value: { type: 'string' },
              description: { type: 'string' }
            },
            required: ['name', 'type', 'value']
          },
          default: []
        },
        deployment_options: {
          type: 'object',
          description: 'Additional deployment configuration',
          properties: {
            gas_limit: {
              type: 'number',
              description: 'Gas limit for deployment',
              default: 1000000
            },
            wait_for_confirmation: {
              type: 'boolean',
              description: 'Wait for transaction confirmation',
              default: true
            },
            verify_deployment: {
              type: 'boolean',
              description: 'Verify contract deployment',
              default: true
            }
          },
          default: {}
        }
      },
      required: ['script_type', 'contract_path']
    }
  },
  {
    name: 'generate_debugging_guide',
    description:
      'Generate debugging strategies and tools for GenLayer contracts including logging, error handling, and testing approaches',
    inputSchema: {
      type: 'object',
      properties: {
        debug_topic: {
          type: 'string',
          description: 'Debugging topic to focus on',
          enum: [
            'contract_debugging',
            'transaction_debugging',
            'consensus_debugging',
            'llm_debugging',
            'web_access_debugging',
            'studio_debugging',
            'cli_debugging',
            'testing_strategies'
          ]
        },
        include_code_examples: {
          type: 'boolean',
          description: 'Include debugging code examples',
          default: true
        },
        include_troubleshooting: {
          type: 'boolean',
          description: 'Include common issues and solutions',
          default: true
        }
      },
      required: ['debug_topic']
    }
  },
  {
    name: 'generate_genlayerjs_integration',
    description:
      'Generate GenLayerJS integration code for frontend applications including contract interaction, transaction handling, and event monitoring',
    inputSchema: {
      type: 'object',
      properties: {
        integration_type: {
          type: 'string',
          description: 'Type of GenLayerJS integration to generate',
          enum: [
            'basic_setup',
            'contract_interaction',
            'transaction_monitoring',
            'account_management',
            'event_subscription',
            'error_handling',
            'complete_example'
          ]
        },
        framework: {
          type: 'string',
          description: 'Frontend framework to target',
          enum: ['react', 'vue', 'angular', 'vanilla', 'nextjs'],
          default: 'react'
        },
        contract_methods: {
          type: 'array',
          description: 'Contract methods to interact with',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Method name' },
              type: {
                type: 'string',
                enum: ['view', 'write'],
                description: 'Method type (view for read-only, write for state-changing)'
              },
              parameters: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    type: { type: 'string' }
                  },
                  required: ['name', 'type']
                },
                default: []
              },
              returns: { type: 'string', description: 'Return type' }
            },
            required: ['name', 'type']
          },
          default: []
        },
        network_config: {
          type: 'object',
          description: 'Network configuration settings',
          properties: {
            rpc_url: { type: 'string', default: 'http://localhost:4000' },
            chain_id: { type: 'number', default: 1337 },
            network_name: { type: 'string', default: 'localnet' }
          },
          default: {}
        }
      },
      required: ['integration_type']
    }
  },
  {
    name: 'generate_contract_interaction_examples',
    description:
      'Generate examples for reading from and writing to GenLayer contracts using various methods (CLI, GenLayerJS, Python SDK)',
    inputSchema: {
      type: 'object',
      properties: {
        interaction_method: {
          type: 'string',
          description: 'Method for interacting with contracts',
          enum: [
            'genlayerjs_read',
            'genlayerjs_write',
            'python_sdk_read',
            'python_sdk_write',
            'cli_interaction',
            'all_methods'
          ]
        },
        contract_type: {
          type: 'string',
          description: 'Type of contract to interact with',
          enum: [
            'simple_storage',
            'prediction_market',
            'dao_governance',
            'vector_store',
            'llm_contract',
            'custom_contract'
          ],
          default: 'simple_storage'
        },
        example_operations: {
          type: 'array',
          description: 'Specific operations to demonstrate',
          items: {
            type: 'string',
            enum: [
              'read_state',
              'write_state',
              'call_llm_method',
              'handle_events',
              'batch_operations',
              'error_handling',
              'gas_optimization'
            ]
          },
          default: ['read_state', 'write_state']
        },
        include_error_handling: {
          type: 'boolean',
          description: 'Include comprehensive error handling examples',
          default: true
        }
      },
      required: ['interaction_method']
    }
  },
  {
    name: 'generate_testing_framework',
    description:
      'Generate comprehensive testing setups for GenLayer contracts including unit tests, integration tests, and end-to-end testing strategies',
    inputSchema: {
      type: 'object',
      properties: {
        test_framework: {
          type: 'string',
          description: 'Testing framework to use',
          enum: ['pytest', 'jest', 'hardhat_style', 'custom'],
          default: 'pytest'
        },
        test_types: {
          type: 'array',
          description: 'Types of tests to generate',
          items: {
            type: 'string',
            enum: [
              'unit_tests',
              'integration_tests',
              'consensus_tests',
              'llm_behavior_tests',
              'web_access_tests',
              'performance_tests',
              'security_tests'
            ]
          },
          default: ['unit_tests', 'integration_tests']
        },
        contract_features: {
          type: 'array',
          description: 'Contract features to test',
          items: {
            type: 'string',
            enum: [
              'basic_operations',
              'llm_integration',
              'web_data_access',
              'consensus_mechanisms',
              'storage_operations',
              'event_emission',
              'access_control'
            ]
          },
          default: ['basic_operations']
        },
        mock_external_services: {
          type: 'boolean',
          description: 'Include mocking for external services (LLMs, web APIs)',
          default: true
        }
      },
      required: ['test_framework']
    }
  },
  {
    name: 'generate_project_boilerplate',
    description:
      'Generate a complete GenLayer project structure with contracts, tests, deployment scripts, and frontend integration',
    inputSchema: {
      type: 'object',
      properties: {
        project_name: {
          type: 'string',
          description: 'Name of the project',
          pattern: '^[a-z][a-z0-9-]*$'
        },
        project_type: {
          type: 'string',
          description: 'Type of project to generate',
          enum: [
            'basic_contract',
            'dao_project',
            'prediction_market',
            'ai_oracle',
            'defi_protocol',
            'social_platform',
            'full_dapp'
          ],
          default: 'basic_contract'
        },
        include_frontend: {
          type: 'boolean',
          description: 'Include frontend application with GenLayerJS',
          default: false
        },
        frontend_framework: {
          type: 'string',
          description: 'Frontend framework (if frontend included)',
          enum: ['react', 'vue', 'nextjs', 'vanilla'],
          default: 'react'
        },
        include_tests: {
          type: 'boolean',
          description: 'Include comprehensive test suite',
          default: true
        },
        include_deployment: {
          type: 'boolean',
          description: 'Include deployment scripts and configuration',
          default: true
        },
        package_manager: {
          type: 'string',
          description: 'Package manager to use',
          enum: ['npm', 'yarn', 'pnpm'],
          default: 'npm'
        }
      },
      required: ['project_name']
    }
  },
  {
    name: 'fetch_latest_api_docs',
    description:
      'Fetch the latest GenLayer API documentation from the official source. Use this to get up-to-date information about GenLayer types, decorators, web access methods, LLM integration, consensus mechanisms, and more.',
    inputSchema: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description: 'Specific topic to fetch documentation for. Use "all" for complete documentation.',
          enum: [
            'types',
            'decorators',
            'web_access',
            'llm',
            'consensus',
            'storage',
            'events',
            'contract_structure',
            'message_access',
            'evm_integration',
            'all'
          ],
          default: 'all'
        }
      },
      required: []
    }
  }
];
