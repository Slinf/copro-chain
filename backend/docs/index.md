# Solidity API

## CoproGovernor

_Governor contract for copro-chain project

This contract is based on OpenZeppelin librairy_

### Proposal

```solidity
struct Proposal {
  uint256 id;
  string title;
}
```

### Votes

```solidity
struct Votes {
  uint256 againstVotes;
  uint256 forVotes;
  uint256 abstainVotes;
}
```

### ProposalDetail

```solidity
struct ProposalDetail {
  string description;
  string content;
}
```

### ProposalPaylod

```solidity
struct ProposalPaylod {
  string title;
  string description;
  string content;
}
```

### ProposalResult

```solidity
struct ProposalResult {
  uint256 id;
  string title;
  enum IGovernor.ProposalState state;
  struct CoproGovernor.Votes votes;
}
```

### proposals

```solidity
struct CoproGovernor.Proposal[] proposals
```

### proposalDetailsById

```solidity
mapping(uint256 => struct CoproGovernor.ProposalDetail) proposalDetailsById
```

### InvalidOrderRangeError

```solidity
error InvalidOrderRangeError()
```

### InvalidRangeError

```solidity
error InvalidRangeError()
```

### NoRightToPropose

```solidity
error NoRightToPropose(address caller)
```

### ProposalAddedInGovernor

```solidity
event ProposalAddedInGovernor(address by, struct CoproGovernor.Proposal proposal)
```

### MakeResumeProposalCalled

```solidity
event MakeResumeProposalCalled(uint256 proposalId)
```

### constructor

```solidity
constructor(contract IVotes _token) public
```

_Constructor set params of DAO
Dev mode initialVotingDelay = 60 seconds, initialVotingPeriod = 1 day
Prod mode initialVotingDelay = 1 day, initialVotingPeriod = 1 week_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _token | contract IVotes | ER20 governance token |

### quorum

```solidity
function quorum(uint256 timestamp) public view returns (uint256)
```

_Custom quorum to definition, we need 50% of participation for all proposal
In the future a type of proposal would modify this value_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| timestamp | uint256 | tilestamp for checkpoint, not block number cause qe are in timestamp mode |

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

### getAllPropositions

```solidity
function getAllPropositions(uint256 startIndex, uint256 endIndex) external view returns (struct CoproGovernor.ProposalResult[])
```

_Retrieve proposition core data for governance list_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| startIndex | uint256 | index start |
| endIndex | uint256 | index end |

### getPropositionDetails

```solidity
function getPropositionDetails(uint256 id) external view returns (struct CoproGovernor.ProposalDetail)
```

_Retrieve proposition details data for governance list 
        Reverts if proposalId is not a known proposal thanks to proposalDetails_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | proposalId |

### makeResumeProposal

```solidity
function makeResumeProposal(uint256 id) external
```

_default methods used on proposal execution
In the future can generate ipfs file of the proposal_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | proposalId |

### makeProposition

```solidity
function makeProposition(struct CoproGovernor.ProposalPaylod newProposal, address[] targets, uint256[] values, bytes[] calldatas) public returns (uint256)
```

_Allow to make new proposition with targets, values or caldata as a standard DAO proposition
            This override allow to store more details about the proposal on the chain_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newProposal | struct CoproGovernor.ProposalPaylod | the new proposition |
| targets | address[] | optional DAO parameters => currently unused in CoproChain Governance |
| values | uint256[] | optional DAO parameters => currently unused in CoproChain Governance |
| calldatas | bytes[] | optional DAO parameters => currently unused in CoproChain Governance |

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

_Syndic Adress / Admin adress - Person/Entity that manage the co-ownership_

### OwnerData

_Struc that represent owner adress with tantième_

```solidity
struct OwnerData {
  address accountAddress;
  uint256 tantiem;
}
```

### MaxLimitOwnerError

```solidity
error MaxLimitOwnerError()
```

_Error when array too large_

### TokensDistributed

```solidity
event TokensDistributed(address owner, uint256 amount)
```

_Event throw when token are distributed successfuly_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | propriétaire / owner adress |
| amount | uint256 | amount of token distributed |

### TokensMinted

```solidity
event TokensMinted(address to, uint256 amount)
```

_Event throw when new token are minted_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | propriétaire / owner adress |
| amount | uint256 | amount of token distributed |

### TokensDelegatedForVote

```solidity
event TokensDelegatedForVote(address from, address to)
```

_Event throw when new token are delegated_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | source accound |
| to | address | target account |

### constructor

```solidity
constructor(address initialOwner) public
```

### distributeToken

```solidity
function distributeToken(struct CoproToken.OwnerData[] owners) public
```

_Main methods to set a new project, and share token by property_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owners | struct CoproToken.OwnerData[] | Copropriétaire / Co-ownership owners / Condominium owners |

### addNewOwner

```solidity
function addNewOwner(address to, uint256 amount) public
```

_Allow to add an new person in the DAO/Copro by mint token and allow its vote by delegating automatically_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | address of the owner |
| amount | uint256 | amount of token that match property tantième |

### clock

```solidity
function clock() public view returns (uint48)
```

_Default requirement method with timestamp mode_

### CLOCK_MODE

```solidity
function CLOCK_MODE() public pure returns (string)
```

_Default time mode setting_

### _update

```solidity
function _update(address from, address to, uint256 value) internal
```

### nonces

```solidity
function nonces(address owner) public view returns (uint256)
```

