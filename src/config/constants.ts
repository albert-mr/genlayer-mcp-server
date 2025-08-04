// Centralized configuration constants for GenLayer MCP Server

export const GENLAYER_NETWORKS = {
  localnet: {
    name: 'Local Development',
    rpcUrl: 'http://localhost:4000',
    chainId: 1337,
    description: 'Local GenLayer development node'
  },
  studionet: {
    name: 'GenLayer Studio',
    rpcUrl: 'https://studio.genlayer.com/api',
    chainId: 1337,
    description: 'GenLayer Studio environment for testing'
  },
  testnet_asimov: {
    name: 'Asimov Testnet',
    rpcUrl: 'https://testnet.genlayer.com/api',
    chainId: 42,
    description: 'GenLayer Asimov testnet for public testing'
  }
} as const;

export const GENLAYER_URLS = {
  studio: 'https://studio.genlayer.com/',
  docs: 'https://docs.genlayer.com/',
  github: 'https://github.com/genlayer-protocol',
  discord: 'https://discord.gg/genlayer'
} as const;

export const DEFAULT_VALUES = {
  // Network defaults
  rpcUrl: GENLAYER_NETWORKS.localnet.rpcUrl,
  chainId: GENLAYER_NETWORKS.localnet.chainId,
  networkName: 'localnet',

  // Gas and transaction defaults
  gasLimit: 1000000,
  confirmationTimeout: 60000, // 60 seconds

  // Contract generation defaults
  templateType: 'basic',
  includeExamples: true,
  detailLevel: 'intermediate',

  // Validation defaults
  minRequirementsLength: 10,
  minDescriptionLength: 10,
  minCriteriaLength: 20,

  // Performance defaults
  cacheTimeout: 300000, // 5 minutes
  maxConcurrentRequests: 10,
  requestTimeout: 30000 // 30 seconds
} as const;

export const GENLAYER_TYPES = {
  // Primitive types mapping
  primitives: {
    string: 'str',
    integer: 'u256',
    boolean: 'bool',
    address: 'Address',
    float: 'float',
    bytes: 'bytes'
  },

  // Collection types
  collections: {
    list: 'DynArray',
    dict: 'TreeMap'
  },

  // Special GenLayer types
  special: {
    vector_store: 'VecDB',
    embedding: 'np.float32',
    model: 'SentenceTransformer'
  }
} as const;

export const EXAMPLE_APIS = {
  // API endpoints used in examples and templates
  financial: {
    coindesk: 'https://api.coindesk.com/v1/bpi/currentprice.json',
    coingecko: 'https://api.coingecko.com/api/v3/simple/price',
    alphavantage: 'https://www.alphavantage.co/query'
  },

  weather: {
    openweather: 'https://api.openweathermap.org/data/2.5/weather'
  },

  news: {
    newsapi: 'https://newsapi.org/v2/everything',
    reddit: 'https://api.reddit.com/r/news/search'
  },

  social: {
    twitter: 'https://api.twitter.com/2/tweets/search/recent'
  },

  // Generic placeholder for examples
  generic: 'https://api.example.com/data'
} as const;

export const VALIDATION_PATTERNS = {
  // Regex patterns for validation
  pascalCase: /^[A-Z][a-zA-Z0-9]*$/,
  camelCase: /^[a-z][a-zA-Z0-9]*$/,
  kebabCase: /^[a-z][a-z0-9-]*$/,
  marketName: /^[A-Z][a-zA-Z0-9]*Market$/,
  methodName: /^[a-z][a-zA-Z0-9_]*$/,

  // URL validation
  httpUrl: /^https?:\/\/.+/,
  validUrl:
    /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
} as const;

export const ERROR_MESSAGES = {
  // Common error message templates
  validation: {
    pascalCase: 'Name must be in PascalCase (e.g., MyContract, UserManager)',
    required: 'This field is required',
    minLength: (field: string, min: number) => `${field} must be at least ${min} characters long`,
    invalidUrl: 'Must be a valid HTTP or HTTPS URL',
    invalidEnum: (field: string, options: string[]) =>
      `${field} must be one of: ${options.join(', ')}`
  },

  contract: {
    nameFormat: 'Contract name must be in PascalCase and start with a capital letter',
    marketNameFormat:
      'Market name must be in PascalCase and end with "Market" (e.g., BitcoinPriceMarket)',
    requirementsTooShort:
      'Requirements must be at least 10 characters and describe what the contract should do',
    criteriaTooShort: 'Resolution criteria must be specific and detailed (at least 20 characters)'
  },

  network: {
    connectionFailed:
      'Unable to connect to GenLayer network. Check your RPC URL and network settings.',
    invalidChainId: 'Invalid chain ID. Must match the target network.',
    gasEstimationFailed: 'Gas estimation failed. Check contract parameters and network status.'
  }
} as const;

export const FEATURE_FLAGS = {
  // Feature toggles for experimental functionality
  enableCaching: true,
  enableMetrics: false,
  enableAdvancedValidation: true,
  enableSecurityScanning: false,
  enablePerformanceOptimization: true
} as const;

export const LIMITS = {
  // Resource limits and constraints
  maxContractSize: 50000, // characters
  maxStorageFields: 50,
  maxConstructorArgs: 20,
  maxWebSources: 10,
  maxMetadataFields: 20,
  maxExampleOperations: 10,
  maxTestTypes: 10,
  maxContractMethods: 50
} as const;

// Environment-specific overrides
export function getEnvironmentConfig() {
  const env = process.env.NODE_ENV || 'development';

  const configs = {
    development: {
      logLevel: 'debug',
      enableCaching: false,
      requestTimeout: 60000
    },
    production: {
      logLevel: 'info',
      enableCaching: true,
      requestTimeout: 30000
    },
    test: {
      logLevel: 'warn',
      enableCaching: false,
      requestTimeout: 10000
    }
  };

  return configs[env as keyof typeof configs] || configs.development;
}
