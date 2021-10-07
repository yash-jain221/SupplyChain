//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
import './ItemManager.sol';

contract Item {
    uint public priceinWei;
    bool pricePaid;
    uint public index;
    ItemManager parentContract;
    
    constructor(ItemManager _parentContract, uint _priceinWei, uint _index) {
        priceinWei = _priceinWei;
        index = _index;
        parentContract = _parentContract;
    }
     receive() external payable{
        require(!pricePaid, "Item is already paid");
        require(priceinWei == msg.value,"only full payments are allowed");
        pricePaid = true;
        (bool success, ) = address(parentContract).call{value : msg.value}(abi.encodeWithSignature("triggerPayment(uint256)", index));
        require(success, "The treansaction is cancelling");
     }
    
}