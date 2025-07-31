// GenLayer Concepts Explanation Tools
export interface ToolResult {
  content: string;
  isError?: boolean;
}

export class ConceptsExplanationTools {
  static async explainGenLayerConcepts(params: {
    concept: string;
    include_examples?: boolean;
    detail_level?: string;
  }): Promise<ToolResult> {
    try {
      const concepts = {
        equivalence_principle: `# Equivalence Principle in GenLayer

## What is the Equivalence Principle?

The Equivalence Principle is GenLayer's consensus mechanism for handling non-deterministic operations like LLM calls and web data fetching. It ensures that validators reach agreement on results that may vary between executions.

## Types of Equivalence Validation

### 1. Strict Equality (gl.eq_principle_strict_eq)
Used when results must be identical across all validators.

${params.include_examples ? `\`\`\`python
@gl.public.write
def process_deterministic_data(self, input_data: str) -> str:
    def deterministic_task() -> str:
        # Process input in a deterministic way
        result = input_data.upper().replace(" ", "_")
        return result
    
    # All validators must produce identical results
    consensus_result = gl.eq_principle_strict_eq(deterministic_task)
    return consensus_result
\`\`\`
` : ''}

### 2. Comparative Validation (gl.eq_principle_prompt_comparative)
Used for numerical results where small variations are acceptable.

${params.include_examples ? `\`\`\`python
@gl.public.write
def calculate_market_price(self, symbol: str) -> str:
    def price_task() -> str:
        prompt = f"Get current price of {symbol} in USD"
        return gl.exec_prompt(prompt)
    
    # Allow small variations in price calculations
    result = gl.eq_principle_prompt_comparative(
        price_task,
        task="Get market price",
        criteria="Price should be within 1% tolerance",
        tolerance=0.01
    )
    return result
\`\`\`
` : ''}

### 3. Non-Comparative Validation (gl.eq_principle_prompt_non_comparative)
Used for subjective decisions where exact matches aren't expected.

${params.include_examples ? `\`\`\`python
@gl.public.write
def analyze_sentiment(self, text: str) -> str:
    def sentiment_task() -> str:
        prompt = f"Analyze sentiment of: {text}. Return: positive, negative, or neutral"
        return gl.exec_prompt(prompt)
    
    # Subjective analysis with qualitative validation
    result = gl.eq_principle_prompt_non_comparative(
        sentiment_task,
        task="Sentiment analysis",
        criteria="Must return one of: positive, negative, neutral"
    )
    return result
\`\`\`
` : ''}

## Best Practices

### When to Use Each Type:
- **Strict Equality**: Deterministic computations, data formatting
- **Comparative**: Numerical calculations, price feeds, measurements  
- **Non-Comparative**: Content analysis, subjective decisions, classifications

### Design Guidelines:
1. Make prompts as specific and deterministic as possible
2. Include clear criteria for validation
3. Handle edge cases and errors gracefully
4. Test consensus behavior with multiple validators

## Consensus Flow

1. **Leader Execution**: One validator executes the non-deterministic operation
2. **Result Distribution**: Leader shares result with other validators
3. **Validation**: Each validator independently verifies the result
4. **Consensus**: If majority agrees, result is accepted; otherwise, operation is retried`,

        optimistic_democracy: `# Optimistic Democracy Consensus

## GenLayer's Consensus Mechanism

Optimistic Democracy is GenLayer's enhanced Delegated Proof of Stake (dPoS) consensus that enables AI-powered smart contracts through validator collaboration.

## Key Components

### 1. Validator Network
- **Validator Selection**: Validators are chosen based on stake and performance
- **AI Integration**: Each validator connects to LLM services for intelligent operations
- **Consensus Participation**: Validators vote on transaction outcomes

### 2. Transaction Phases

#### Phase 1: Optimistic Execution
- Transactions are initially assumed valid
- Smart contracts execute with AI capabilities
- Results are tentatively accepted

#### Phase 2: Challenge Period  
- Other validators can challenge results
- Challenges trigger detailed verification
- Disputed results go through consensus voting

#### Phase 3: Finalization
- Unchallenged results become final
- Challenged results are resolved through voting
- Finalized state is committed to blockchain

${params.include_examples ? `
### Example Consensus Flow:

\`\`\`python
# Contract method that uses consensus
@gl.public.write
def ai_decision(self, input_data: str) -> str:
    def ai_task() -> str:
        # This will be executed by the leader validator
        prompt = f"Make a decision based on: {input_data}"
        return gl.exec_prompt(prompt)
    
    # Consensus ensures all validators agree on the AI result
    result = gl.eq_principle_strict_eq(ai_task)
    
    # Result is only finalized if validators reach consensus
    return result
\`\`\`
` : ''}

## Benefits

### 1. Scalability
- Fast optimistic execution for most transactions
- Only disputed transactions require full consensus
- Efficient resource utilization

### 2. AI Integration
- Validators can execute LLM operations
- Consensus on non-deterministic AI results
- Reliable AI-powered contract execution

### 3. Security
- Multiple validators verify results
- Challenge mechanism prevents malicious behavior
- Economic incentives align validator interests

## Validator Incentives

### Rewards
- Block rewards for proposing valid blocks
- Transaction fees from processed transactions
- Staking rewards for honest participation

### Penalties
- Slashing for malicious behavior
- Reduced rewards for poor performance
- Ejection from validator set for violations`,

        llm_integration: `# LLM Integration in GenLayer

## How LLMs Work in Smart Contracts

GenLayer enables smart contracts to directly interact with Large Language Models, bringing AI capabilities to blockchain applications.

## Core LLM Functions

### 1. gl.exec_prompt()
Execute LLM prompts within smart contracts.

${params.include_examples ? `\`\`\`python
@gl.public.write
def ask_ai(self, question: str) -> str:
    # Direct LLM interaction
    response = gl.exec_prompt(f"Answer this question: {question}")
    return response

@gl.public.write
def analyze_content(self, content: str) -> str:
    prompt = f\"\"\"
    Analyze the following content:
    {content}
    
    Provide analysis in JSON format:
    {{"sentiment": "positive/negative/neutral", "topics": ["topic1", "topic2"], "summary": "brief summary"}}
    \"\"\"
    
    result = gl.exec_prompt(prompt)
    return result
\`\`\`
` : ''}

### 2. Structured Prompts
Design prompts for consistent, parseable outputs.

${params.include_examples ? `\`\`\`python
@gl.public.write
def classify_text(self, text: str) -> str:
    def classification_task() -> str:
        prompt = f\"\"\"
        Classify the text into one category: tech, finance, health, entertainment, politics, other.
        
        Text: {text}
        
        Return only the category name.
        \"\"\"
        return gl.exec_prompt(prompt)
    
    # Use consensus to ensure consistent classification
    category = gl.eq_principle_strict_eq(classification_task)
    return category
\`\`\`
` : ''}

### 3. Context Management
Manage conversation context and memory.

${params.include_examples ? `\`\`\`python
class ChatContract(gl.Contract):
    conversations: TreeMap[Address, DynArray[str]]
    
    @gl.public.write
    def chat(self, message: str) -> str:
        sender = gl.message.sender_address
        
        # Get conversation history
        if sender not in self.conversations:
            self.conversations[sender] = DynArray[str]()
        
        history = self.conversations[sender]
        
        # Build context from history
        context = "\\n".join(history[-5:])  # Last 5 messages
        
        def chat_task() -> str:
            prompt = f\"\"\"
            Previous conversation:
            {context}
            
            User: {message}
            Assistant: \"\"\"
            
            response = gl.exec_prompt(prompt)
            return response
        
        # Get AI response with consensus
        ai_response = gl.eq_principle_strict_eq(chat_task)
        
        # Update conversation history
        self.conversations[sender].append(f"User: {message}")
        self.conversations[sender].append(f"Assistant: {ai_response}")
        
        return ai_response
\`\`\`
` : ''}

## Advanced LLM Patterns

### 1. Multi-Step Reasoning
Break complex tasks into steps.

${params.include_examples ? `\`\`\`python
@gl.public.write
def complex_analysis(self, data: str) -> str:
    def step1_task() -> str:
        return gl.exec_prompt(f"Step 1 - Extract key facts from: {data}")
    
    def step2_task(facts: str) -> str:
        return gl.exec_prompt(f"Step 2 - Analyze implications of: {facts}")
    
    def step3_task(analysis: str) -> str:
        return gl.exec_prompt(f"Step 3 - Provide recommendations based on: {analysis}")
    
    # Execute steps with consensus
    facts = gl.eq_principle_strict_eq(step1_task)
    analysis = gl.eq_principle_strict_eq(lambda: step2_task(facts))
    recommendations = gl.eq_principle_strict_eq(lambda: step3_task(analysis))
    
    return recommendations
\`\`\`
` : ''}

### 2. Validation and Quality Control
Validate LLM outputs for quality and safety.

${params.include_examples ? `\`\`\`python
@gl.public.write
def safe_content_generation(self, topic: str) -> str:
    def generation_task() -> str:
        prompt = f"Write educational content about: {topic}"
        return gl.exec_prompt(prompt)
    
    def validation_task(content: str) -> str:
        validation_prompt = f\"\"\"
        Validate this content for:
        1. Factual accuracy
        2. Appropriate language
        3. Educational value
        
        Content: {content}
        
        Return: APPROVED or REJECTED with reason
        \"\"\"
        return gl.exec_prompt(validation_prompt)
    
    # Generate content
    content = gl.eq_principle_strict_eq(generation_task)
    
    # Validate content
    validation = gl.eq_principle_strict_eq(lambda: validation_task(content))
    
    if "APPROVED" in validation:
        return content
    else:
        raise Exception(f"Content validation failed: {validation}")
\`\`\`
` : ''}

## Best Practices

### Prompt Design
1. **Be specific**: Clear, detailed instructions
2. **Use examples**: Show expected output format
3. **Set constraints**: Define acceptable responses
4. **Handle errors**: Plan for unexpected outputs

### Performance Optimization
1. **Cache results**: Store frequent queries
2. **Batch operations**: Combine related prompts
3. **Optimize consensus**: Choose appropriate validation type
4. **Monitor costs**: Track LLM usage and gas consumption`,

        web_data_access: `# Web Data Access in GenLayer

## Native Web Connectivity

GenLayer smart contracts can directly access web APIs and fetch real-time data without external oracles.

## Core Web Functions

### 1. gl.get_webpage()
Fetch web content directly in contracts.

${params.include_examples ? `\`\`\`python
@gl.public.write
def fetch_price_data(self, symbol: str) -> str:
    def web_task() -> str:
        # Fetch from multiple sources for reliability
        url1 = f"https://api.coindesk.com/v1/bpi/currentprice/{symbol}.json"
        url2 = f"https://api.coingecko.com/api/v3/simple/price?ids={symbol}&vs_currencies=usd"
        
        try:
            # Primary source
            data1 = gl.get_webpage(url1, mode="text")
            return data1
        except:
            # Fallback source
            data2 = gl.get_webpage(url2, mode="text")
            return data2
    
    # Ensure consensus on web data
    result = gl.eq_principle_strict_eq(web_task)
    return result
\`\`\`
` : ''}

### 2. Data Processing
Process and validate fetched web data.

${params.include_examples ? `\`\`\`python
@gl.public.write
def get_weather_report(self, city: str) -> str:
    def weather_task() -> str:
        url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid=API_KEY"
        raw_data = gl.get_webpage(url, mode="text")
        
        # Use LLM to process the JSON response
        prompt = f\"\"\"
        Extract temperature and conditions from this weather data:
        {raw_data}
        
        Return format: "Temperature: X°C, Conditions: Y"
        \"\"\"
        
        processed = gl.exec_prompt(prompt)
        return processed
    
    weather_info = gl.eq_principle_strict_eq(weather_task)
    return weather_info
\`\`\`
` : ''}

### 3. Multi-Source Validation
Validate data across multiple sources.

${params.include_examples ? `\`\`\`python
@gl.public.write
def verified_news_summary(self, topic: str) -> str:
    def news_task() -> str:
        # Fetch from multiple news sources
        sources = [
            f"https://newsapi.org/v2/everything?q={topic}",
            f"https://api.reddit.com/r/news/search?q={topic}",
            f"https://api.twitter.com/2/tweets/search/recent?query={topic}"
        ]
        
        articles = []
        for source in sources:
            try:
                data = gl.get_webpage(source, mode="text")
                articles.append(data)
            except:
                continue
        
        # Combine and summarize with LLM
        combined_data = "\\n\\n---\\n\\n".join(articles)
        
        summary_prompt = f\"\"\"
        Analyze these news articles about {topic} and provide:
        1. Key facts that appear in multiple sources
        2. Overall sentiment
        3. Brief neutral summary
        
        Articles:
        {combined_data}
        \"\"\"
        
        summary = gl.exec_prompt(summary_prompt)
        return summary
    
    verified_summary = gl.eq_principle_strict_eq(news_task)
    return verified_summary
\`\`\`
` : ''}

## Advanced Web Access Patterns

### 1. Real-Time Monitoring
Monitor web endpoints for changes.

${params.include_examples ? `\`\`\`python
class WebMonitor(gl.Contract):
    last_hashes: TreeMap[str, str]
    alerts: DynArray[str]
    
    @gl.public.write
    def monitor_endpoint(self, url: str, check_interval: u256) -> str:
        def monitor_task() -> str:
            current_data = gl.get_webpage(url, mode="text")
            current_hash = gl.hash(current_data)
            
            previous_hash = self.last_hashes.get(url, "")
            
            if previous_hash != "" and current_hash != previous_hash:
                alert = f"Change detected at {url} at block {gl.block.number}"
                self.alerts.append(alert)
                return alert
            
            self.last_hashes[url] = current_hash
            return "No change detected"
        
        result = gl.eq_principle_strict_eq(monitor_task)
        return result
\`\`\`
` : ''}

### 2. API Integration
Integrate with external APIs securely.

${params.include_examples ? `\`\`\`python
@gl.public.write
def social_sentiment_analysis(self, hashtag: str) -> str:
    def sentiment_task() -> str:
        # Hypothetical social media API
        api_url = f"https://api.socialmedia.com/sentiment?tag={hashtag}&limit=100"
        
        raw_tweets = gl.get_webpage(api_url, mode="text")
        
        # Process with LLM
        analysis_prompt = f\"\"\"
        Analyze the sentiment of these social media posts about {hashtag}:
        {raw_tweets}
        
        Return JSON:
        {{
            "overall_sentiment": "positive/negative/neutral",
            "confidence": 0.0-1.0,
            "key_themes": ["theme1", "theme2"],
            "post_count": number
        }}
        \"\"\"
        
        analysis = gl.exec_prompt(analysis_prompt)
        return analysis
    
    sentiment_result = gl.eq_principle_strict_eq(sentiment_task)
    return sentiment_result
\`\`\`
` : ''}

## Security Considerations

### 1. Data Validation
Always validate external data before using it.

### 2. Error Handling
Implement robust error handling for network issues.

### 3. Rate Limiting
Respect API rate limits and implement backoff strategies.

### 4. Consensus Verification
Use appropriate consensus mechanisms for web data validation.

## Best Practices

1. **Multiple Sources**: Use multiple data sources for critical information
2. **Data Processing**: Process raw data with LLMs for structure and validation
3. **Caching**: Cache frequently accessed data to reduce API calls
4. **Monitoring**: Monitor data sources for availability and changes
5. **Fallbacks**: Implement fallback mechanisms for data source failures`,

        vector_stores: `# Vector Stores in GenLayer

## Semantic Search on Blockchain

GenLayer's vector stores enable semantic search and similarity matching directly in smart contracts.

## Vector Store Capabilities

### 1. Text Embedding
Automatically generate embeddings for text data.

${params.include_examples ? `\`\`\`python
class DocumentStore(gl.Contract):
    vector_store: VectorStore
    
    def __init__(self):
        self.vector_store = VectorStore()
    
    @gl.public.write
    def add_document(self, title: str, content: str, category: str) -> str:
        # Add document with metadata
        metadata = {
            "title": title,
            "category": category,
            "timestamp": str(gl.block.timestamp),
            "author": str(gl.message.sender_address)
        }
        
        # Vector store automatically generates embeddings
        self.vector_store.add_text(content, metadata)
        return f"Added document: {title}"
    
    @gl.public.view
    def search_documents(self, query: str, top_k: int = 5) -> list:
        # Semantic search returns most relevant documents
        results = self.vector_store.search(query, top_k)
        return results
\`\`\`
` : ''}

### 2. Similarity Matching
Find similar content based on semantic meaning.

${params.include_examples ? `\`\`\`python
@gl.public.write
def find_similar_content(self, reference_text: str, threshold: float = 0.8) -> list:
    # Find content similar to reference
    similar_items = self.vector_store.search(reference_text, top_k=10)
    
    # Filter by similarity threshold
    filtered_results = []
    for item in similar_items:
        if item["similarity"] >= threshold:
            filtered_results.append(item)
    
    return filtered_results
\`\`\`
` : ''}

### 3. Content Classification
Classify content based on existing categories.

${params.include_examples ? `\`\`\`python
@gl.public.write
def classify_content(self, new_content: str) -> str:
    # Search for similar content in each category
    categories = ["technology", "finance", "health", "entertainment"]
    category_scores = {}
    
    for category in categories:
        # Find most similar content in this category
        results = self.vector_store.search(
            new_content, 
            top_k=5,
            filter_metadata={"category": category}
        )
        
        if results:
            # Average similarity score for this category
            avg_score = sum(r["similarity"] for r in results) / len(results)
            category_scores[category] = avg_score
    
    # Return category with highest average similarity
    best_category = max(category_scores, key=category_scores.get)
    return best_category
\`\`\`
` : ''}

## Advanced Vector Operations

### 1. Clustered Storage
Organize content into semantic clusters.

${params.include_examples ? `\`\`\`python
@gl.public.write
def create_content_clusters(self, num_clusters: int = 5) -> list:
    # Get all stored vectors
    all_content = self.vector_store.get_all_content()
    
    def clustering_task() -> str:
        # Use LLM to analyze and cluster content
        content_list = "\\n".join([item["text"][:100] for item in all_content])
        
        prompt = f\"\"\"
        Analyze this content and identify {num_clusters} main themes/clusters:
        {content_list}
        
        Return JSON with cluster names and descriptions:
        {{
            "clusters": [
                {{"name": "cluster1", "description": "desc1"}},
                {{"name": "cluster2", "description": "desc2"}}
            ]
        }}
        \"\"\"
        
        return gl.exec_prompt(prompt)
    
    cluster_info = gl.eq_principle_strict_eq(clustering_task)
    return cluster_info
\`\`\`
` : ''}

### 2. Content Recommendation
Recommend content based on user preferences.

${params.include_examples ? `\`\`\`python
class RecommendationEngine(gl.Contract):
    user_interactions: TreeMap[Address, DynArray[str]]
    content_store: VectorStore
    
    @gl.public.write
    def record_interaction(self, content_id: str, interaction_type: str):
        user = gl.message.sender_address
        
        if user not in self.user_interactions:
            self.user_interactions[user] = DynArray[str]()
        
        # Record user interaction
        interaction_record = f"{content_id}:{interaction_type}"
        self.user_interactions[user].append(interaction_record)
    
    @gl.public.view
    def get_recommendations(self, user: Address, count: int = 10) -> list:
        if user not in self.user_interactions:
            return []
        
        # Get user's interaction history
        interactions = self.user_interactions[user]
        
        # Find content similar to user's previous interactions
        recommendations = []
        for interaction in interactions[-5:]:  # Last 5 interactions
            content_id = interaction.split(":")[0]
            content = self.content_store.get_by_id(content_id)
            
            if content:
                similar = self.content_store.search(content["text"], top_k=3)
                recommendations.extend(similar)
        
        # Remove duplicates and return top recommendations
        unique_recs = list({rec["id"]: rec for rec in recommendations}.values())
        return unique_recs[:count]
\`\`\`
` : ''}

## Performance Optimization

### 1. Efficient Indexing
Optimize vector storage for fast retrieval.

### 2. Batch Operations
Process multiple documents in batches for efficiency.

### 3. Metadata Filtering
Use metadata filters to narrow search scope.

## Use Cases

1. **Document Management**: Store and search company documents
2. **Content Recommendation**: Recommend articles, products, or services
3. **Plagiarism Detection**: Find similar or duplicate content
4. **Knowledge Base**: Build searchable knowledge repositories
5. **Customer Support**: Match user queries to relevant help articles`,

        intelligent_contracts: `# Intelligent Contracts Overview

## Beyond Smart Contracts

Intelligent Contracts are GenLayer's enhanced smart contracts that combine traditional blockchain logic with AI capabilities, web connectivity, and non-deterministic operations.

## Key Capabilities

### 1. AI Integration
Native access to Large Language Models for intelligent decision-making.

${params.include_examples ? `\`\`\`python
class IntelligentOracle(gl.Contract):
    predictions: TreeMap[str, str]
    
    @gl.public.write
    def make_prediction(self, question: str, context: str) -> str:
        def prediction_task() -> str:
            prompt = f\"\"\"
            Based on the following context, make a prediction:
            
            Question: {question}
            Context: {context}
            
            Provide your prediction with confidence level (0-100%):
            Format: "Prediction: [answer], Confidence: [level]%"
            \"\"\"
            
            return gl.exec_prompt(prompt)
        
        # Get consensus prediction
        prediction = gl.eq_principle_strict_eq(prediction_task)
        self.predictions[question] = prediction
        
        return prediction
\`\`\`
` : ''}

### 2. Web Data Access
Direct access to external APIs and web services.

${params.include_examples ? `\`\`\`python
@gl.public.write
def analyze_market_sentiment(self, symbol: str) -> str:
    def analysis_task() -> str:
        # Fetch data from multiple sources
        news_url = f"https://newsapi.org/v2/everything?q={symbol}"
        social_url = f"https://api.twitter.com/2/tweets/search/recent?query={symbol}"
        
        news_data = gl.get_webpage(news_url, mode="text")
        social_data = gl.get_webpage(social_url, mode="text")
        
        # Analyze with AI
        analysis_prompt = f\"\"\"
        Analyze market sentiment for {symbol} based on:
        
        News: {news_data[:1000]}
        Social: {social_data[:1000]}
        
        Return: BULLISH, BEARISH, or NEUTRAL with reasoning
        \"\"\"
        
        return gl.exec_prompt(analysis_prompt)
    
    sentiment = gl.eq_principle_strict_eq(analysis_task)
    return sentiment
\`\`\`
` : ''}

### 3. Dynamic Behavior
Contracts that adapt and evolve based on external conditions.

${params.include_examples ? `\`\`\`python
class AdaptiveGovernance(gl.Contract):
    governance_rules: TreeMap[str, str]
    adaptation_threshold: u256
    
    @gl.public.write
    def evaluate_governance(self, proposal: str) -> str:
        def evaluation_task() -> str:
            # Get current market conditions
            market_data = gl.get_webpage("https://api.market.com/conditions", mode="text")
            
            # Evaluate proposal with current context
            prompt = f\"\"\"
            Evaluate this governance proposal considering current market conditions:
            
            Proposal: {proposal}
            Market Conditions: {market_data}
            Current Rules: {self.governance_rules}
            
            Should we: APPROVE, REJECT, or DEFER this proposal?
            Provide reasoning.
            \"\"\"
            
            return gl.exec_prompt(prompt)
        
        decision = gl.eq_principle_strict_eq(evaluation_task)
        
        # Adapt rules based on decision
        if "APPROVE" in decision:
            self.governance_rules["last_decision"] = decision
        
        return decision
\`\`\`
` : ''}

## Architecture Patterns

### 1. Layered Intelligence
Separate concerns across different intelligence layers.

### 2. Event-Driven AI
Trigger AI operations based on blockchain events.

### 3. Consensus-Backed Decisions
Ensure AI decisions are validated by multiple parties.

## Development Workflow

1. **Design**: Plan intelligent behaviors and data flows
2. **Implement**: Write contract logic with AI integration
3. **Test**: Validate AI responses and consensus behavior
4. **Deploy**: Launch to GenLayer network
5. **Monitor**: Track performance and adapt as needed

## Best Practices

1. **Deterministic Core**: Keep critical logic deterministic
2. **AI Enhancement**: Use AI for analysis and decision support
3. **Validation**: Always validate AI outputs
4. **Fallbacks**: Implement fallback mechanisms
5. **Evolution**: Design for continuous improvement`,

        genvm: `# GenVM (GenLayer Virtual Machine)

## AI-Native Execution Environment

GenVM is GenLayer's virtual machine that enables both deterministic and non-deterministic operations in smart contracts.

## Architecture

### 1. Hybrid Execution Model
Supports both traditional and AI-powered operations.

### 2. Consensus Integration
Built-in consensus mechanisms for non-deterministic results.

### 3. External Connectivity
Native support for web APIs and external services.

## Execution Flow

1. **Transaction Parsing**: Parse and validate incoming transactions
2. **Code Execution**: Execute contract methods in isolated environment
3. **AI Operations**: Handle LLM calls and web requests
4. **Consensus Validation**: Validate non-deterministic results
5. **State Updates**: Apply approved changes to blockchain state

## Key Features

### 1. Sandboxed Execution
Secure isolation for contract code execution.

### 2. Gas Metering
Efficient resource tracking for all operations.

### 3. State Management
Optimized storage and retrieval of contract state.

### 4. Error Handling
Robust error handling for AI and web operations.

## Performance Characteristics

- **Deterministic Operations**: Near-native performance
- **AI Operations**: Optimized for consensus validation
- **Web Access**: Efficient caching and retry mechanisms
- **State Access**: Optimized for blockchain storage patterns`,

        genlayer_types: `# GenLayer Type System

## Blockchain-Optimized Types

GenLayer provides a comprehensive type system designed for blockchain storage and AI integration.

## Type Categories

### 1. Primitive Types
- **Integers**: u8, u16, u32, u64, u128, u256, i8, i16, i32, i64, i128, i256
- **Other**: bool, str, bytes, Address, bigint

### 2. Collection Types
- **DynArray[T]**: Dynamic arrays with efficient storage
- **TreeMap[K, V]**: Ordered key-value mappings

### 3. Specialized Types
- **VectorStore**: Semantic search and similarity matching
- **Address**: Blockchain address handling
- **Custom Classes**: User-defined storage types

## Type Safety

### 1. Compile-Time Validation
All types are validated at compile time.

### 2. Runtime Checks
Additional runtime validation for type safety.

### 3. Cross-Language Compatibility
Types work seamlessly between Python contracts and JavaScript clients.

## Performance Optimizations

### 1. Memory Layout
Optimized memory layout for gas efficiency.

### 2. Storage Packing
Efficient packing of related data.

### 3. Lazy Loading
On-demand loading of large data structures.`,

        best_practices: `# GenLayer Development Best Practices

## Security Guidelines

### 1. Input Validation
Always validate all inputs to prevent exploits.

### 2. Access Control
Implement proper access control mechanisms.

### 3. State Management
Carefully manage contract state to prevent inconsistencies.

### 4. Error Handling
Implement comprehensive error handling.

## Performance Optimization

### 1. Gas Efficiency
Optimize for minimal gas consumption.

### 2. Storage Optimization
Use appropriate data structures and packing.

### 3. Consensus Efficiency
Choose optimal validation methods for AI operations.

### 4. Caching Strategies
Implement effective caching for external data.

## AI Integration Best Practices

### 1. Prompt Engineering
Design clear, specific prompts for consistent results.

### 2. Validation Strategies
Always validate AI outputs before using them.

### 3. Fallback Mechanisms
Implement fallbacks for AI operation failures.

### 4. Cost Management
Monitor and optimize AI operation costs.

## Development Workflow

### 1. Local Testing
Test thoroughly on local networks first.

### 2. Testnet Validation
Validate on testnets before mainnet deployment.

### 3. Monitoring
Monitor deployed contracts for performance and issues.

### 4. Continuous Improvement
Regularly update and optimize contracts.`
      };

      const explanation = concepts[params.concept as keyof typeof concepts];
      
      if (!explanation) {
        return {
          content: `Error: Unknown concept '${params.concept}'. Available concepts: ${Object.keys(concepts).join(', ')}`,
          isError: true,
        };
      }

      return {
        content: explanation + (params.detail_level === 'advanced' ? this.getRelatedTopics(params.concept) : ''),
      };
    } catch (error) {
      return {
        content: `Error explaining GenLayer concept: ${(error as Error).message}`,
        isError: true,
      };
    }
  }

  private static getRelatedTopics(concept: string): string {
    const related = {
      equivalence_principle: "\n\n## Related Topics\n• Optimistic Democracy\n• Consensus Mechanisms\n• LLM Integration",
      optimistic_democracy: "\n\n## Related Topics\n• Equivalence Principle\n• Validator Networks\n• Consensus Algorithms",
      llm_integration: "\n\n## Related Topics\n• Equivalence Principle\n• Intelligent Contracts\n• GenLayer Types",
      web_data_access: "\n\n## Related Topics\n• LLM Integration\n• Intelligent Contracts\n• GenLayer Types",
      vector_stores: "\n\n## Related Topics\n• LLM Integration\n• Intelligent Contracts\n• GenLayer Types",
      intelligent_contracts: "\n\n## Related Topics\n• LLM Integration\n• Web Data Access\n• GenVM",
      genvm: "\n\n## Related Topics\n• Intelligent Contracts\n• GenLayer Types\n• Best Practices",
      genlayer_types: "\n\n## Related Topics\n• GenVM\n• Best Practices\n• Intelligent Contracts",
      best_practices: "\n\n## Related Topics\n• Security\n• LLM Integration\n• GenLayer Types"
    };
    
    return related[concept as keyof typeof related] || "\n\n## Related Topics\n• Check GenLayer documentation for more concepts";
  }
}