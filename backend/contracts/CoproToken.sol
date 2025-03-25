// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Votes} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {Nonces} from "@openzeppelin/contracts/utils/Nonces.sol";

/**
 * @dev Implementation of the governance token for CoproChain Project
 *
 * Why ERC20Votes ? for Checkpoints & getPastVotes
 *
 * We have followed general OpenZeppelin Contracts guidelines: functions revert
 * instead returning `false` on failure. This behavior is nonetheless
 * conventional and does not conflict with the expectations of ERC-20
 * applications.
 */
contract CoproToken is ERC20, ERC20Permit, ERC20Votes {
    /**
     * @dev  Adresse du syndic pour gérer les ventes
     */
    address public syndic;

    constructor(
        address _syndic,
        address[] memory owners,
        uint256[] memory tantiemes
    ) ERC20("CoproToken", "COPRO") ERC20Permit("CoproToken") {
        require(owners.length == tantiemes.length, "Mismatched inputs");
        syndic = _syndic;

        // Distribution des tokens selon les tantièmes
        // Pouvoir redistribuer les tokens après déploiement ?
        for (uint256 i = 0; i < owners.length; i++) {
            _mint(owners[i], tantiemes[i]);
        }
    }

    // The functions below are overrides required by Solidity.
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._update(from, to, amount);
    }

    function nonces(
        address owner
    ) public view virtual override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }

    /**
     * @dev Gestion des ventes : le syndic met à jour les propriétaires // La répartition des tantièmes peut être modifiée par un vote en assemblée générale.
     */
    // function transferOwnership(
    //     address oldOwner,
    //     address newOwner
    // ) external onlySyndic {
    //     uint256 balance = balanceOf(oldOwner);
    //     super.transfer(oldOwner, newOwner, balance);
    // }

    /**
     * @dev Bloquer le transfert des tokens entre propriétaires
     */
    // function transfer(
    //     address from,
    //     address to,
    //     uint256 amount
    // ) internal override(ERC20, ERC20Votes) {
    //     require(
    //         msg.sender == syndic,
    //         "CoproToken: Autonomous transfers not allowed"
    //     );
    //     super.transfer(from, to, amount);
    //     return super.transfer(recipient, amount);
    // }

    /**
     * @dev Bloquer le mint après le déploiement pour le moment
     */
    // function _mint(
    //     address to,
    //     uint256 amount
    // ) internal override(ERC20, ERC20Votes) {
    //     require(
    //         totalSupply() == 0,
    //         "CoproToken: Mint disabled after deployment"
    //     );
    //     super._mint(to, amount);
    // }

    modifier onlySyndic() {
        require(msg.sender == syndic, "Only syndic can update ownership");
        _;
    }
}
