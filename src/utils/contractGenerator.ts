// Utility functions for generating GenLayer Intelligent Contracts

export interface ContractField {
  name: string;
  type: string;
  description?: string;
}

export interface VectorStoreMetadata {
  name: string;
  type: string;
}

export interface LLMPromptTemplate {
  name: string;
  prompt: string;
  response_format?: string;
  criteria?: string;
}

export interface WebDataSource {
  url: string;
  mode: "text" | "html";
  extraction_pattern?: string;
  description: string;
}

export class GenLayerContractGenerator {
  static generateBaseContract(
    contractName: string,
    fields: ContractField[] = []
  ): string {
    let contractCode = `# { "Depends": "py-genlayer:test" }
from genlayer import *
from genlayer.gl.vm import UserError
import typing
import json
import re

class ${contractName}(gl.Contract):
`;

    // Add storage fields with proper GenLayer types
    if (fields.length > 0) {
      fields.forEach((field) => {
        const comment = field.description ? ` # ${field.description}` : "";
        contractCode += `    ${field.name}: ${this.mapGenLayerType(
          field.type
        )}${comment}\n`;
      });
      contractCode += `\n`;
    }

    // Add constructor with proper initialization
    contractCode += `    def __init__(self`;

    if (fields.length > 0) {
      const initParams = fields
        .map((field) => {
          const glType = this.mapGenLayerType(field.type);
          const defaultValue = this.getDefaultValue(glType);
          return `${field.name}: ${glType} = ${defaultValue}`;
        })
        .join(", ");
      contractCode += `, ${initParams}`;
    }

    contractCode += `):\n`;

    if (fields.length > 0) {
      fields.forEach((field) => {
        contractCode += `        self.${field.name} = ${field.name}\n`;
      });
    } else {
      contractCode += `        pass\n`;
    }

    contractCode += `\n`;

    // Add default view methods
    contractCode += `    @gl.public.view\n`;
    contractCode += `    def get_info(self) -> str:\n`;
    contractCode += `        return "Intelligent Contract ${contractName} running on GenLayer"\n\n`;

    // Add getter methods for all fields
    if (fields.length > 0) {
      fields.forEach((field) => {
        const returnType = this.mapGenLayerType(field.type);
        contractCode += `    @gl.public.view\n`;
        contractCode += `    def get_${field.name}(self) -> ${returnType}:\n`;
        contractCode += `        return self.${field.name}\n\n`;
      });
    }

    return contractCode;
  }

  static addLLMInteractions(
    contractCode: string,
    methodRequirements: string
  ): string {
    // Add comprehensive LLM interaction methods with proper equivalence principles
    const llmMethods =
      "\n    @gl.public.write\n" +
      '    def process_with_llm(self, input_text: str, prompt_type: str = "general") -> str:\n' +
      '        """\n' +
      "        Process input text using LLM capabilities with equivalence principle\n" +
      "        Requirements: " +
      methodRequirements +
      "\n" +
      '        """\n' +
      "        def llm_task() -> str:\n" +
      '            if prompt_type == "analysis":\n' +
      '                task = f"""Analyze the following text according to these requirements: ' +
      methodRequirements +
      "\n" +
      "                \n" +
      "                Text to analyze: {input_text}\n" +
      "                \n" +
      "                Provide a structured analysis focusing on:\n" +
      "                1. Key themes and concepts\n" +
      "                2. Sentiment and tone\n" +
      "                3. Actionable insights\n" +
      "                \n" +
      '                Return your analysis as a clear, concise summary."""\n' +
      '            elif prompt_type == "classification":\n' +
      '                task = f"""Classify the following text according to these requirements: ' +
      methodRequirements +
      "\n" +
      "                \n" +
      "                Text: {input_text}\n" +
      "                \n" +
      '                Return only the classification result as a single word or phrase."""\n' +
      "            else:\n" +
      '                task = f"""Process the following text according to these requirements: ' +
      methodRequirements +
      "\n" +
      "                \n" +
      "                Input: {input_text}\n" +
      "                \n" +
      '                Return a processed version of the text."""\n' +
      "            \n" +
      "            result = gl.nondet.exec_prompt(task)\n" +
      "            return result.strip()\n" +
      "        \n" +
      "        # Use strict equality for consistent processing\n" +
      "        processed_result = gl.eq_principle_strict_eq(llm_task)\n" +
      "        return processed_result\n" +
      "    \n" +
      "    @gl.public.write\n" +
      "    def analyze_sentiment(self, text: str) -> str:\n" +
      '        """\n' +
      "        Analyze sentiment of text using non-comparative equivalence principle\n" +
      '        """\n' +
      "        result = gl.eq_principle_prompt_non_comparative(\n" +
      "            lambda: gl.nondet.exec_prompt(f\"Analyze the sentiment of this text: '{text}'. Return only: positive, negative, or neutral\"),\n" +
      '            task="Classify sentiment as positive, negative, or neutral",\n' +
      '            criteria="""The output must be exactly one of: positive, negative, neutral.\n' +
      "                        Consider context, tone, and implied meaning.\n" +
      '                        Account for sarcasm and cultural nuances."""\n' +
      "        )\n" +
      "        return result\n" +
      "    \n" +
      "    @gl.public.write\n" +
      '    def generate_response(self, user_input: str, context: str = "") -> str:\n' +
      '        """\n' +
      "        Generate contextual response using LLM with JSON output validation\n" +
      '        """\n' +
      "        def generate_json_response() -> str:\n" +
      '            prompt = f"""Generate a helpful response to the user input.\n' +
      "            \n" +
      '            Context: {context if context else "No additional context provided"}\n' +
      "            User Input: {user_input}\n" +
      "            \n" +
      "            Respond with JSON in this format:\n" +
      "            {{\n" +
      '                "response": "your helpful response here",\n' +
      '                "confidence": 0.95,\n' +
      '                "category": "question/request/information/other"\n' +
      '            }}"""\n' +
      "            \n" +
      "            result = gl.nondet.exec_prompt(prompt)\n" +
      "            # Clean and parse JSON response\n" +
      '            cleaned_result = result.replace("```json", "").replace("```", "").strip()\n' +
      "            parsed = json.loads(cleaned_result)\n" +
      "            return json.dumps(parsed, sort_keys=True)\n" +
      "        \n" +
      "        json_result = gl.eq_principle_strict_eq(generate_json_response)\n" +
      "        response_data = json.loads(json_result)\n" +
      '        return response_data["response"]\n' +
      "    \n";

    return contractCode.trimEnd() + llmMethods;
  }

  static addWebDataAccess(
    contractCode: string,
    urlTemplate: string,
    processingLogic: string
  ): string {
    const webMethod = `
    @gl.public.write
    def fetch_web_data(self, url: str = "${urlTemplate}", mode: str = "text") -> dict:
        """
        Fetch and process web data using GenLayer's native capabilities
        URL: ${urlTemplate}
        Processing: ${processingLogic}
        Modes: text, html, screenshot
        """
        def web_fetch_task() -> str:
            try:
                # Use GenLayer's actual web rendering capabilities
                if mode not in ["text", "html", "screenshot"]:
                    raise Exception(f"Invalid mode: {mode}. Use 'text', 'html', or 'screenshot'")
                
                raw_data = gl.nondet.web.render(url, mode=mode)
                
                # Process data with AI according to specified logic
                processed = gl.nondet.exec_prompt(f'''
                Process this web data according to: ${processingLogic}
                
                Raw data: {raw_data}
                
                Instructions:
                1. Extract relevant information based on the processing logic
                2. Clean and structure the data
                3. Return valid JSON format
                4. Handle any parsing errors gracefully
                
                Return a clean, structured JSON response with the processed data.
                ''')
                
                return processed.strip()
                
            except Exception as e:
                # Return error information for debugging
                return json.dumps({
                    "error": str(e),
                    "url": url,
                    "mode": mode,
                    "status": "failed"
                })
        
        # Use strict equality for deterministic web data processing
        result_str = gl.eq_principle_strict_eq(web_fetch_task)
        
        try:
            # Parse the JSON result
            result_data = json.loads(result_str)
            
            # Add metadata about the request
            result_data.update({
                "url": url,
                "mode": mode,
                "timestamp": "placeholder_timestamp",  # Would use actual timestamp in real implementation
                "status": "success" if "error" not in result_data else "error"
            })
            
            return result_data
            
        except json.JSONDecodeError:
            # Handle case where LLM didn't return valid JSON
            return {
                "raw_response": result_str,
                "url": url,
                "mode": mode,
                "status": "json_parse_error",
                "error": "Failed to parse LLM response as JSON"
            }
    
    @gl.public.write
    def fetch_multiple_sources(self, urls: DynArray[str], processing_instruction: str = "${processingLogic}") -> dict:
        """
        Fetch data from multiple web sources and aggregate results
        """
        def multi_source_task() -> str:
            results = []
            
            for url in urls:
                try:
                    data = gl.nondet.web.render(url, mode="text")
                    results.append({"url": url, "data": data, "status": "success"})
                except Exception as e:
                    results.append({"url": url, "error": str(e), "status": "failed"})
            
            # Process aggregated data with AI
            aggregated_prompt = f'''
            Process data from multiple web sources according to: {processing_instruction}
            
            Source data: {json.dumps(results)}
            
            Instructions:
            1. Aggregate and cross-reference information from all sources
            2. Identify patterns, discrepancies, or consensus across sources
            3. Extract the most reliable and relevant information
            4. Return structured JSON with aggregated insights
            
            Provide a comprehensive analysis combining all source data.
            '''
            
            processed = gl.nondet.exec_prompt(aggregated_prompt)
            return processed.strip()
        
        result_str = gl.eq_principle_strict_eq(multi_source_task)
        
        try:
            aggregated_data = json.loads(result_str)
            return {
                "aggregated_result": aggregated_data,
                "source_count": len(urls),
                "sources": list(urls),
                "status": "success"
            }
        except json.JSONDecodeError:
            return {
                "raw_response": result_str,
                "source_count": len(urls),
                "sources": list(urls),
                "status": "json_parse_error",
                "error": "Failed to parse aggregated response as JSON"
            }
    
    @gl.public.write
    def fetch_with_comparative_consensus(self, url: str, analysis_criteria: str = "${processingLogic}") -> dict:
        """
        Fetch web data with comparative consensus validation for numerical results
        """
        def comparative_web_task() -> str:
            raw_data = gl.nondet.web.render(url, mode="text")
            
            analysis_prompt = f'''
            Analyze web data and extract numerical insights according to: {analysis_criteria}
            
            Data: {raw_data}
            
            Return JSON with numerical analysis where applicable.
            Include confidence scores and reasoning.
            '''
            
            result = gl.nondet.exec_prompt(analysis_prompt)
            return result.strip()
        
        # Use comparative consensus for numerical results with tolerance
        result_str = gl.eq_principle_prompt_comparative(
            comparative_web_task,
            task="Extract and analyze numerical data from web source",
            tolerance=0.1  # 10% tolerance for numerical variations
        )
        
        try:
            analysis_result = json.loads(result_str)
            return {
                "analysis": analysis_result,
                "url": url,
                "validation_method": "comparative_consensus",
                "tolerance": 0.1,
                "status": "success"
            }
        except json.JSONDecodeError:
            return {
                "raw_response": result_str,
                "url": url,
                "validation_method": "comparative_consensus",
                "status": "json_parse_error",
                "error": "Failed to parse consensus response as JSON"
            }
    
`;

    return contractCode.trimEnd() + webMethod;
  }

  static addEquivalencePrinciple(
    contractCode: string,
    methodName: string,
    validationType: string,
    tolerance?: number
  ): string {
    // In a real implementation, this would modify the method to include equivalence principle validation
    const validationComment = `
    # Equivalence Principle Validation (${validationType})
    # Tolerance: ${tolerance || "default"}
    # Validators will use this to determine if outputs are equivalent
`;

    // For now, we'll just add a comment to indicate where the validation would be implemented
    return contractCode.replace(
      new RegExp(`(def ${methodName}\\([^)]*\\):)`),
      `$1${validationComment}`
    );
  }

  static createVectorStore(
    storeName: string,
    description: string,
    metadataFields: VectorStoreMetadata[] = []
  ): string {
    let vectorStoreCode = `# { "Depends": "py-genlayer:test" }
# { "Depends": "py-lib-genlayermodelwrappers:test" }

from genlayer import *
from genlayer.gl.vm import UserError
from backend.node.genvm.std.vector_store import VectorStore

class ${storeName}(gl.Contract):
    vector_store: VectorStore
    
    def __init__(self):
        self.vector_store = VectorStore()
    
    @gl.public.write
    def add_text(self, text: str, metadata: dict = None) -> str:
        """
        Add text to the vector store
        Description: ${description}
        """
        self.vector_store.add_text(text, metadata or {})
        return f"Added text to ${storeName}"
    
    @gl.public.view
    def search_similar(self, query: str, top_k: int = 5) -> list:
        """
        Search for similar texts in the vector store
        """
        return self.vector_store.search(query, top_k)
    
    @gl.public.view
    def get_store_info(self) -> dict:
        """
        Get information about the vector store
        """
        return {
            "name": "${storeName}",
            "description": "${description}",
            "size": self.vector_store.size()
        }
`;

    return vectorStoreCode;
  }

  static createPredictionMarket(
    marketName: string,
    description: string,
    resolutionCriteria: string,
    webSources: string[] = []
  ): string {
    const marketCode = `# { "Depends": "py-genlayer:test" }

from genlayer import *
from genlayer.gl.vm import UserError
from typing import List

class ${marketName}(gl.Contract):
    # Market state
    description: str
    resolution_criteria: str
    web_sources: List[str]
    resolved: bool
    outcome: bool
    total_yes_bets: u256
    total_no_bets: u256
    
    # Participant tracking
    bettors: TreeMap[Address, dict]
    
    def __init__(self, description: str, resolution_criteria: str, web_sources: List[str]):
        self.description = description
        self.resolution_criteria = resolution_criteria
        self.web_sources = web_sources
        self.resolved = False
        self.outcome = False
        self.total_yes_bets = 0
        self.total_no_bets = 0
        self.bettors = TreeMap()
    
    @gl.public.write.payable
    def place_bet(self, prediction: bool) -> str:
        """
        Place a bet on the market outcome
        """
        if self.resolved:
            raise Exception("Market already resolved")
            
        sender = gl.message.sender_address
        amount = gl.message.value
        
        # Record the bet
        if sender not in self.bettors:
            self.bettors[sender] = {"yes_bets": 0, "no_bets": 0}
            
        if prediction:
            self.bettors[sender]["yes_bets"] += amount
            self.total_yes_bets += amount
        else:
            self.bettors[sender]["no_bets"] += amount
            self.total_no_bets += amount
            
        return f"Bet placed: {amount} on {'Yes' if prediction else 'No'}"
    
    @gl.public.write
    def resolve_market(self) -> str:
        """
        Resolve the market based on real-world data
        Resolution Criteria: ${resolutionCriteria}
        Web Sources: ${webSources.join(", ")}
        """
        if self.resolved:
            raise Exception("Market already resolved")
            
        # This would use GenLayer's web access to check sources
        # and LLM capabilities to interpret results according to criteria
        # For now we'll simulate resolution
        self.resolved = True
        self.outcome = True  # Placeholder outcome
        
        return f"Market resolved with outcome: {'Yes' if self.outcome else 'No'}"
    
    @gl.public.write
    def claim_winnings(self) -> u256:
        """
        Claim winnings if the user bet on the correct outcome
        """
        if not self.resolved:
            raise Exception("Market not yet resolved")
            
        sender = gl.message.sender_address
        if sender not in self.bettors:
            raise Exception("No bets placed by sender")
            
        user_bets = self.bettors[sender]
        winning_pool = self.total_yes_bets if self.outcome else self.total_no_bets
        user_bet_on_winner = user_bets["yes_bets"] if self.outcome else user_bets["no_bets"]
        
        if user_bet_on_winner == 0:
            raise Exception("No winning bets to claim")
            
        # Calculate payout (simplified)
        total_pool = self.total_yes_bets + self.total_no_bets
        payout = (user_bet_on_winner * total_pool) // winning_pool
        
        # Reset user's winning bets
        if self.outcome:
            self.bettors[sender]["yes_bets"] = 0
        else:
            self.bettors[sender]["no_bets"] = 0
            
        return payout
    
    @gl.public.view
    def get_market_info(self) -> dict:
        """
        Get current market information
        """
        return {
            "name": "${marketName}",
            "description": self.description,
            "resolution_criteria": self.resolution_criteria,
            "web_sources": self.web_sources,
            "resolved": self.resolved,
            "outcome": self.outcome if self.resolved else None,
            "total_yes_bets": self.total_yes_bets,
            "total_no_bets": self.total_no_bets,
            "total_pool": self.total_yes_bets + self.total_no_bets
        }
`;

    return marketCode;
  }

  private static mapGenLayerType(type: string): string {
    // Map common types to GenLayer types
    const typeMap: { [key: string]: string } = {
      string: "str",
      text: "str",  
      integer: "u256",
      int: "u256",
      number: "u256",
      boolean: "bool",
      bool: "bool",
      address: "Address",
      list: "DynArray[str]",
      array: "DynArray[str]",
      dict: "TreeMap[str, str]",
      dictionary: "TreeMap[str, str]",
      map: "TreeMap[str, str]",
      float: "f64",
      decimal: "f64",
      bytes: "bytes",
      timestamp: "u256",
    };

    return typeMap[type.toLowerCase()] || type;
  }

  private static getDefaultValue(glType: string): string {
    // Provide appropriate default values for GenLayer types
    const defaults: { [key: string]: string } = {
      str: '""',
      u256: "u256(0)",
      f64: "0.0",
      bool: "False",
      Address: "Address('0x0000000000000000000000000000000000000000')",
      bytes: "b''",
    };

    // Handle complex types
    if (glType.startsWith("DynArray")) {
      return `${glType}()`;
    }
    if (glType.startsWith("TreeMap")) {
      return `${glType}()`;
    }

    return defaults[glType] || `${glType}()`;
  }

  static generateAdvancedContractTemplate(
    templateType: string,
    contractName: string,
    customParams: any = {}
  ): string {
    switch (templateType) {
      case "dao_governance":
        return this.generateDAOGovernance(contractName, customParams);
      case "content_moderation":
        return this.generateContentModeration(contractName, customParams);
      case "sentiment_tracker":
        return this.generateSentimentTracker(contractName, customParams);
      case "multi_oracle":
        return this.generateMultiOracle(contractName, customParams);
      default:
        return this.generateBaseContract(contractName, []);
    }
  }

  private static generateDAOGovernance(
    contractName: string,
    params: any
  ): string {
    return `# { "Depends": "py-genlayer:test" }
from genlayer import *
from genlayer.gl.vm import UserError
import typing
import json

class ${contractName}(gl.Contract):
    """
    Intelligent DAO Governance Contract with AI-powered proposal analysis
    """
    total_members: u256
    proposal_count: u256
    members: TreeMap[Address, bool]
    
    def __init__(self):
        self.total_members = u256(1)
        self.proposal_count = u256(0)
        self.members = TreeMap[Address, bool]()
        self.members[gl.message.sender_address] = True
    
    @gl.public.write
    def create_proposal(self, title: str, description: str) -> typing.Any:
        """Create a new proposal with AI analysis"""
        def analyze_proposal() -> str:
            task = f"""Analyze this DAO proposal:
            Title: {title}
            Description: {description}
            
            Return JSON: {{"validity": true/false, "category": "governance/technical/financial"}}"""
            return gl.nondet.exec_prompt(task)
        
        analysis_result = gl.eq_principle_strict_eq(analyze_proposal)
        self.proposal_count += u256(1)
        
        return {"proposal_id": int(self.proposal_count), "analysis": analysis_result}
`;
  }

  private static generateContentModeration(
    contractName: string,
    params: any
  ): string {
    return `# { "Depends": "py-genlayer:test" }
from genlayer import *
from genlayer.gl.vm import UserError
import typing
import json

class ${contractName}(gl.Contract):
    """AI-powered content moderation system"""
    flagged_content: TreeMap[str, dict]
    content_counter: u256
    
    def __init__(self):
        self.flagged_content = TreeMap[str, dict]()
        self.content_counter = u256(0)
    
    @gl.public.write
    def moderate_content(self, content: str) -> typing.Any:
        """Moderate content using AI analysis"""
        def analyze_content() -> str:
            task = f"""Analyze this content for moderation:
            Content: {content}
            
            Return JSON: {{"approved": true/false, "violations": [], "severity": "low/medium/high"}}"""
            return gl.nondet.exec_prompt(task)
        
        result = gl.eq_principle_prompt_non_comparative(
            analyze_content,
            task="Moderate content based on community guidelines",
            criteria="Fair and unbiased moderation decision"
        )
        
        self.content_counter += u256(1)
        return {"content_id": int(self.content_counter), "analysis": result}
`;
  }

  private static generateSentimentTracker(
    contractName: string,
    params: any
  ): string {
    return `# { "Depends": "py-genlayer:test" }
from genlayer import *
from genlayer.gl.vm import UserError
import typing

class ${contractName}(gl.Contract):
    """Advanced sentiment tracking system"""
    sentiment_history: DynArray[dict]
    analysis_count: u256
    
    def __init__(self):
        self.sentiment_history = DynArray[dict]()
        self.analysis_count = u256(0)
    
    @gl.public.write
    def analyze_sentiment(self, text: str, topic: str = "general") -> typing.Any:
        """Analyze sentiment with detailed breakdown"""
        def sentiment_analysis() -> str:
            task = f"""Analyze sentiment of: {text}
            Topic: {topic}
            
            Return JSON: {{"sentiment": "positive/negative/neutral", "confidence": 0.0-1.0}}"""
            return gl.nondet.exec_prompt(task)
        
        result = gl.eq_principle_strict_eq(sentiment_analysis)
        self.analysis_count += u256(1)
        
        return {"analysis_id": int(self.analysis_count), "result": result, "topic": topic}
`;
  }

  private static generateMultiOracle(
    contractName: string,
    params: any
  ): string {
    return `# { "Depends": "py-genlayer:test" }
from genlayer import *
from genlayer.gl.vm import UserError
import typing

class ${contractName}(gl.Contract):
    """Multi-source oracle with consensus mechanism"""
    latest_data: TreeMap[str, dict]
    update_count: u256
    
    def __init__(self):
        self.latest_data = TreeMap[str, dict]()
        self.update_count = u256(0)
    
    @gl.public.write
    def fetch_consensus_data(self, data_type: str, query: str) -> typing.Any:
        """Fetch data from multiple sources and reach consensus"""
        def consensus_fetch() -> str:
            task = f"""Fetch and analyze {data_type} data for: {query}
            
            Return JSON: {{"consensus_value": "value", "confidence": 0.0-1.0, "sources": 3}}"""
            return gl.nondet.exec_prompt(task)
        
        result = gl.eq_principle_strict_eq(consensus_fetch)
        self.update_count += u256(1)
        
        return {"data_type": data_type, "query": query, "result": result, "update_id": int(self.update_count)}
`;
  }
}
