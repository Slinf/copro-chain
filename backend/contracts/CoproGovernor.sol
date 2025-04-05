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

    struct Votes {
        uint256 againstVotes;
        uint256 forVotes;
        uint256 abstainVotes;
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

    struct ProposalResult {
        uint256 id;
        string title;
        ProposalState state;
        Votes votes;
    }

    Proposal[] proposals;
    mapping(uint256 => ProposalDetail) proposalDetailsById;

    error OutOfBoundError();
    error InvalidOrderRangeError();
    error InvalidRangeError();

    event ProposalAddedInGovernor(address by, Proposal proposal);

    /**
     * @dev Constructor set params of DAO
     * Dev mode initialVotingDelay = 60 seconds, initialVotingPeriod = 1 day
     * Prod mode initialVotingDelay = 1 day, initialVotingPeriod = 1 week
     * @param _token ER20 governance token
     */
    constructor(
        IVotes _token
    )
        Governor("CoproGovernor")
        GovernorSettings(60 seconds, 1 day, 1e18)
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
    ) external view returns (ProposalResult[] memory) {
        if (proposals.length == 0) {
            return new ProposalResult[](0);
        }
        if (endIndex > proposals.length - 1) {
            revert OutOfBoundError();
        }
        if (startIndex > endIndex) {
            revert InvalidOrderRangeError();
        }
        if (endIndex - startIndex > 20) {
            revert InvalidRangeError();
        }
        uint resultSize = endIndex - startIndex + 1;
        ProposalResult[] memory selectedProposals = new ProposalResult[](
            resultSize
        );
        uint256 i;
        for (i = startIndex; i < resultSize; i++) {
            (
                uint256 against,
                uint256 forVotes,
                uint256 abstain
            ) = proposalVotes(proposals[startIndex + i].id);

            selectedProposals[i] = ProposalResult(
                proposals[startIndex + i].id,
                proposals[startIndex + i].title,
                state(proposals[startIndex + i].id),
                Votes(against, forVotes, abstain)
            );
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
        Proposal memory proposal = Proposal(idNewProposal, newProposal.title);

        proposals.push(proposal); //check proposals count == uint256 max = proposalCount();
        emit ProposalAddedInGovernor(msg.sender, proposal);
        proposalDetailsById[idNewProposal] = ProposalDetail(
            newProposal.description,
            newProposal.content
        );
        return idNewProposal;
    }
}
