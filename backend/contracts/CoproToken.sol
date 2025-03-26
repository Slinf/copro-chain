// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Votes} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {Nonces} from "@openzeppelin/contracts/utils/Nonces.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @dev Implementation of the governance token for CoproChain Project
 *
 * We have followed general OpenZeppelin Contracts guidelines: functions revert
 * instead returning `false` on failure. This behavior is nonetheless
 * conventional and does not conflict with the expectations of ERC-20
 * applications.
 */
contract CoproToken is ERC20, Ownable, ERC20Permit, ERC20Votes {
    /**
     * @dev  Adresse du syndic pour gérer les ventes
     */
    address public syndic;

    constructor(
        address initialOwner
    )
        ERC20("CoproToken", "COPRO")
        Ownable(initialOwner)
        ERC20Permit("CoproToken")
    {
        syndic = initialOwner;
    }

    function distributeToken(
        address[] memory owners,
        uint256[] memory tantiemes
    ) public onlyOwner {
        // Distribution des tokens selon les tantièmes
        // Pouvoir redistribuer les tokens après déploiement ?
        for (uint256 i = 0; i < owners.length; i++) {
            _mint(owners[i], tantiemes[i]);
        }
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function clock() public view override returns (uint48) {
        return uint48(block.timestamp);
    }

    // solhint-disable-next-line func-name-mixedcase
    function CLOCK_MODE() public pure override returns (string memory) {
        return "mode=timestamp";
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Votes) {
        super._update(from, to, value);
    }

    function nonces(
        address owner
    ) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }
}
