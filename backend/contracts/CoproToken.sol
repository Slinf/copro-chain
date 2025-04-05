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
     * @dev  Syndic Adress / Admin adress - Person/Entity that manage the co-ownership
     */
    address public syndic;

    /**
     * @dev  Struc that represent owner adress with tantième
     */
    struct OwnerData {
        address accountAddress;
        uint256 tantiem;
    }

    /**
     * @dev  Error when array too large
     */
    error MaxLimitOwnerError();

    /**
     * @dev  Event throw when token are distributed successfuly
     * @param owner propriétaire / owner adress
     * @param amount amount of token distributed
     */
    event TokensDistributed(address indexed owner, uint256 amount);

    /**
     * @dev  Event throw when new token are minted
     * @param to propriétaire / owner adress
     * @param amount amount of token distributed
     */
    event TokensMinted(address indexed to, uint256 amount);

    /**
     * @dev  Event throw when new token are delegated
     * @param from source accound
     * @param to target account
     */
    event TokensDelegatedForVote(address indexed from, address indexed to);

    constructor(
        address initialOwner
    )
        ERC20("CoproToken", "COPRO")
        Ownable(initialOwner)
        ERC20Permit("CoproToken")
    {
        syndic = initialOwner;
    }

    /**
     * @dev  Main methods to set a new project, and share token by property
     * @param owners Copropriétaire / Co-ownership owners / Condominium owners
     */
    function distributeToken(OwnerData[] calldata owners) public onlyOwner {
        if (owners.length > 10) {
            revert MaxLimitOwnerError();
        }
        for (uint256 i = 0; i < owners.length; i++) {
            addNewOwner(owners[i].accountAddress, owners[i].tantiem);
            emit TokensDistributed(owners[i].accountAddress, owners[i].tantiem);
        }
    }

    /**
     * @dev  Allow to add an new person in the DAO/Copro by mint token and allow its vote by delegating automatically
     * @param to address of the owner
     * @param amount amount of token that match property tantième
     */
    function addNewOwner(address to, uint256 amount) public onlyOwner {
        _mint(to, amount * 10 ** decimals());
        emit TokensMinted(to, amount);
        _delegate(to, to);
        emit TokensDelegatedForVote(to, to);
    }

    /**
     * @dev Default requirement method with timestamp mode
     */
    function clock() public view override returns (uint48) {
        return uint48(block.timestamp);
    }

    /**
     * @dev Default time mode setting
     */
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
