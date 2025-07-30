import { GenLayerTools } from '../src/tools/genLayerTools';
import { GenLayerContractGenerator } from '../src/utils/contractGenerator';

describe('GenLayerTools', () => {
  describe('generateIntelligentContract', () => {
    it('should generate a basic contract successfully', async () => {
      const params = {
        contract_name: 'TestContract',
        requirements: 'A simple storage contract for testing purposes',
        use_llm: false,
        web_access: false,
        storage_fields: [
          { name: 'data', type: 'string', description: 'Test data' },
          { name: 'counter', type: 'integer', description: 'Test counter' }
        ]
      };

      const result = await GenLayerTools.generateIntelligentContract(params);

      expect(result.isError).toBeFalsy();
      expect(result.content).toContain('TestContract');
      expect(result.content).toContain('data: str');
      expect(result.content).toContain('counter: u256');
      expect(result.content).toContain('@gl.public.view');
      expect(result.content).toContain('from genlayer import *');
    });

    it('should generate contract with LLM capabilities', async () => {
      const params = {
        contract_name: 'AIContract',
        requirements: 'Contract that processes text with AI',
        use_llm: true,
        web_access: false
      };

      const result = await GenLayerTools.generateIntelligentContract(params);

      expect(result.isError).toBeFalsy();
      expect(result.content).toContain('process_with_llm');
      expect(result.content).toContain('gl.exec_prompt');
      expect(result.content).toContain('gl.eq_principle_strict_eq');
      expect(result.content).toContain('analyze_sentiment');
    });

    it('should generate contract with web access', async () => {
      const params = {
        contract_name: 'WebContract',
        requirements: 'Contract that fetches web data',
        use_llm: false,
        web_access: true
      };

      const result = await GenLayerTools.generateIntelligentContract(params);

      expect(result.isError).toBeFalsy();
      expect(result.content).toContain('fetch_web_data');
      expect(result.content).toContain('gl.get_webpage');
      expect(result.content).toContain('fetch_structured_data');
    });

    it('should validate contract name format', async () => {
      const params = {
        contract_name: 'invalid_name',
        requirements: 'This should fail due to naming convention'
      };

      const result = await GenLayerTools.generateIntelligentContract(params);

      expect(result.isError).toBeTruthy();
      expect(result.content).toContain('PascalCase');
    });

    it('should validate requirements length', async () => {
      const params = {
        contract_name: 'ValidName',
        requirements: 'Too short'
      };

      const result = await GenLayerTools.generateIntelligentContract(params);

      expect(result.isError).toBeTruthy();
      expect(result.content).toContain('at least 10 characters');
    });

    it('should generate template-based contracts', async () => {
      const params = {
        contract_name: 'DAOContract',
        requirements: 'DAO governance contract',
        template_type: 'dao_governance'
      };

      const result = await GenLayerTools.generateIntelligentContract(params);

      expect(result.isError).toBeFalsy();
      expect(result.content).toContain('DAO Governance');
      expect(result.content).toContain('create_proposal');
    });
  });

  describe('createPredictionMarket', () => {
    it('should generate prediction market successfully', async () => {
      const params = {
        market_name: 'BitcoinPriceMarket',
        description: 'Predict if Bitcoin will reach $100,000',
        resolution_criteria: 'Bitcoin price must be above $100,000 on January 1, 2025',
        web_sources: ['https://api.coindesk.com/v1/bpi/currentprice.json'],
        category: 'crypto'
      };

      const result = await GenLayerTools.createPredictionMarket(params);

      expect(result.isError).toBeFalsy();
      expect(result.content).toContain('BitcoinPriceMarket');
      expect(result.content).toContain('place_bet');
      expect(result.content).toContain('resolve_market');
      expect(result.content).toContain('claim_winnings');
      expect(result.content).toContain('gl.get_webpage');
    });

    it('should validate market name format', async () => {
      const params = {
        market_name: 'invalid_market',
        description: 'Test market',
        resolution_criteria: 'Some criteria for resolution testing',
        web_sources: ['https://api.example.com']
      };

      const result = await GenLayerTools.createPredictionMarket(params);

      expect(result.isError).toBeTruthy();
      expect(result.content).toContain('PascalCase');
      expect(result.content).toContain('Market');
    });

    it('should validate resolution criteria length', async () => {
      const params = {
        market_name: 'TestMarket',
        description: 'Test market',
        resolution_criteria: 'Short',
        web_sources: ['https://api.example.com']
      };

      const result = await GenLayerTools.createPredictionMarket(params);

      expect(result.isError).toBeTruthy();
      expect(result.content).toContain('at least 20 characters');
    });

    it('should provide default web sources if none provided', async () => {
      const params = {
        market_name: 'DefaultSourceMarket',
        description: 'Market with default sources',
        resolution_criteria: 'Will resolve based on default data sources',
        web_sources: ['https://api.coindesk.com/v1/bpi/currentprice.json']
      };

      const result = await GenLayerTools.createPredictionMarket(params);

      expect(result.isError).toBeFalsy();
      expect(result.content).toContain('coindesk.com');
    });
  });

  describe('generateContractTemplate', () => {
    it('should generate DAO governance template', async () => {
      const params = {
        template_type: 'dao_governance',
        contract_name: 'MyDAO',
        custom_parameters: { voting_threshold: 75 }
      };

      const result = await GenLayerTools.generateContractTemplate(params);

      expect(result.isError).toBeFalsy();
      expect(result.content).toContain('MyDAO');
      expect(result.content).toContain('DAO Governance');
      expect(result.content).toContain('create_proposal');
      expect(result.content).toContain('AI-powered proposal analysis');
    });

    it('should generate content moderation template', async () => {
      const params = {
        template_type: 'content_moderation',
        contract_name: 'ContentModerator'
      };

      const result = await GenLayerTools.generateContractTemplate(params);

      expect(result.isError).toBeFalsy();
      expect(result.content).toContain('ContentModerator');
      expect(result.content).toContain('moderate_content');
      expect(result.content).toContain('AI-powered content moderation');
    });

    it('should generate sentiment tracker template', async () => {
      const params = {
        template_type: 'sentiment_tracker',
        contract_name: 'SentimentAnalyzer'
      };

      const result = await GenLayerTools.generateContractTemplate(params);

      expect(result.isError).toBeFalsy();
      expect(result.content).toContain('SentimentAnalyzer');
      expect(result.content).toContain('analyze_sentiment');
      expect(result.content).toContain('sentiment tracking');
    });

    it('should generate multi-oracle template', async () => {
      const params = {
        template_type: 'multi_oracle',
        contract_name: 'DataOracle'
      };

      const result = await GenLayerTools.generateContractTemplate(params);

      expect(result.isError).toBeFalsy();
      expect(result.content).toContain('DataOracle');
      expect(result.content).toContain('fetch_consensus_data');
      expect(result.content).toContain('Multi-source oracle');
    });

    it('should validate contract name format', async () => {
      const params = {
        template_type: 'dao_governance',
        contract_name: 'invalid_name'
      };

      const result = await GenLayerTools.generateContractTemplate(params);

      expect(result.isError).toBeTruthy();
      expect(result.content).toContain('PascalCase');
    });
  });

  describe('explainGenLayerConcepts', () => {
    it('should explain equivalence principle concept', async () => {
      const params = {
        concept: 'equivalence_principle',
        include_examples: true,
        detail_level: 'intermediate'
      };

      const result = await GenLayerTools.explainGenLayerConcepts(params);

      expect(result.isError).toBeFalsy();
      expect(result.content).toContain('Equivalence Principle');
      expect(result.content).toContain('validators');
      expect(result.content).toContain('consensus');
      expect(result.content).toContain('Code Examples');
      expect(result.content).toContain('gl.eq_principle');
    });

    it('should explain LLM integration', async () => {
      const params = {
        concept: 'llm_integration',
        include_examples: true,
        detail_level: 'basic'
      };

      const result = await GenLayerTools.explainGenLayerConcepts(params);

      expect(result.isError).toBeFalsy();
      expect(result.content).toContain('LLM Integration');
      expect(result.content).toContain('gl.exec_prompt');
      expect(result.content).toContain('Large Language Models');
    });

    it('should explain web data access', async () => {
      const params = {
        concept: 'web_data_access',
        include_examples: false,
        detail_level: 'advanced'
      };

      const result = await GenLayerTools.explainGenLayerConcepts(params);

      expect(result.isError).toBeFalsy();
      expect(result.content).toContain('Web Data Access');
      expect(result.content).toContain('gl.get_webpage');
      expect(result.content).not.toContain('Code Examples');
    });

    it('should handle invalid concept', async () => {
      const params = {
        concept: 'invalid_concept'
      };

      const result = await GenLayerTools.explainGenLayerConcepts(params);

      expect(result.isError).toBeTruthy();
      expect(result.content).toContain('Unknown concept');
    });

    it('should provide related concepts', async () => {
      const params = {
        concept: 'intelligent_contracts',
        detail_level: 'intermediate'
      };

      const result = await GenLayerTools.explainGenLayerConcepts(params);

      expect(result.isError).toBeFalsy();
      expect(result.content).toContain('Related Concepts');
      expect(result.content).toContain('Learn More');
      expect(result.content).toContain('docs.genlayer.com');
    });
  });

  describe('addEquivalencePrinciple', () => {
    it('should add equivalence principle to existing contract', async () => {
      const contractCode = `
class TestContract(gl.Contract):
    def test_method(self, data: str) -> str:
        return data
`;

      const params = {
        contract_code: contractCode,
        method_name: 'test_method',
        validation_type: 'comparative' as const,
        tolerance: 5
      };

      const result = await GenLayerTools.addEquivalencePrinciple(params);

      expect(result.isError).toBeFalsy();
      expect(result.content).toContain('test_method_with_equivalence');
      expect(result.content).toContain('comparative');
      expect(result.content).toContain('tolerance');
    });

    it('should add non-comparative equivalence principle', async () => {
      const contractCode = `
class TestContract(gl.Contract):
    def analyze_method(self, text: str) -> str:
        return text
`;

      const params = {
        contract_code: contractCode,
        method_name: 'analyze_method',
        validation_type: 'non_comparative' as const
      };

      const result = await GenLayerTools.addEquivalencePrinciple(params);

      expect(result.isError).toBeFalsy();
      expect(result.content).toContain('analyze_method_with_equivalence');
      expect(result.content).toContain('non_comparative');
      expect(result.content).toContain('gl.eq_principle_prompt_non_comparative');
    });
  });

  describe('createVectorStore', () => {
    it('should generate vector store contract', async () => {
      const params = {
        store_name: 'DocumentStore',
        description: 'Store and search documents semantically',
        metadata_fields: [
          { name: 'category', type: 'string' },
          { name: 'priority', type: 'integer' }
        ]
      };

      const result = await GenLayerTools.createVectorStore(params);

      expect(result.isError).toBeFalsy();
      expect(result.content).toContain('DocumentStore');
      expect(result.content).toContain('VecDB');
      expect(result.content).toContain('SentenceTransformer');
      expect(result.content).toContain('add_entry');
      expect(result.content).toContain('search_similar');
      expect(result.content).toContain('category: str');
      expect(result.content).toContain('priority: u256');
    });

    it('should generate vector store without metadata fields', async () => {
      const params = {
        store_name: 'SimpleStore',
        description: 'Simple vector store'
      };

      const result = await GenLayerTools.createVectorStore(params);

      expect(result.isError).toBeFalsy();
      expect(result.content).toContain('SimpleStore');
      expect(result.content).toContain('semantic search');
    });
  });

  describe('addWebDataAccess', () => {
    it('should add web data access to existing contract', async () => {
      const contractCode = `
class TestContract(gl.Contract):
    data: str
    
    def __init__(self):
        self.data = ""
`;

      const params = {
        contract_code: contractCode,
        url_template: 'https://api.example.com/data',
        data_processing_logic: 'Extract JSON data and return relevant fields'
      };

      const result = await GenLayerTools.addWebDataAccess(params);

      expect(result.isError).toBeFalsy();
      expect(result.content).toContain('fetch_web_data');
      expect(result.content).toContain('gl.get_webpage');
      expect(result.content).toContain('fetch_structured_data');
      expect(result.content).toContain('monitor_web_change');
      expect(result.content).toContain('api.example.com');
    });
  });
});