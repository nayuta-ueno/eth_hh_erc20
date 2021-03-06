//SPDX-License-Identifier: Unlicense
pragma solidity ^0.6.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract OzToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Ozln", "OZ") public {
        _mint(msg.sender, initialSupply);
    }
}
