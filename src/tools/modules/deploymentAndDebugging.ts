// Deployment and Debugging Tools
export interface ToolResult {
  content: string;
  isError?: boolean;
}

export class DeploymentAndDebuggingTools {
  static async generateDeploymentScript(params: {
    script_type: string;
    network_target?: string;
    contract_path: string;
    constructor_args?: Array<{ name: string; type: string; value: string; description?: string }>;
    deployment_options?: any;
  }): Promise<ToolResult> {
    try {
      const scripts = {
        typescript: `// GenLayer Contract Deployment Script (TypeScript)
import { GenLayerClient } from '@genlayer/js';

interface DeploymentConfig {
  contractPath: string;
  network: string;
  args: any[];
}

async function deployContract() {
  // Network configuration
  const config = {
    localnet: { rpcUrl: 'http://localhost:4000', chainId: 1337 },
    studionet: { rpcUrl: 'https://studio.genlayer.com/api', chainId: 1337 },
    testnet_asimov: { rpcUrl: 'https://testnet.genlayer.com/api', chainId: 42 }
  };

  const networkConfig = config['${params.network_target || 'localnet'}' as keyof typeof config];
  
  // Initialize client
  const client = new GenLayerClient({
    rpcUrl: networkConfig.rpcUrl,
    chainId: networkConfig.chainId,
    privateKey: process.env.PRIVATE_KEY || 'your-private-key-here'
  });

  try {
    console.log('🚀 Deploying contract: ${params.contract_path}');
    console.log('📡 Network: ${params.network_target || 'localnet'}');
    
    // Contract constructor arguments
    const args = [${params.constructor_args?.map(arg => 
      arg.type === 'string' ? `"${arg.value}"` : 
      arg.type.includes('u') || arg.type === 'number' ? arg.value :
      arg.type === 'boolean' ? arg.value.toLowerCase() :
      `"${arg.value}"`
    ).join(', ') || ''}];
    
    console.log('📝 Constructor args:', args);
    
    // Deploy contract
    const deploymentResult = await client.deployContract({
      contractPath: '${params.contract_path}',
      constructorArgs: args,
      ${params.deployment_options?.gas_limit ? `gasLimit: ${params.deployment_options.gas_limit},` : ''}
      ${params.deployment_options?.wait_for_confirmation !== false ? 'waitForConfirmation: true,' : ''}
    });
    
    console.log('✅ Contract deployed successfully!');
    console.log('📄 Contract Address:', deploymentResult.contractAddress);
    console.log('🔗 Transaction Hash:', deploymentResult.transactionHash);
    
    ${params.deployment_options?.verify_deployment !== false ? `
    // Verify deployment
    console.log('🔍 Verifying deployment...');
    const contractInfo = await client.getContract(deploymentResult.contractAddress);
    console.log('✅ Contract verified:', contractInfo);
    ` : ''}
    
    return deploymentResult;
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

// Run deployment
deployContract()
  .then(() => {
    console.log('🎉 Deployment completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Deployment error:', error);
    process.exit(1);
  });

export default deployContract;`,

        python: `#!/usr/bin/env python3
"""
GenLayer Contract Deployment Script (Python)
"""
import asyncio
import os
from genlayer import GenLayerClient, Account

async def deploy_contract():
    """Deploy contract to GenLayer network"""
    
    # Network configurations
    networks = {
        'localnet': {'rpc_url': 'http://localhost:4000', 'chain_id': 1337},
        'studionet': {'rpc_url': 'https://studio.genlayer.com/api', 'chain_id': 1337},
        'testnet_asimov': {'rpc_url': 'https://testnet.genlayer.com/api', 'chain_id': 42}
    }
    
    network = '${params.network_target || 'localnet'}'
    config = networks[network]
    
    print(f"🚀 Deploying contract: ${params.contract_path}")
    print(f"📡 Network: {network}")
    
    # Initialize client and account
    client = GenLayerClient(rpc_url=config['rpc_url'])
    account = Account.from_private_key(
        os.getenv('PRIVATE_KEY', 'your-private-key-here')
    )
    
    try:
        # Constructor arguments
        args = [${params.constructor_args?.map(arg => {
          if (arg.type === 'string') return `"${arg.value}"`;
          if (arg.type.includes('u') || arg.type === 'number') return arg.value;
          if (arg.type === 'boolean') return arg.value.toLowerCase();
          return `"${arg.value}"`;
        }).join(', ') || ''}]
        
        print(f"📝 Constructor args: {args}")
        
        # Read contract file
        with open('${params.contract_path}', 'r') as f:
            contract_code = f.read()
        
        # Deploy contract
        deployment_result = await client.deploy_contract(
            contract_code=contract_code,
            constructor_args=args,
            account=account,
            ${params.deployment_options?.gas_limit ? `gas_limit=${params.deployment_options.gas_limit},` : ''}
            ${params.deployment_options?.wait_for_confirmation !== false ? 'wait_for_confirmation=True,' : ''}
        )
        
        print("✅ Contract deployed successfully!")
        print(f"📄 Contract Address: {deployment_result['contract_address']}")
        print(f"🔗 Transaction Hash: {deployment_result['transaction_hash']}")
        
        ${params.deployment_options?.verify_deployment !== false ? `
        # Verify deployment
        print("🔍 Verifying deployment...")
        contract_info = await client.get_contract(deployment_result['contract_address'])
        print(f"✅ Contract verified: {contract_info}")
        ` : ''}
        
        return deployment_result
        
    except Exception as error:
        print(f"❌ Deployment failed: {error}")
        raise

if __name__ == "__main__":
    result = asyncio.run(deploy_contract())
    print("🎉 Deployment completed successfully!")`,

        cli_command: `# GenLayer CLI Deployment Commands

## Basic Deployment
\`\`\`bash
# Deploy to localnet (default)
genlayer deploy --contract ${params.contract_path}${params.constructor_args?.length ? ` --args ${params.constructor_args.map(arg => `"${arg.value}"`).join(' ')}` : ''}

# Deploy to specific network
genlayer deploy \\
  --contract ${params.contract_path} \\
  --network ${params.network_target || 'localnet'}${params.constructor_args?.length ? ` \\
  --args ${params.constructor_args.map(arg => `"${arg.value}"`).join(' \\\n         ')}` : ''}
\`\`\`

## Advanced Options
\`\`\`bash
# Deploy with custom gas limit and verification
genlayer deploy \\
  --contract ${params.contract_path} \\
  --network ${params.network_target || 'localnet'} \\${params.constructor_args?.length ? `
  --args ${params.constructor_args.map(arg => `"${arg.value}"`).join(' \\\n         ')} \\` : ''}
  --gas-limit ${params.deployment_options?.gas_limit || 1000000} \\
  ${params.deployment_options?.wait_for_confirmation !== false ? '--wait-for-confirmation \\' : ''}
  ${params.deployment_options?.verify_deployment !== false ? '--verify-deployment' : '--no-verify'}
\`\`\`

## Environment Setup
\`\`\`bash
# Set network configuration
export GENLAYER_NETWORK=${params.network_target || 'localnet'}
export GENLAYER_PRIVATE_KEY=your_private_key_here

# Deploy using environment variables
genlayer deploy --contract ${params.contract_path}
\`\`\`

## Network-Specific Commands
\`\`\`bash
# Localnet deployment (development)
genlayer deploy --contract ${params.contract_path} --network localnet

# Studionet deployment (hosted development)
genlayer deploy --contract ${params.contract_path} --network studionet

# Testnet deployment (pre-production)
genlayer deploy --contract ${params.contract_path} --network testnet-asimov
\`\`\`

## Deployment Verification
\`\`\`bash
# Check deployment status
genlayer tx status <transaction_hash>

# Get contract information
genlayer contract info <contract_address>

# Interact with deployed contract
genlayer contract call <contract_address> <method_name> [args...]
\`\`\``,

        deploy_config: `# GenLayer Deployment Configuration

## deployment.config.json
\`\`\`json
{
  "networks": {
    "localnet": {
      "rpcUrl": "http://localhost:4000",
      "chainId": 1337,
      "gasLimit": 1000000,
      "gasPrice": "20000000000"
    },
    "studionet": {
      "rpcUrl": "https://studio.genlayer.com/api", 
      "chainId": 1337,
      "gasLimit": 1500000,
      "gasPrice": "25000000000"
    },
    "testnet-asimov": {
      "rpcUrl": "https://testnet.genlayer.com/api",
      "chainId": 42,
      "gasLimit": 2000000,
      "gasPrice": "30000000000"
    }
  },
  "contracts": {
    "${params.contract_path}": {
      "constructorArgs": [${params.constructor_args?.map(arg => `
        {
          "name": "${arg.name}",
          "type": "${arg.type}",
          "value": "${arg.value}"${arg.description ? `,
          "description": "${arg.description}"` : ''}
        }`).join(',') || ''}
      ],
      "deploymentOptions": {
        "gasLimit": ${params.deployment_options?.gas_limit || 1000000},
        "waitForConfirmation": ${params.deployment_options?.wait_for_confirmation !== false},
        "verifyDeployment": ${params.deployment_options?.verify_deployment !== false}
      }
    }
  },
  "accounts": {
    "deployer": {
      "privateKey": "\${PRIVATE_KEY}",
      "address": "0x..."
    }
  }
}
\`\`\`

## .env Configuration
\`\`\`bash
# Network settings
GENLAYER_NETWORK=${params.network_target || 'localnet'}
GENLAYER_RPC_URL=http://localhost:4000

# Account settings  
PRIVATE_KEY=your_private_key_here
DEPLOYER_ADDRESS=0x...

# Deployment settings
GAS_LIMIT=${params.deployment_options?.gas_limit || 1000000}
WAIT_FOR_CONFIRMATION=${params.deployment_options?.wait_for_confirmation !== false ? 'true' : 'false'}
VERIFY_DEPLOYMENT=${params.deployment_options?.verify_deployment !== false ? 'true' : 'false'}
\`\`\`

## Docker Deployment
\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

CMD ["npm", "run", "deploy"]
\`\`\`

## GitHub Actions Deployment
\`\`\`yaml
name: Deploy to GenLayer
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Deploy contract
        run: npm run deploy
        env:
          PRIVATE_KEY: \${{ secrets.PRIVATE_KEY }}
          GENLAYER_NETWORK: ${params.network_target || 'testnet-asimov'}
\`\`\``
      };

      const script = scripts[params.script_type as keyof typeof scripts];
      
      if (!script) {
        return {
          content: `Error: Unknown script type '${params.script_type}'. Available types: typescript, python, cli_command, deploy_config`,
          isError: true,
        };
      }

      return {
        content: `# GenLayer Deployment Script

${script}

## Constructor Arguments:
${params.constructor_args?.map(arg => `- **${arg.name}** (${arg.type}): ${arg.value}${arg.description ? ` - ${arg.description}` : ''}`).join('\n') || 'No constructor arguments'}

## Deployment Options:
- **Network**: ${params.network_target || 'localnet'}
- **Gas Limit**: ${params.deployment_options?.gas_limit || 1000000}
- **Wait for Confirmation**: ${params.deployment_options?.wait_for_confirmation !== false ? 'Yes' : 'No'}
- **Verify Deployment**: ${params.deployment_options?.verify_deployment !== false ? 'Yes' : 'No'}

## Next Steps:
1. Review the generated deployment script
2. Set up your environment variables (PRIVATE_KEY, etc.)
3. Test on localnet first
4. Deploy to testnet for validation
5. Deploy to mainnet when ready`,
      };
    } catch (error) {
      return {
        content: `Error generating deployment script: ${(error as Error).message}`,
        isError: true,
      };
    }
  }

  static async generateDebuggingGuide(params: {
    debug_topic: string;
    include_code_examples?: boolean;
    include_troubleshooting?: boolean;
  }): Promise<ToolResult> {
    try {
      const debugGuides = {
        contract_debugging: `# Contract Debugging in GenLayer

## Debug Strategies for Smart Contracts

### 1. Static Analysis
Check for common issues before deployment:

${params.include_code_examples ? `\`\`\`python
# Common issues to check:
class MyContract(gl.Contract):
    # ❌ Missing type annotation
    # balance = u256(0)
    
    # ✅ Correct type annotation
    balance: u256
    
    def __init__(self):
        # ❌ Forgot to initialize
        # self.balance is still 0
        
        # ✅ Proper initialization
        self.balance = u256(1000)
\`\`\`
` : ''}

### 2. Print Debugging
Use print statements for debugging (removed in production):

${params.include_code_examples ? `\`\`\`python
@gl.public.write
def transfer(self, to: Address, amount: u256):
    sender_balance = self.balances.get(gl.message.sender_address, u256(0))
    
    print(f"Transfer: {gl.message.sender_address} -> {to}")
    print(f"Amount: {amount}, Sender balance: {sender_balance}")
    
    if sender_balance < amount:
        print("❌ Insufficient balance")
        raise Exception("Insufficient balance")
    
    # Perform transfer
    self.balances[gl.message.sender_address] = sender_balance - amount
    recipient_balance = self.balances.get(to, u256(0))
    self.balances[to] = recipient_balance + amount
    
    print(f"✅ Transfer completed")
\`\`\`
` : ''}

### 3. State Validation
Add validation methods to check contract state:

${params.include_code_examples ? `\`\`\`python
@gl.public.view
def validate_state(self) -> str:
    issues = []
    
    # Check total supply consistency
    calculated_supply = sum(self.balances.values())
    if calculated_supply != self.total_supply:
        issues.append(f"Supply mismatch: {calculated_supply} != {self.total_supply}")
    
    # Check for negative balances
    for addr, balance in self.balances.items():
        if balance < u256(0):
            issues.append(f"Negative balance for {addr}: {balance}")
    
    return "State valid" if not issues else "; ".join(issues)
\`\`\`
` : ''}`,

        transaction_debugging: `# Transaction Debugging

## Understanding Transaction Failures

### 1. Common Transaction Errors

${params.include_troubleshooting ? `
**Error**: "Insufficient gas"
**Solution**: Increase gas limit in deployment/transaction

**Error**: "Revert: Custom error message"
**Solution**: Check contract logic and input validation

**Error**: "Invalid address format"
**Solution**: Ensure addresses use proper 0x prefix and checksum

**Error**: "Type conversion failed"
**Solution**: Verify parameter types match contract expectations
` : ''}

### 2. Transaction Tracing

${params.include_code_examples ? `\`\`\`python
@gl.public.write  
def traced_function(self, param: u256):
    print(f"Function called with param: {param}")
    print(f"Sender: {gl.message.sender_address}")
    print(f"Block timestamp: {gl.block.timestamp}")
    print(f"Gas remaining: {gl.gas_remaining()}")
    
    # Your logic here
    result = param * u256(2)
    print(f"Calculated result: {result}")
    
    return result
\`\`\`
` : ''}

### 3. Error Handling Patterns

${params.include_code_examples ? `\`\`\`python
@gl.public.write
def safe_operation(self, value: u256):
    try:
        # Validate inputs
        if value == u256(0):
            raise ValueError("Value cannot be zero")
        
        # Perform operation
        result = self.balance / value
        
        # Update state
        self.last_result = result
        
        return result
        
    except ValueError as e:
        print(f"Validation error: {e}")
        raise Exception(f"Invalid input: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise Exception("Operation failed")
\`\`\`
` : ''}`,

        consensus_debugging: `# Consensus Debugging

## Debugging Non-Deterministic Operations

### 1. Equivalence Principle Issues

${params.include_code_examples ? `\`\`\`python
@gl.public.write
def llm_with_debug(self, query: str) -> str:
    def llm_task() -> str:
        print(f"LLM Query: {query}")
        result = gl.exec_prompt(f"Answer: {query}")
        print(f"LLM Result: {result}")
        return result
    
    # Use strict equality for debugging
    consensus_result = gl.eq_principle_strict_eq(llm_task)
    print(f"Consensus Result: {consensus_result}")
    
    return consensus_result
\`\`\`
` : ''}

### 2. Validator Disagreement

${params.include_troubleshooting ? `
**Issue**: Validators producing different results
**Debug Steps**:
1. Check if LLM prompt is deterministic enough
2. Verify web data sources are stable
3. Add tolerance for numerical comparisons
4. Use non-comparative validation for subjective tasks

**Issue**: Consensus timeout
**Debug Steps**:
1. Reduce complexity of non-deterministic operations
2. Check network connectivity to external services
3. Implement fallback mechanisms
4. Monitor validator performance
` : ''}

### 3. Web Data Debugging

${params.include_code_examples ? `\`\`\`python
@gl.public.write
def debug_web_fetch(self, url: str) -> str:
    def web_task() -> str:
        print(f"Fetching from: {url}")
        
        try:
            data = gl.get_webpage(url, mode="text")
            print(f"Fetched {len(data)} characters")
            
            # Process data
            processed = data[:100]  # Take first 100 chars
            print(f"Processed: {processed}")
            
            return processed
            
        except Exception as e:
            print(f"Web fetch error: {e}")
            return f"Error: {e}"
    
    result = gl.eq_principle_strict_eq(web_task)
    return result
\`\`\`
` : ''}`,

        studio_debugging: `# GenLayer Studio Debugging

## Using GenLayer Studio for Development

### 1. Studio Features
- **Real-time Contract Testing**: Deploy and test instantly
- **Transaction Logs**: View detailed execution logs
- **State Inspection**: Monitor contract state changes
- **Network Simulation**: Test with multiple validators

### 2. Debug Panel Usage
${params.include_code_examples ? `
**Step 1**: Deploy your contract in Studio
**Step 2**: Execute transactions and monitor logs
**Step 3**: Check the debug panel for:
- Execution traces
- Gas usage
- State changes
- Error messages
` : ''}

### 3. Common Studio Workflows

${params.include_troubleshooting ? `
**Workflow 1**: Contract Development
1. Write contract with debug prints
2. Deploy to Studio
3. Test all methods
4. Review logs and fix issues
5. Remove debug prints for production

**Workflow 2**: Transaction Analysis
1. Execute failing transaction
2. Check transaction logs
3. Identify error location
4. Fix and redeploy
5. Verify fix works

**Workflow 3**: Performance Testing
1. Deploy contract to Studio
2. Execute with large datasets
3. Monitor gas usage
4. Optimize high-cost operations
5. Test optimizations
` : ''}`,

        cli_debugging: `# CLI Debugging Tools

## GenLayer CLI Debug Commands

### 1. Contract Analysis
\`\`\`bash
# Check contract syntax
genlayer validate --contract contracts/MyContract.py

# Analyze gas usage
genlayer analyze --contract contracts/MyContract.py --gas

# Check type compatibility
genlayer typecheck --contract contracts/MyContract.py
\`\`\`

### 2. Transaction Debugging
\`\`\`bash
# Get transaction details
genlayer tx info <transaction_hash>

# View transaction logs
genlayer tx logs <transaction_hash>

# Trace transaction execution
genlayer tx trace <transaction_hash>
\`\`\`

### 3. Network Debugging
\`\`\`bash
# Check network status
genlayer network status

# Monitor validator consensus
genlayer network validators

# Check connection
genlayer network ping
\`\`\`

${params.include_troubleshooting ? `
### Common CLI Issues:

**Issue**: "Contract not found"
**Solution**: Check contract path and ensure file exists

**Issue**: "Network connection failed"  
**Solution**: Verify network configuration and connectivity

**Issue**: "Invalid private key"
**Solution**: Check private key format and permissions
` : ''}`,

        testing_strategies: `# Testing Strategies for GenLayer Contracts

## Comprehensive Testing Approach

### 1. Unit Testing
Test individual contract methods in isolation:

${params.include_code_examples ? `\`\`\`python
# test_contract.py
import pytest
from genlayer import GenLayerClient
from my_contract import MyContract

@pytest.fixture
async def contract():
    client = GenLayerClient("http://localhost:4000")
    contract = await client.deploy_contract(MyContract, [])
    return contract

async def test_basic_functionality(contract):
    # Test normal operation
    result = await contract.set_value(u256(100))
    assert result.success
    
    value = await contract.get_value()
    assert value == u256(100)

async def test_edge_cases(contract):
    # Test edge cases
    with pytest.raises(Exception, match="Invalid value"):
        await contract.set_value(u256(0))

async def test_access_control(contract):
    # Test access control
    other_account = Account.generate()
    with pytest.raises(Exception, match="Not authorized"):
        await contract.set_value(u256(100), account=other_account)
\`\`\`
` : ''}

### 2. Integration Testing
Test contract interactions with external systems:

${params.include_code_examples ? `\`\`\`python
async def test_llm_integration(contract):
    # Test LLM functionality
    query = "What is 2+2?"
    result = await contract.ask_llm(query)
    
    # Verify result contains expected content
    assert "4" in result
    assert len(result) > 0

async def test_web_data_access(contract):
    # Test web data fetching
    url = "https://api.example.com/test"
    result = await contract.fetch_data(url)
    
    # Verify data was fetched
    assert result.status == "success"
    assert len(result.data) > 0
\`\`\`
` : ''}

### 3. Consensus Testing
Test non-deterministic operations:

${params.include_code_examples ? `\`\`\`python
async def test_consensus_behavior(contract):
    # Test that consensus is reached
    results = []
    
    # Execute same operation multiple times
    for i in range(5):
        result = await contract.llm_operation("test query")
        results.append(result)
    
    # All results should be identical due to consensus
    assert all(r == results[0] for r in results)

async def test_validator_agreement(contract):
    # Test with multiple validators
    client1 = GenLayerClient("http://validator1:4000")
    client2 = GenLayerClient("http://validator2:4000")
    
    result1 = await client1.call_contract(contract.address, "get_data")
    result2 = await client2.call_contract(contract.address, "get_data")
    
    assert result1 == result2
\`\`\`
` : ''}

### 4. Performance Testing

${params.include_code_examples ? `\`\`\`python
async def test_gas_usage(contract):
    # Test gas consumption
    initial_gas = await contract.estimate_gas("expensive_operation", [])
    
    # Execute operation
    receipt = await contract.expensive_operation()
    
    # Verify gas usage is within expected range
    assert receipt.gas_used <= initial_gas * 1.1  # 10% tolerance

async def test_scalability(contract):
    # Test with large datasets
    large_data = ["item" + str(i) for i in range(1000)]
    
    start_time = time.time()
    await contract.process_batch(large_data)
    end_time = time.time()
    
    # Verify reasonable execution time
    assert end_time - start_time < 30  # 30 seconds max
\`\`\`
` : ''}`
      };

      const guide = debugGuides[params.debug_topic as keyof typeof debugGuides];
      
      if (!guide) {
        return {
          content: `Error: Unknown debug topic '${params.debug_topic}'. Available topics: contract_debugging, transaction_debugging, consensus_debugging, studio_debugging, cli_debugging, testing_strategies`,
          isError: true,
        };
      }

      return {
        content: guide,
      };
    } catch (error) {
      return {
        content: `Error generating debugging guide: ${(error as Error).message}`,
        isError: true,
      };
    }
  }
}