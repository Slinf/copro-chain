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
        string description;
        string content;
        bool executed;
    }

    Proposal[] public proposals;

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
     * @dev Allow to retrieve proposition
     * @param from index start.
     * @param to index end
     */
    function getAllPropositions(
        uint from,
        uint to
    ) external view returns (Proposal[] memory) {
        return proposals;
    }

    /**
     * @dev Allow to store more details about the proposal on the chain
     * @param newProposal information of the new proposition
     * @param targets optional DAO parameters => currently unused in CoproChain Governance
     * @param values optional DAO parameters => currently unused in CoproChain Governance
     * @param calldatas optional DAO parameters => currently unused in CoproChain Governance
     */
    function makeProposition(
        Proposal calldata newProposal,
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
        require(idNewProposal > 0, "Invalid id proposal");
        Proposal memory newProposal = Proposal(
            idNewProposal,
            newProposal.title,
            newProposal.description,
            newProposal.content,
            false
        );
        proposals.push(newProposal);
    }
}
