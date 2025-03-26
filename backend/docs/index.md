# Solidity API

## CoproGovernor

### constructor

```solidity
constructor(contract IVotes _token) public
```

### quorum

```solidity
function quorum(uint256 blockNumber) public pure returns (uint256)
```

### votingDelay

```solidity
function votingDelay() public view returns (uint256)
```

### votingPeriod

```solidity
function votingPeriod() public view returns (uint256)
```

### proposalThreshold

```solidity
function proposalThreshold() public view returns (uint256)
```

### _propose

```solidity
function _propose(address[] targets, uint256[] values, bytes[] calldatas, string description, address proposer) internal returns (uint256)
```

## CoproToken

_Implementation of the governance token for CoproChain Project

We have followed general OpenZeppelin Contracts guidelines: functions revert
instead returning `false` on failure. This behavior is nonetheless
conventional and does not conflict with the expectations of ERC-20
applications._

### syndic

```solidity
address syndic
```

_Adresse du syndic pour gérer les ventes_

### constructor

```solidity
constructor(address initialOwner) public
```

### distributeToken

```solidity
function distributeToken(address[] owners, uint256[] tantiemes) public
```

### mint

```solidity
function mint(address to, uint256 amount) public
```

### clock

```solidity
function clock() public view returns (uint48)
```

_Clock used for flagging checkpoints. Can be overridden to implement timestamp based
checkpoints (and voting), in which case {CLOCK_MODE} should be overridden as well to match._

### CLOCK_MODE

```solidity
function CLOCK_MODE() public pure returns (string)
```

_Machine-readable description of the clock as specified in ERC-6372._

### _update

```solidity
function _update(address from, address to, uint256 value) internal
```

### nonces

```solidity
function nonces(address owner) public view returns (uint256)
```

