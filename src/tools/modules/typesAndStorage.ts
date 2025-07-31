// Types and Storage Explanation Tools
export interface ToolResult {
  content: string;
  isError?: boolean;
}

export class TypesAndStorageTools {
  static async explainGenLayerTypes(params: {
    type_category: string;
    include_examples?: boolean;
    include_comparisons?: boolean;
  }): Promise<ToolResult> {
    try {
      const typeExplanations = {
        primitive_types: `# GenLayer Primitive Types

GenLayer supports various primitive types for blockchain storage and computation:

## Integer Types
- **Unsigned Integers**: u8, u16, u32, u64, u128, u256
- **Signed Integers**: i8, i16, i32, i64, i128, i256
- **bigint**: Arbitrary precision integer (use with caution)

${params.include_examples ? `### Examples:
\`\`\`python
class Contract(gl.Contract):
    balance: u256          # Large unsigned integer for token balances
    user_count: u32        # Smaller integer for counters
    temperature: i16       # Signed integer for temperatures
    
    def __init__(self):
        self.balance = u256(1000000)
        self.user_count = u32(0)
        self.temperature = i16(-10)
\`\`\`
` : ''}

## Other Primitive Types
- **bool**: Boolean values (True/False) 
- **str**: UTF-8 encoded strings
- **bytes**: Raw byte sequences
- **Address**: Blockchain addresses (20 bytes)

${params.include_examples ? `### Examples:
\`\`\`python
class Contract(gl.Contract):
    is_active: bool
    name: str
    data: bytes
    owner: Address
    
    def __init__(self):
        self.is_active = True
        self.name = "My Contract"
        self.data = b"\\x00\\x01\\x02"
        self.owner = gl.message.sender_address
\`\`\`
` : ''}

${params.include_comparisons ? `## Differences from Python Types
- Use **u256** instead of **int** for most numeric operations
- **Address** type ensures proper blockchain address handling
- All storage types must be explicitly sized for gas optimization
` : ''}`,

        collection_types: `# GenLayer Collection Types

GenLayer provides blockchain-optimized collection types:

## Dynamic Arrays (DynArray)
- Replaces Python's list[T]
- Dynamic sizing with gas-efficient storage
- Implements MutableSequence interface

${params.include_examples ? `### DynArray Examples:
\`\`\`python
class Contract(gl.Contract):
    users: DynArray[str]           # Array of strings
    balances: DynArray[u256]       # Array of integers
    addresses: DynArray[Address]   # Array of addresses
    
    def __init__(self):
        self.users = DynArray[str]()
        
    @gl.public.write
    def add_user(self, name: str):
        self.users.append(name)
        
    @gl.public.view
    def get_user_count(self) -> u256:
        return u256(len(self.users))
\`\`\`
` : ''}

## Tree Maps (TreeMap)
- Replaces Python's dict[K, V]
- Ordered key-value storage
- Implements MutableMapping interface

${params.include_examples ? `### TreeMap Examples:
\`\`\`python
class Contract(gl.Contract):
    user_balances: TreeMap[Address, u256]     # Address -> Balance
    metadata: TreeMap[str, str]               # String -> String
    permissions: TreeMap[Address, bool]       # Address -> Permission
    
    def __init__(self):
        self.user_balances = TreeMap[Address, u256]()
        
    @gl.public.write
    def set_balance(self, user: Address, amount: u256):
        self.user_balances[user] = amount
        
    @gl.public.view
    def get_balance(self, user: Address) -> u256:
        return self.user_balances.get(user, u256(0))
\`\`\`
` : ''}`,

        custom_types: `# GenLayer Custom Types

You can create custom types using Python classes with special decorators:

## @allow_storage Decorator
Custom classes must use @allow_storage for blockchain storage:

${params.include_examples ? `### Custom Type Examples:
\`\`\`python
from dataclasses import dataclass
from genlayer import allow_storage

@allow_storage
@dataclass
class User:
    name: str
    balance: u256
    active: bool
    
@allow_storage
@dataclass
class Proposal:
    id: u256
    title: str
    votes_for: u256
    votes_against: u256
    metadata: TreeMap[str, str]

class Contract(gl.Contract):
    users: DynArray[User]
    proposals: TreeMap[u256, Proposal]
    
    def __init__(self):
        self.users = DynArray[User]()
        self.proposals = TreeMap[u256, Proposal]()
        
    @gl.public.write
    def create_user(self, name: str) -> u256:
        user = User(
            name=name,
            balance=u256(100),
            active=True
        )
        self.users.append(user)
        return u256(len(self.users) - 1)
\`\`\`
` : ''}

## Memory Allocation for Custom Types
Use gl.storage_inmem_allocate for complex nested types:

${params.include_examples ? `\`\`\`python
# Allocating custom types with complex fields
user_data = User(
    name="Alice",
    balance=u256(1000),
    metadata=gl.storage_inmem_allocate(TreeMap[str, str])
)
\`\`\`
` : ''}`,

        storage_restrictions: `# GenLayer Storage Restrictions

## Critical Rules for Storage Types

### ❌ Forbidden Types in Storage:
- **list[T]** → Use **DynArray[T]** instead
- **dict[K, V]** → Use **TreeMap[K, V]** instead  
- **int** → Use sized integers (**u256**, **i64**, etc.)
- **Generic types without full specification** → TreeMap (forbidden), TreeMap[str, u256] (allowed)

### ✅ Required Patterns:
1. **All storage fields must be declared in class body**
2. **All fields must have type annotations**  
3. **No instance variables outside class definition**

${params.include_examples ? `### Correct Storage Patterns:
\`\`\`python
class Contract(gl.Contract):
    # ✅ Correct declarations
    name: str
    balances: TreeMap[Address, u256]
    users: DynArray[str]
    count: u32
    
    def __init__(self):
        self.name = "MyContract"
        # ❌ This would be lost after execution:
        # self.temp_var = "temporary"
\`\`\`

### Field Declaration Rules:
\`\`\`python
class Contract(gl.Contract):
    # ❌ Wrong - not fully specified
    # data: TreeMap
    # items: DynArray
    
    # ✅ Correct - fully specified
    data: TreeMap[str, u256]
    items: DynArray[str]
    
    # ❌ Wrong - Python primitives
    # count: int
    # active: bool  # This one is actually OK
    
    # ✅ Correct - GenLayer types
    count: u256
    active: bool
\`\`\`
` : ''}`,

        type_conversions: `# GenLayer Type Conversions

## Calldata to Storage Type Conversion

When calling contract methods, GenLayer automatically converts between calldata and storage types:

### Automatic Conversions:
- **JavaScript numbers** → **u256, i64, etc.**
- **JavaScript arrays** → **DynArray[T]**
- **JavaScript objects** → **TreeMap[str, V]** (string keys only)
- **Hex strings** → **Address** (with 0x prefix)

${params.include_examples ? `### Conversion Examples:
\`\`\`python
# Contract method
@gl.public.write
def update_user(self, user_addr: Address, balance: u256, metadata: TreeMap[str, str]):
    # Implementation
    pass

# JavaScript call (automatically converted)
await contract.update_user(
    "0x1234567890123456789012345678901234567890",  // → Address
    1000000,                                         // → u256
    {"level": "premium", "region": "US"}            // → TreeMap[str, str]
);
\`\`\`
` : ''}

## Manual Type Construction

For complex scenarios, construct types explicitly:

${params.include_examples ? `### Manual Construction:
\`\`\`python
# In contract constructor or methods
def __init__(self):
    # Explicit type construction
    self.balances = TreeMap[Address, u256]()
    self.user_list = DynArray[str]()
    
    # With initial values
    self.metadata = TreeMap[str, str]()
    self.metadata["version"] = "1.0"
    self.metadata["author"] = "Developer"
\`\`\`
` : ''}`,

        all_types: `# Complete GenLayer Type System

## Primitive Types
- **Integers**: u8, u16, u32, u64, u128, u256, i8, i16, i32, i64, i128, i256, bigint
- **Other**: bool, str, bytes, Address

## Collection Types  
- **DynArray[T]**: Dynamic arrays (replaces list[T])
- **TreeMap[K, V]**: Ordered mappings (replaces dict[K, V])

## Custom Types
- Python classes with @allow_storage decorator
- Supports dataclasses and complex nested structures

## Storage Rules
- All fields must be declared in class body with type annotations
- Use GenLayer-specific types, not Python primitives
- Generic types must be fully specified

${params.include_examples ? `### Complete Example:
\`\`\`python
from dataclasses import dataclass
from genlayer import *

@allow_storage 
@dataclass
class UserProfile:
    name: str
    balance: u256
    preferences: TreeMap[str, str]

class ComprehensiveContract(gl.Contract):
    # Primitive types
    total_supply: u256
    is_paused: bool
    contract_name: str
    admin: Address
    
    # Collection types
    user_list: DynArray[Address]
    balances: TreeMap[Address, u256]
    
    # Custom types
    profiles: TreeMap[Address, UserProfile]
    
    def __init__(self, name: str):
        self.total_supply = u256(1000000)
        self.is_paused = False
        self.contract_name = name
        self.admin = gl.message.sender_address
        self.user_list = DynArray[Address]()
        self.balances = TreeMap[Address, u256]()
        self.profiles = TreeMap[Address, UserProfile]()
\`\`\`
` : ''}`
      };

      const explanation = typeExplanations[params.type_category as keyof typeof typeExplanations];
      
      if (!explanation) {
        return {
          content: `Error: Unknown type category '${params.type_category}'. Available categories: primitive_types, collection_types, custom_types, storage_restrictions, type_conversions, all_types`,
          isError: true,
        };
      }

      return {
        content: explanation,
      };
    } catch (error) {
      return {
        content: `Error explaining GenLayer types: ${(error as Error).message}`,
        isError: true,
      };
    }
  }

  static async explainStoragePatterns(params: {
    storage_topic: string;
    include_examples?: boolean;
    complexity_level?: string;
  }): Promise<ToolResult> {
    try {
      const storageGuides = {
        storage_basics: `# GenLayer Storage Basics

## How Storage Works in GenLayer

Intelligent Contracts store data persistently on the blockchain. Unlike traditional applications, blockchain storage has special requirements:

### Key Principles:
1. **Public Storage**: All contract data is publicly readable
2. **Gas Costs**: Storage operations consume gas 
3. **Persistence**: Data survives contract executions
4. **Zero Initialization**: Storage starts at zero values

${params.include_examples ? `### Basic Storage Example:
\`\`\`python
class SimpleStorage(gl.Contract):
    # Storage field declarations
    owner: Address
    value: u256
    message: str
    
    def __init__(self, initial_value: u256):
        # Initialize storage in constructor
        self.owner = gl.message.sender_address
        self.value = initial_value
        self.message = "Hello GenLayer"
    
    @gl.public.write
    def set_value(self, new_value: u256):
        # Only owner can modify
        if gl.message.sender_address != self.owner:
            raise Exception("Not authorized")
        self.value = new_value
        
    @gl.public.view
    def get_value(self) -> u256:
        return self.value
\`\`\`
` : ''}

### Default Values:
- **Numbers**: 0
- **Booleans**: False  
- **Strings**: ""
- **Collections**: Empty ([], {})
- **Custom Types**: Zero-initialized recursively`,

        dynarray_usage: `# DynArray Usage Patterns

DynArray is GenLayer's dynamic array type, replacing Python's list:

## Common Operations

${params.include_examples ? `### Basic DynArray Operations:
\`\`\`python
class ArrayContract(gl.Contract):
    items: DynArray[str]
    numbers: DynArray[u256]
    
    def __init__(self):
        self.items = DynArray[str]()
        self.numbers = DynArray[u256]()
    
    @gl.public.write
    def add_item(self, item: str):
        self.items.append(item)
    
    @gl.public.write  
    def remove_item(self, index: u256):
        if index < len(self.items):
            del self.items[int(index)]
    
    @gl.public.view
    def get_item(self, index: u256) -> str:
        if index < len(self.items):
            return self.items[int(index)]
        return ""
    
    @gl.public.view
    def get_all_items(self) -> DynArray[str]:
        return self.items
        
    @gl.public.view
    def item_count(self) -> u256:
        return u256(len(self.items))
\`\`\`
` : ''}

## Advanced Patterns

${params.complexity_level === 'advanced' && params.include_examples ? `### Complex DynArray Usage:
\`\`\`python
@allow_storage
@dataclass
class Task:
    id: u256
    title: str
    completed: bool
    assignee: Address

class TaskManager(gl.Contract):
    tasks: DynArray[Task]
    user_task_count: TreeMap[Address, u256]
    
    @gl.public.write
    def create_task(self, title: str, assignee: Address) -> u256:
        task_id = u256(len(self.tasks))
        task = Task(
            id=task_id,
            title=title,
            completed=False,
            assignee=assignee
        )
        self.tasks.append(task)
        
        # Update user task count
        current_count = self.user_task_count.get(assignee, u256(0))
        self.user_task_count[assignee] = current_count + u256(1)
        
        return task_id
    
    @gl.public.write
    def complete_task(self, task_id: u256):
        if task_id < len(self.tasks):
            self.tasks[int(task_id)].completed = True
    
    @gl.public.view
    def get_user_tasks(self, user: Address) -> DynArray[Task]:
        user_tasks = DynArray[Task]()
        for task in self.tasks:
            if task.assignee == user:
                user_tasks.append(task)
        return user_tasks
\`\`\`
` : ''}

## Performance Considerations:
- Appending is O(1) amortized
- Indexing is O(1)
- Deletion by index is O(n)
- Iteration is O(n)`,

        treemap_usage: `# TreeMap Usage Patterns

TreeMap provides ordered key-value storage, replacing Python's dict:

## Key Features:
- **Ordered**: Keys maintain sorted order
- **Efficient**: O(log n) operations
- **Typed**: Both keys and values are strongly typed

${params.include_examples ? `### Basic TreeMap Operations:
\`\`\`python
class MappingContract(gl.Contract):
    balances: TreeMap[Address, u256]
    metadata: TreeMap[str, str]
    permissions: TreeMap[Address, bool]
    
    def __init__(self):
        self.balances = TreeMap[Address, u256]()
        self.metadata = TreeMap[str, str]()
        self.permissions = TreeMap[Address, bool]()
    
    @gl.public.write
    def set_balance(self, user: Address, amount: u256):
        self.balances[user] = amount
    
    @gl.public.view
    def get_balance(self, user: Address) -> u256:
        return self.balances.get(user, u256(0))
    
    @gl.public.view
    def has_balance(self, user: Address) -> bool:
        return user in self.balances
    
    @gl.public.write
    def remove_user(self, user: Address):
        if user in self.balances:
            del self.balances[user]
            
    @gl.public.view
    def get_metadata(self, key: str) -> str:
        return self.metadata.get(key, "")
\`\`\`
` : ''}

${params.complexity_level === 'advanced' && params.include_examples ? `### Advanced TreeMap Patterns:
\`\`\`python
class AdvancedMapping(gl.Contract):
    # Nested mappings
    user_preferences: TreeMap[Address, TreeMap[str, str]]
    category_items: TreeMap[str, DynArray[str]]
    
    def __init__(self):
        self.user_preferences = TreeMap[Address, TreeMap[str, str]]()
        self.category_items = TreeMap[str, DynArray[str]]()
    
    @gl.public.write
    def set_user_preference(self, user: Address, key: str, value: str):
        if user not in self.user_preferences:
            self.user_preferences[user] = gl.storage_inmem_allocate(TreeMap[str, str])
        self.user_preferences[user][key] = value
    
    @gl.public.write
    def add_item_to_category(self, category: str, item: str):
        if category not in self.category_items:
            self.category_items[category] = gl.storage_inmem_allocate(DynArray[str])
        self.category_items[category].append(item)
\`\`\`
` : ''}

## Common Patterns:
- **Default Values**: Use .get(key, default) for safe access
- **Existence Checks**: Use 'key in mapping' before operations
- **Iteration**: TreeMap maintains key ordering for predictable iteration`,

        storage_optimization: `# Storage Optimization Techniques

## Gas-Efficient Storage Patterns

### 1. Pack Related Data
${params.include_examples ? `\`\`\`python
# ❌ Inefficient - separate storage slots
class Inefficient(gl.Contract):
    user_active: TreeMap[Address, bool]
    user_balance: TreeMap[Address, u256]
    user_timestamp: TreeMap[Address, u256]

# ✅ Efficient - packed into custom type  
@allow_storage
@dataclass
class UserData:
    active: bool
    balance: u256
    last_activity: u256

class Efficient(gl.Contract):
    users: TreeMap[Address, UserData]
\`\`\`
` : ''}

### 2. Use Appropriate Integer Sizes
${params.include_examples ? `\`\`\`python
class OptimizedSizes(gl.Contract):
    # Use smallest sufficient type
    user_count: u32        # Instead of u256 for counters
    percentage: u8         # For 0-100 values
    large_balance: u256    # For token amounts
    small_id: u16          # For small identifiers
\`\`\`
` : ''}

### 3. Lazy Initialization
${params.include_examples ? `\`\`\`python
class LazyInit(gl.Contract):
    user_data: TreeMap[Address, UserData]
    
    @gl.public.write
    def update_user(self, user: Address, balance: u256):
        # Only create storage when needed
        if user not in self.user_data:
            self.user_data[user] = UserData(
                active=True,
                balance=balance,
                last_activity=gl.block.timestamp
            )
        else:
            self.user_data[user].balance = balance
\`\`\`
` : ''}

### 4. Batch Operations
${params.include_examples ? `\`\`\`python
@gl.public.write
def batch_update_balances(self, users: DynArray[Address], amounts: DynArray[u256]):
    # Process multiple updates in single transaction
    for i in range(len(users)):
        if i < len(amounts):
            self.balances[users[i]] = amounts[i]
\`\`\`
` : ''}`,

        storage_best_practices: `# GenLayer Storage Best Practices

## Security Guidelines

### 1. Validate All Inputs
${params.include_examples ? `\`\`\`python
@gl.public.write
def set_user_data(self, user: Address, name: str, age: u8):
    # Validate address
    if user == Address('0x0000000000000000000000000000000000000000'):
        raise Exception("Invalid address")
    
    # Validate string length
    if len(name) == 0 or len(name) > 50:
        raise Exception("Name must be 1-50 characters")
    
    # Validate range
    if age > 150:
        raise Exception("Invalid age")
    
    # Safe to store
    self.user_profiles[user] = UserProfile(name=name, age=age)
\`\`\`
` : ''}

### 2. Implement Access Control
${params.include_examples ? `\`\`\`python
class SecureContract(gl.Contract):
    owner: Address
    admins: TreeMap[Address, bool]
    
    def __init__(self):
        self.owner = gl.message.sender_address
        self.admins = TreeMap[Address, bool]()
    
    def _only_owner(self):
        if gl.message.sender_address != self.owner:
            raise Exception("Only owner allowed")
    
    def _only_admin(self):
        if (gl.message.sender_address != self.owner and 
            not self.admins.get(gl.message.sender_address, False)):
            raise Exception("Admin access required")
    
    @gl.public.write
    def add_admin(self, admin: Address):
        self._only_owner()
        self.admins[admin] = True
\`\`\`
` : ''}

### 3. Handle Edge Cases
${params.include_examples ? `\`\`\`python
@gl.public.view
def get_user_balance(self, user: Address) -> u256:
    # Safe access with default
    return self.balances.get(user, u256(0))

@gl.public.write  
def transfer(self, to: Address, amount: u256):
    sender = gl.message.sender_address
    sender_balance = self.balances.get(sender, u256(0))
    
    # Check sufficient balance
    if sender_balance < amount:
        raise Exception("Insufficient balance")
    
    # Check for overflow on recipient
    recipient_balance = self.balances.get(to, u256(0))
    if recipient_balance + amount < recipient_balance:
        raise Exception("Overflow detected")
    
    # Safe transfer
    self.balances[sender] = sender_balance - amount
    self.balances[to] = recipient_balance + amount
\`\`\`
` : ''}

## Performance Guidelines

### 1. Minimize Storage Reads/Writes
- Cache frequently accessed values
- Batch operations when possible
- Use local variables for calculations

### 2. Efficient Data Structures
- Choose appropriate collection types
- Consider access patterns when designing storage
- Use custom types to group related data

### 3. Gas Optimization
- Use smallest adequate integer types
- Avoid unnecessary storage operations
- Consider storage layout for related fields`
      };

      const explanation = storageGuides[params.storage_topic as keyof typeof storageGuides];
      
      if (!explanation) {
        return {
          content: `Error: Unknown storage topic '${params.storage_topic}'. Available topics: storage_basics, dynarray_usage, treemap_usage, custom_storage_types, storage_optimization, storage_patterns, storage_best_practices`,
          isError: true,
        };
      }

      return {
        content: explanation,
      };
    } catch (error) {
      return {
        content: `Error explaining storage patterns: ${(error as Error).message}`,
        isError: true,
      };
    }
  }
}