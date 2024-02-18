// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    address public owner;
    uint256 public blockReward;

    event BlockRewardSet(uint256 amount);

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ) ERC20(_name, _symbol) {
        _mint(msg.sender, _totalSupply);
        owner = msg.sender;
        blockReward = 10; // Example initial block reward
    }

    function _mintMinerReward() internal {
        _mint(block.coinbase, blockReward);
    }

    function setBlockReward(uint256 amount) external {
        require(msg.sender == owner, "Only owner can set block reward");
        blockReward = amount;
        emit BlockRewardSet(amount);
    }

    function transferOwnership(address newOwner) external {
        require(msg.sender == owner, "Only owner can transfer ownership");
        owner = newOwner;
    }

    function destroy(address payable recipient) external {
        require(msg.sender == owner, "Only owner can destroy the contract");
        selfdestruct(recipient);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        super._beforeTokenTransfer(from, to, amount);
        
        // Запретить передачу токенов на адрес 0x0 (нулевой адрес)
        require(to != address(0), "ERC20: transfer to the zero address");

        // Установить минимальное количество токенов для передачи
        uint256 minTransferAmount = 100;
        require(amount >= minTransferAmount, "ERC20: transfer amount must be at least 100 tokens");

        // Установить максимальное количество токенов для передачи
        uint256 maxTransferAmount = 1000;
        require(amount <= maxTransferAmount, "ERC20: transfer amount exceeds maximum limit");

        // Добавить логику для обработки перевода токенов перед отправкой
        // Например, обновление каких-то внутренних данных или выполнение дополнительных действий
        // В данном примере просто выводим информацию о переводе в консоль
        console.log("Transfer %s tokens from %s to %s", amount, from, to);
    }
}
