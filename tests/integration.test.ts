import { spawn, ChildProcess } from 'child_process';
import { GenLayerTools } from '../src/tools/genLayerTools';

describe('Integration Tests', () => {
  let serverProcess: ChildProcess;

  const sendMCPRequest = (method: string, params: any = {}): Promise<any> => {
    return new Promise((resolve, reject) => {
      const request = {
        jsonrpc: '2.0',
        id: Date.now(),
        method,
        params
      };

      const timeout = setTimeout(() => {
        reject(new Error('Request timeout'));
      }, 10000);

      let responseData = '';

      const dataHandler = (data: Buffer) => {
        responseData += data.toString();
        try {
          const response = JSON.parse(responseData.trim());
          clearTimeout(timeout);
          serverProcess.stdout?.off('data', dataHandler);
          resolve(response);
        } catch (e) {
          // Continue collecting data if JSON is incomplete
        }
      };

      serverProcess.stdout?.on('data', dataHandler);
      serverProcess.stdin?.write(JSON.stringify(request) + '\n');
    });
  };

  beforeAll(async () => {
    // Start the MCP server process
    serverProcess = spawn('node', ['dist/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Wait for server to start
    await new Promise(resolve => {
      const handler = (data: Buffer) => {
        if (data.toString().includes('GenLayer MCP Server running')) {
          serverProcess.stderr?.off('data', handler);
          resolve(void 0);
        }
      };
      serverProcess.stderr?.on('data', handler);
    });
  });

  afterAll(() => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  describe('MCP Server Integration', () => {
    it('should list all available tools', async () => {
      const response = await sendMCPRequest('tools/list');

      expect(response.result).toBeDefined();
      expect(response.result.tools).toBeInstanceOf(Array);
      expect(response.result.tools.length).toBeGreaterThan(0);

      const toolNames = response.result.tools.map((tool: any) => tool.name);
      expect(toolNames).toContain('generate_intelligent_contract');
      expect(toolNames).toContain('create_prediction_market');
      expect(toolNames).toContain('generate_contract_template');
      expect(toolNames).toContain('explain_genlayer_concepts');
      expect(toolNames).toContain('add_equivalence_principle');
      expect(toolNames).toContain('create_vector_store');
      expect(toolNames).toContain('add_web_data_access');
    });

    it('should generate intelligent contract via MCP', async () => {
      const response = await sendMCPRequest('tools/call', {
        name: 'generate_intelligent_contract',
        arguments: {
          contract_name: 'TestContract',
          requirements: 'A simple storage contract for testing MCP integration',
          use_llm: true,
          web_access: false,
          storage_fields: [{ name: 'data', type: 'string', description: 'Test data' }]
        }
      });

      expect(response.result).toBeDefined();
      expect(response.result.content).toBeInstanceOf(Array);
      expect(response.result.content[0].type).toBe('text');
      expect(response.result.content[0].text).toContain('TestContract');
      expect(response.result.content[0].text).toContain('process_with_llm');
      expect(response.result.content[0].text).toContain('gl.nondet.exec_prompt');
    });

    it('should create prediction market via MCP', async () => {
      const response = await sendMCPRequest('tools/call', {
        name: 'create_prediction_market',
        arguments: {
          market_name: 'TestPredictionMarket',
          description: 'Test prediction market for integration testing',
          resolution_criteria: 'Market will resolve based on test conditions being met',
          web_sources: ['https://api.example.com/test-data'],
          category: 'technology'
        }
      });

      expect(response.result).toBeDefined();
      expect(response.result.content[0].text).toContain('TestPredictionMarket');
      expect(response.result.content[0].text).toContain('place_bet');
      expect(response.result.content[0].text).toContain('resolve_market');
    });

    it('should generate contract template via MCP', async () => {
      const response = await sendMCPRequest('tools/call', {
        name: 'generate_contract_template',
        arguments: {
          template_type: 'dao_governance',
          contract_name: 'TestDAO',
          custom_parameters: {
            voting_threshold: 75
          }
        }
      });

      expect(response.result).toBeDefined();
      expect(response.result.content[0].text).toContain('TestDAO');
      expect(response.result.content[0].text).toContain('DAO Governance');
      expect(response.result.content[0].text).toContain('create_proposal');
    });

    it('should explain GenLayer concepts via MCP', async () => {
      const response = await sendMCPRequest('tools/call', {
        name: 'explain_genlayer_concepts',
        arguments: {
          concept: 'equivalence_principle',
          include_examples: true,
          detail_level: 'intermediate'
        }
      });

      expect(response.result).toBeDefined();
      expect(response.result.content[0].text).toContain('Equivalence Principle');
      expect(response.result.content[0].text).toContain('validators');
      expect(response.result.content[0].text).toContain('```python');
    });

    it('should handle errors gracefully', async () => {
      const response = await sendMCPRequest('tools/call', {
        name: 'generate_intelligent_contract',
        arguments: {
          contract_name: 'invalid_name', // Should fail validation
          requirements: 'Test'
        }
      });

      expect(response.result).toBeDefined();
      expect(response.result.isError).toBeTruthy();
      expect(response.result.content[0].text).toContain('PascalCase');
    });

    it('should validate tool schemas', async () => {
      const response = await sendMCPRequest('tools/call', {
        name: 'create_prediction_market',
        arguments: {
          market_name: 'InvalidMarket', // Missing 'Market' suffix
          description: 'Test',
          resolution_criteria: 'Short' // Too short
        }
      });

      expect(response.result).toBeDefined();
      expect(response.result.isError).toBeTruthy();
    });
  });

  describe('End-to-End Contract Generation', () => {
    it('should generate a complete working contract', async () => {
      const contractResponse = await sendMCPRequest('tools/call', {
        name: 'generate_intelligent_contract',
        arguments: {
          contract_name: 'ComprehensiveContract',
          requirements:
            'A contract that demonstrates all GenLayer features including LLM, web access, and storage',
          use_llm: true,
          web_access: true,
          storage_fields: [
            { name: 'title', type: 'string', description: 'Contract title' },
            { name: 'counter', type: 'integer', description: 'Operation counter' },
            { name: 'active', type: 'boolean', description: 'Contract active status' }
          ]
        }
      });

      expect(contractResponse.result.isError).toBeFalsy();
      const contractCode = contractResponse.result.content[0].text;

      // Verify contract structure
      expect(contractCode).toContain('class ComprehensiveContract(gl.Contract):');
      expect(contractCode).toContain('from genlayer import *');
      expect(contractCode).toContain('import typing');
      expect(contractCode).toContain('import json');
      expect(contractCode).toContain('import re');

      // Verify storage fields
      expect(contractCode).toContain('title: str # Contract title');
      expect(contractCode).toContain('counter: u256 # Operation counter');
      expect(contractCode).toContain('active: bool # Contract active status');

      // Verify LLM integration
      expect(contractCode).toContain('process_with_llm');
      expect(contractCode).toContain('analyze_sentiment');
      expect(contractCode).toContain('generate_response');
      expect(contractCode).toContain('gl.nondet.exec_prompt');
      expect(contractCode).toContain('gl.eq_principle.strict_eq');
      expect(contractCode).toContain('gl.eq_principle.prompt_non_comparative');

      // Verify web access
      expect(contractCode).toContain('fetch_web_data');
      expect(contractCode).toContain('gl.nondet.web.render');
      expect(contractCode).toContain('fetch_multiple_sources');

      // Verify proper decorators
      expect(contractCode).toContain('@gl.public.view');
      expect(contractCode).toContain('@gl.public.write');

      // Verify getter methods
      expect(contractCode).toContain('def get_title(self) -> str:');
      expect(contractCode).toContain('def get_counter(self) -> u256:');
      expect(contractCode).toContain('def get_active(self) -> bool:');
    });

    it('should generate a sophisticated prediction market', async () => {
      const marketResponse = await sendMCPRequest('tools/call', {
        name: 'create_prediction_market',
        arguments: {
          market_name: 'AdvancedCryptoPriceMarket',
          description: 'Predict cryptocurrency price movements with advanced features',
          resolution_criteria:
            'Bitcoin price must exceed $75,000 USD by the end of 2024, verified through multiple data sources',
          web_sources: [
            'https://api.coindesk.com/v1/bpi/currentprice.json',
            'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
          ],
          resolution_deadline: 'December 31, 2024, 11:59 PM UTC',
          category: 'crypto'
        }
      });

      expect(marketResponse.result.isError).toBeFalsy();
      const marketCode = marketResponse.result.content[0].text;

      // Verify advanced market features
      expect(marketCode).toContain('AdvancedCryptoPriceMarket');
      expect(marketCode).toContain('BetPosition');
      expect(marketCode).toContain('@allow_storage');
      expect(marketCode).toContain('@dataclass');

      // Verify betting functionality
      expect(marketCode).toContain('@gl.public.write.payable');
      expect(marketCode).toContain(
        'def place_bet(self, prediction: bool, confidence_level: str = "medium") -> dict:'
      );
      expect(marketCode).toContain('gl.message.value');
      expect(marketCode).toContain('gl.message.sender_address');

      // Verify AI-powered resolution
      expect(marketCode).toContain('def resolve_market(self) -> typing.Any:');
      expect(marketCode).toContain('gl.get_webpage(source_url, mode="text")');
      expect(marketCode).toContain('gl.eq_principle.strict_eq');
      expect(marketCode).toContain('json.loads(resolution_result)');

      // Verify advanced features
      expect(marketCode).toContain('def get_user_position(self, user_address: str) -> dict:');
      expect(marketCode).toContain(
        'def get_betting_history(self, limit: int = 10) -> DynArray[dict]:'
      );
      expect(marketCode).toContain('def _calculate_potential_winnings');

      // Verify data sources
      expect(marketCode).toContain('coindesk.com');
      expect(marketCode).toContain('coingecko.com');
    });

    it('should create a comprehensive vector store', async () => {
      const vectorResponse = await sendMCPRequest('tools/call', {
        name: 'create_vector_store',
        arguments: {
          store_name: 'AdvancedDocumentStore',
          description: 'Store and search documents with semantic similarity and metadata filtering',
          metadata_fields: [
            { name: 'category', type: 'string' },
            { name: 'priority', type: 'integer' },
            { name: 'author', type: 'address' },
            { name: 'public', type: 'boolean' }
          ]
        }
      });

      expect(vectorResponse.result.isError).toBeFalsy();
      const vectorCode = vectorResponse.result.content[0].text;

      // Verify vector store structure
      expect(vectorCode).toContain('AdvancedDocumentStore');
      expect(vectorCode).toContain('VecDB');
      expect(vectorCode).toContain('add_text');
      expect(vectorCode).toContain('search_similar');
      expect(vectorCode).toContain('metadata');

      // Verify metadata fields
      expect(vectorCode).toContain('category: str');
      expect(vectorCode).toContain('priority: u256');
      expect(vectorCode).toContain('author: Address');
      expect(vectorCode).toContain('public: bool');

      // Verify vector operations
      expect(vectorCode).toContain('def add_entry(self');
      expect(vectorCode).toContain('def search_similar(self');
      expect(vectorCode).toContain('def get_entry_by_id(self');
      expect(vectorCode).toContain('def update_entry(self');
      expect(vectorCode).toContain('def remove_entry(self');
      expect(vectorCode).toContain('def get_store_stats(self');
      expect(vectorCode).toContain('def semantic_search_with_filter(self');

      // Verify embedding operations
      expect(vectorCode).toContain('self.vector_store.insert(embedding, entry)');
      expect(vectorCode).toContain('self.vector_store.knn(query_embedding, top_k)');
      expect(vectorCode).toContain('element.remove()');
    });
  });

  describe('Performance and Reliability', () => {
    it('should handle multiple concurrent requests', async () => {
      const requests = Array.from({ length: 5 }, (_, i) =>
        sendMCPRequest('tools/call', {
          name: 'generate_intelligent_contract',
          arguments: {
            contract_name: `ConcurrentContract${i + 1}`,
            requirements: `Test contract ${i + 1} for concurrent request testing`,
            template_type: 'basic'
          }
        })
      );

      const responses = await Promise.all(requests);

      responses.forEach((response, i) => {
        expect(response.result).toBeDefined();
        expect(response.result.isError).toBeFalsy();
        expect(response.result.content[0].text).toContain(`ConcurrentContract${i + 1}`);
      });
    });

    it('should provide consistent responses', async () => {
      const params = {
        name: 'generate_intelligent_contract',
        arguments: {
          contract_name: 'ConsistencyTestContract',
          requirements: 'A contract for testing response consistency',
          use_llm: false,
          web_access: false,
          storage_fields: [{ name: 'test_field', type: 'string', description: 'Test field' }]
        }
      };

      const response1 = await sendMCPRequest('tools/call', params);
      const response2 = await sendMCPRequest('tools/call', params);

      expect(response1.result.isError).toBeFalsy();
      expect(response2.result.isError).toBeFalsy();

      // Responses should be functionally equivalent
      expect(response1.result.content[0].text).toContain('ConsistencyTestContract');
      expect(response2.result.content[0].text).toContain('ConsistencyTestContract');
      expect(response1.result.content[0].text).toContain('test_field: str');
      expect(response2.result.content[0].text).toContain('test_field: str');
    });
  });
});
