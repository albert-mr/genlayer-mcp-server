// Configuration for GenLayer MCP Tools

export const TOOLS_CONFIG = {
  SERVER_NAME: "genlayer-mcp-server",
  SERVER_VERSION: "1.0.0",
  DESCRIPTION: "An MCP server for generating GenLayer Intelligent Contracts with AI-native blockchain capabilities",
  
  // Default values for contract generation
  DEFAULTS: {
    URL_TEMPLATE: "https://api.example.com/data",
    TOLERANCE: 0.1,
    WEB_PROCESSING_LOGIC: "Fetch and process according to contract requirements"
  },
  
  // GenLayer specific constants
  GENLAYER: {
    DEPENDENCY: "py-genlayer:test",
    MODEL_WRAPPERS_DEPENDENCY: "py-lib-genlayermodelwrappers:test",
    VECTOR_STORE_IMPORT: "backend.node.genvm.std.vector_store",
    
    // Common GenLayer types
    TYPES: {
      STRING: "str",
      INTEGER: "u256", 
      BOOLEAN: "bool",
      ADDRESS: "Address",
      LIST: "DynArray",
      DICT: "TreeMap"
    }
  }
};