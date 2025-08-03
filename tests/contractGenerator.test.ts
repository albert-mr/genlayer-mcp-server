import { GenLayerContractGenerator } from '../src/utils/contractGenerator';

describe('GenLayerContractGenerator', () => {
  describe('generateBaseContract', () => {
    it('should generate a basic contract without fields', () => {
      const contractCode = GenLayerContractGenerator.generateBaseContract('TestContract', []);

      expect(contractCode).toContain('class TestContract(gl.Contract):');
      expect(contractCode).toContain('from genlayer import *');
      expect(contractCode).toContain('@gl.public.view');
      expect(contractCode).toContain('def get_info(self) -> str:');
      expect(contractCode).toContain('import typing');
      expect(contractCode).toContain('import json');
      expect(contractCode).toContain('import re');
    });

    it('should generate contract with storage fields', () => {
      const fields = [
        { name: 'title', type: 'string', description: 'Contract title' },
        { name: 'count', type: 'integer', description: 'Item count' },
        { name: 'active', type: 'boolean', description: 'Is active' }
      ];

      const contractCode = GenLayerContractGenerator.generateBaseContract('StorageContract', fields);

      expect(contractCode).toContain('title: str # Contract title');
      expect(contractCode).toContain('count: u256 # Item count');
      expect(contractCode).toContain('active: bool # Is active');
      expect(contractCode).toContain('def __init__(self, title: str = "", count: u256 = u256(0), active: bool = False):');
      expect(contractCode).toContain('self.title = title');
      expect(contractCode).toContain('self.count = count');
      expect(contractCode).toContain('self.active = active');
      expect(contractCode).toContain('def get_title(self) -> str:');
      expect(contractCode).toContain('def get_count(self) -> u256:');
      expect(contractCode).toContain('def get_active(self) -> bool:');
    });

    it('should map types correctly', () => {
      const fields = [
        { name: 'text', type: 'string' },
        { name: 'number', type: 'integer' },
        { name: 'flag', type: 'boolean' },
        { name: 'wallet', type: 'address' },
        { name: 'items', type: 'list' },
        { name: 'mapping', type: 'dict' }
      ];

      const contractCode = GenLayerContractGenerator.generateBaseContract('TypeMappingContract', fields);

      expect(contractCode).toContain('text: str');
      expect(contractCode).toContain('number: u256');
      expect(contractCode).toContain('flag: bool');
      expect(contractCode).toContain('wallet: Address');
      expect(contractCode).toContain('items: DynArray[str]');
      expect(contractCode).toContain('mapping: TreeMap[str, str]');
    });
  });

  describe('addLLMInteractions', () => {
    it('should add comprehensive LLM methods to contract', () => {
      const baseContract = `class TestContract(gl.Contract):
    def __init__(self):
        pass`;

      const requirements = 'Process user queries with AI analysis';
      const enhancedContract = GenLayerContractGenerator.addLLMInteractions(baseContract, requirements);

      expect(enhancedContract).toContain('def process_with_llm(self, input_text: str, prompt_type: str = "general") -> str:');
      expect(enhancedContract).toContain('def analyze_sentiment(self, text: str) -> str:');
      expect(enhancedContract).toContain('def generate_response(self, user_input: str, context: str = "") -> str:');
      expect(enhancedContract).toContain('gl.nondet.exec_prompt');
      expect(enhancedContract).toContain('gl.eq_principle_strict_eq');
      expect(enhancedContract).toContain('gl.eq_principle_prompt_non_comparative');
      expect(enhancedContract).toContain(requirements);
    });

    it('should include JSON response handling', () => {
      const baseContract = `class TestContract(gl.Contract):
    def __init__(self):
        pass`;

      const enhancedContract = GenLayerContractGenerator.addLLMInteractions(baseContract, 'Test requirements');

      expect(enhancedContract).toContain('json.loads');
      expect(enhancedContract).toContain('json.dumps');
      expect(enhancedContract).toContain('cleaned_result = result.replace("```json", "").replace("```", "").strip()');
    });
  });

  describe('addWebDataAccess', () => {
    it('should add comprehensive web data methods', () => {
      const baseContract = `class TestContract(gl.Contract):
    def __init__(self):
        pass`;

      const urlTemplate = 'https://api.example.com/data';
      const processingLogic = 'Extract price information from API response';
      const enhancedContract = GenLayerContractGenerator.addWebDataAccess(baseContract, urlTemplate, processingLogic);

      expect(enhancedContract).toContain('def fetch_web_data(self, url: str = "https://api.example.com/data", mode: str = "text") -> dict:');
      expect(enhancedContract).toContain('def fetch_multiple_sources(self, urls: DynArray[str]');
      expect(enhancedContract).toContain('def fetch_with_comparative_consensus(self, url: str');
      expect(enhancedContract).toContain('gl.nondet.web.render(url, mode=mode)');
      expect(enhancedContract).toContain('gl.eq_principle_strict_eq(web_fetch_task)');
      expect(enhancedContract).toContain('gl.eq_principle_prompt_comparative(');
      expect(enhancedContract).toContain(urlTemplate);
      expect(enhancedContract).toContain(processingLogic);
    });

    it('should handle different data types', () => {
      const baseContract = `class TestContract(gl.Contract):
    def __init__(self):
        pass`;

      const enhancedContract = GenLayerContractGenerator.addWebDataAccess(baseContract, 'https://api.test.com', 'Test processing');

      expect(enhancedContract).toContain('gl.nondet.web.render(url, mode=mode)');
      expect(enhancedContract).toContain('gl.nondet.exec_prompt(f\'\'\'');
      expect(enhancedContract).toContain('json.loads(result_str)');
      expect(enhancedContract).toContain('Return valid JSON format');
    });
  });

  describe('createPredictionMarket', () => {
    it('should generate comprehensive prediction market', () => {
      const marketName = 'BitcoinPriceMarket';
      const description = 'Predict Bitcoin price movement';
      const resolutionCriteria = 'Bitcoin price above $50,000';
      const webSources = ['https://api.coindesk.com/v1/bpi/currentprice.json'];

      const marketContract = GenLayerContractGenerator.createPredictionMarket(
        marketName,
        description,
        resolutionCriteria,
        webSources
      );

      expect(marketContract).toContain(`class ${marketName}(gl.Contract):`);
      expect(marketContract).toContain('self.description = description');
      expect(marketContract).toContain(resolutionCriteria);
      expect(marketContract).toContain(webSources[0]);
      expect(marketContract).toContain('def place_bet(self, prediction: bool) -> str:');
      expect(marketContract).toContain('def resolve_market(self) -> str:');
      expect(marketContract).toContain('def claim_winnings(self) -> u256:');
      expect(marketContract).toContain('def get_market_info(self) -> dict:');
      expect(marketContract).toContain('bettors: TreeMap[Address, dict]');
      expect(marketContract).toContain('total_yes_bets: u256');
    });

    it('should include AI-powered resolution logic', () => {
      const marketContract = GenLayerContractGenerator.createPredictionMarket(
        'TestMarket',
        'Test description',
        'Test criteria',
        ['https://test.com']
      );

      expect(marketContract).toContain('resolve_market');
      expect(marketContract).toContain('Test criteria');
      expect(marketContract).toContain('https://test.com');
      expect(marketContract).toContain('claim_winnings');
      expect(marketContract).toContain('get_market_info');
    });

    it('should include betting mechanisms', () => {
      const marketContract = GenLayerContractGenerator.createPredictionMarket(
        'TestMarket',
        'Test description',
        'Test criteria',
        []
      );

      expect(marketContract).toContain('@gl.public.write.payable');
      expect(marketContract).toContain('gl.message.value');
      expect(marketContract).toContain('gl.message.sender_address');
      expect(marketContract).toContain('self.total_yes_bets');
      expect(marketContract).toContain('self.total_no_bets');
      expect(marketContract).toContain('payout');
    });
  });

  describe('createVectorStore', () => {
    it('should generate vector store with metadata fields', () => {
      const storeName = 'DocumentStore';
      const description = 'Store documents with semantic search';
      const metadataFields = [
        { name: 'category', type: 'string' },
        { name: 'priority', type: 'integer' }
      ];

      const vectorStoreContract = GenLayerContractGenerator.createVectorStore(
        storeName,
        description,
        metadataFields
      );

      expect(vectorStoreContract).toContain(`class ${storeName}(gl.Contract):`);
      expect(vectorStoreContract).toContain('VectorStore');
      expect(vectorStoreContract).toContain('add_text');
      expect(vectorStoreContract).toContain('search_similar');
      expect(vectorStoreContract).toContain('get_store_info');
      expect(vectorStoreContract).toContain(description);
    });

    it('should include vector operations', () => {
      const vectorStoreContract = GenLayerContractGenerator.createVectorStore(
        'TestStore',
        'Test store',
        []
      );

      expect(vectorStoreContract).toContain('def add_text(self, text: str, metadata: dict = None) -> str:');
      expect(vectorStoreContract).toContain('def search_similar(self, query: str, top_k: int = 5) -> list:');
      expect(vectorStoreContract).toContain('def get_store_info(self) -> dict:');
      expect(vectorStoreContract).toContain('VectorStore');
      expect(vectorStoreContract).toContain('self.vector_store');
    });

    it('should include LLM-powered filtering', () => {
      const vectorStoreContract = GenLayerContractGenerator.createVectorStore(
        'TestStore',
        'Test store',
        []
      );

      expect(vectorStoreContract).toContain('VectorStore');
      expect(vectorStoreContract).toContain('add_text');
      expect(vectorStoreContract).toContain('search');
    });
  });

  describe('generateAdvancedContractTemplate', () => {
    it('should generate DAO governance template', () => {
      const template = GenLayerContractGenerator.generateAdvancedContractTemplate(
        'dao_governance',
        'TestDAO',
        {}
      );

      expect(template).toContain('class TestDAO(gl.Contract):');
      expect(template).toContain('Intelligent DAO Governance Contract');
      expect(template).toContain('def create_proposal(self, title: str, description: str) -> typing.Any:');
      expect(template).toContain('gl.nondet.exec_prompt(task)');
      expect(template).toContain('gl.eq_principle_strict_eq(analyze_proposal)');
    });

    it('should generate content moderation template', () => {
      const template = GenLayerContractGenerator.generateAdvancedContractTemplate(
        'content_moderation',
        'ContentFilter',
        {}
      );

      expect(template).toContain('class ContentFilter(gl.Contract):');
      expect(template).toContain('AI-powered content moderation');
      expect(template).toContain('def moderate_content(self, content: str) -> typing.Any:');
      expect(template).toContain('gl.eq_principle_prompt_non_comparative');
    });

    it('should generate sentiment tracker template', () => {
      const template = GenLayerContractGenerator.generateAdvancedContractTemplate(
        'sentiment_tracker',
        'SentimentTracker',
        {}
      );

      expect(template).toContain('class SentimentTracker(gl.Contract):');
      expect(template).toContain('sentiment tracking');
      expect(template).toContain('def analyze_sentiment(self, text: str, topic: str = "general") -> typing.Any:');
      expect(template).toContain('gl.eq_principle_strict_eq');
    });

    it('should generate multi-oracle template', () => {
      const template = GenLayerContractGenerator.generateAdvancedContractTemplate(
        'multi_oracle',
        'MultiOracle',
        {}
      );

      expect(template).toContain('class MultiOracle(gl.Contract):');
      expect(template).toContain('Multi-source oracle');
      expect(template).toContain('def fetch_consensus_data(self, data_type: str, query: str) -> typing.Any:');
    });

    it('should fallback to basic contract for unknown template', () => {
      const template = GenLayerContractGenerator.generateAdvancedContractTemplate(
        'unknown_template',
        'TestContract',
        {}
      );

      expect(template).toContain('class TestContract(gl.Contract):');
      expect(template).toContain('@gl.public.view');
      expect(template).toContain('def get_info(self) -> str:');
    });
  });

  describe('Type mapping', () => {
    it('should map common types to GenLayer types', () => {
      // Access private method for testing
      const mapType = (GenLayerContractGenerator as any).mapGenLayerType;

      expect(mapType('string')).toBe('str');
      expect(mapType('text')).toBe('str');
      expect(mapType('integer')).toBe('u256');
      expect(mapType('int')).toBe('u256');
      expect(mapType('number')).toBe('u256');
      expect(mapType('float')).toBe('f64');
      expect(mapType('decimal')).toBe('f64');
      expect(mapType('boolean')).toBe('bool');
      expect(mapType('bool')).toBe('bool');
      expect(mapType('address')).toBe('Address');
      expect(mapType('list')).toBe('DynArray[str]');
      expect(mapType('array')).toBe('DynArray[str]');
      expect(mapType('dict')).toBe('TreeMap[str, str]');
      expect(mapType('dictionary')).toBe('TreeMap[str, str]');
      expect(mapType('map')).toBe('TreeMap[str, str]');
      expect(mapType('bytes')).toBe('bytes');
      expect(mapType('timestamp')).toBe('u256');
    });

    it('should return original type for unknown types', () => {
      const mapType = (GenLayerContractGenerator as any).mapGenLayerType;
      expect(mapType('CustomType')).toBe('CustomType');
      expect(mapType('UnknownType')).toBe('UnknownType');
    });
  });

  describe('Default values', () => {
    it('should provide correct default values', () => {
      const getDefault = (GenLayerContractGenerator as any).getDefaultValue;

      expect(getDefault('str')).toBe('""');
      expect(getDefault('u256')).toBe('u256(0)');
      expect(getDefault('f64')).toBe('0.0');
      expect(getDefault('bool')).toBe('False');
      expect(getDefault('Address')).toBe("Address('0x0000000000000000000000000000000000000000')");
      expect(getDefault('bytes')).toBe("b''");
      expect(getDefault('DynArray[str]')).toBe('DynArray[str]()');
      expect(getDefault('TreeMap[str, str]')).toBe('TreeMap[str, str]()');
      expect(getDefault('CustomType')).toBe('CustomType()');
    });
  });
});