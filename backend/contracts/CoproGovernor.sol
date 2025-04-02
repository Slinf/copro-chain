// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {Governor} from "@openzeppelin/contracts/governance/Governor.sol";
import {GovernorCountingSimple} from "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import {GovernorSettings} from "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import {GovernorStorage} from "@openzeppelin/contracts/governance/extensions/GovernorStorage.sol";
import {GovernorVotes} from "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";

/**
 * @dev Governor contract for copro-chain project
 *
 * This contract is based on OpenZeppelin librairy
 */
contract CoproGovernor is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorStorage,
    GovernorVotes
{
    struct Proposal {
        uint256 id;
        string title;
    }

    struct ProposalDetail {
        string description;
        string content;
    }

    struct ProposalPaylod {
        string title;
        string description;
        string content;
    }

    Proposal[] proposals;
    mapping(uint256 => ProposalDetail) proposalDetailsById;

    error PropositionCreationFailed();
    error OutOfBoundError();
    error InvalidRangeError();

    event ProposalDetailAdded(address by);
    event ProposalAdded(address by, Proposal proposal);

    constructor(
        IVotes _token
    )
        Governor("CoproGovernor")
        GovernorSettings(1 days, 1 weeks, 1e18)
        GovernorVotes(_token)
    {}

    function quorum(
        uint256 blockNumber
    ) public pure override returns (uint256) {
        //Customiser cela
        return 10e10;
    }

    // The following functions are overrides required by Solidity.
    function votingDelay()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    function _propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description,
        address proposer
    ) internal override(Governor, GovernorStorage) returns (uint256) {
        return
            super._propose(targets, values, calldatas, description, proposer);
    }

    /**
     * @dev Retrieve proposition core data for governance list
     * @param startIndex index start
     * @param endIndex index end
     */
    function getAllPropositions(
        uint startIndex,
        uint endIndex
    ) external view returns (Proposal[] memory) {
        if (endIndex > proposals.length - 1) {
            revert OutOfBoundError();
        }
        if (startIndex > endIndex) {
            revert InvalidRangeError();
        }
        if (endIndex - startIndex > 20) {
            revert InvalidRangeError();
        }
        uint resultSize = endIndex - startIndex + 1;
        Proposal[] memory selectedProposals = new Proposal[](resultSize);
        uint256 i;
        for (i = startIndex; i < resultSize; i++) {
            selectedProposals[i] = proposals[startIndex + i];
        }
        return selectedProposals;
    }

    /**
     * @dev Retrieve proposition details data for governance list 
        Reverts if proposalId is not a known proposal thanks to proposalDetails 
     * @param id proposalId
     */
    function getPropositionDetails(
        uint256 id
    ) external view returns (ProposalDetail memory) {
        proposalDetails(id);
        return proposalDetailsById[id];
    }

    /**
     * @dev Generate ipfs file of the proposal, default methods used on proposal execution
     */
    function makeResumeProposal()
        external
        view
        returns (ProposalDetail[] memory)
    {}

    /**
     * @dev Allow to make new proposition with targets, values or caldata as a standard DAO proposition
            This override allow to store more details about the proposal on the chain
     * @param newProposal the new proposition
     * @param targets optional DAO parameters => currently unused in CoproChain Governance
     * @param values optional DAO parameters => currently unused in CoproChain Governance
     * @param calldatas optional DAO parameters => currently unused in CoproChain Governance
     */
    function makeProposition(
        ProposalPaylod calldata newProposal,
        address[] calldata targets,
        uint256[] calldata values,
        bytes[] calldata calldatas
    ) public returns (uint256) {
        uint256 idNewProposal = propose(
            targets,
            values,
            calldatas,
            newProposal.description
        );
        if (idNewProposal == 0) {
            revert PropositionCreationFailed();
        }
        Proposal memory proposal = Proposal(idNewProposal, newProposal.title);

        proposals.push(proposal); //check proposals count == uint256 max = proposalCount();
        emit ProposalAdded(msg.sender, proposal);
        proposalDetailsById[idNewProposal] = ProposalDetail(
            newProposal.description,
            newProposal.content
        );
        emit ProposalDetailAdded(msg.sender);
        return idNewProposal;
    }
}
