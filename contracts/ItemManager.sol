//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
import './Item.sol';
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";


contract ItemManager is Ownable{
    
    enum SupplyChainState{Created, Paid, Delivered}
    
    struct S_item{
        Item item;
        string identifier;
        uint itemPrice;
        ItemManager.SupplyChainState _state;
    }
    
    mapping(uint => S_item) public items;
    uint index = 0;
    
    event SupplyChainStep(uint index, uint step, address ItemAddress);
    
    function createItem(string memory _identifier,uint _itemPrice) public onlyOwner{
        items[index].item = new Item(this,_itemPrice,index);
        items[index].identifier = _identifier;
        items[index].itemPrice = _itemPrice;
        items[index]._state = SupplyChainState.Created;
        emit SupplyChainStep(index,uint(items[index]._state), address(items[index].item));
        index++;
    }
    
    function triggerPayment(uint _index) public payable{
        require(items[_index].itemPrice == msg.value,"Only full payments accepted");
        require(items[_index]._state == SupplyChainState.Created,"Item is further in supply chain");
        items[_index]._state = SupplyChainState.Paid;
        emit SupplyChainStep(_index,uint(items[_index]._state), address(items[_index].item));
    }
    
    function triggerDelivery(uint _index) public onlyOwner{
        require(items[_index]._state == SupplyChainState.Paid,"Item is further in supply chain");
        items[_index]._state = SupplyChainState.Delivered;
        emit SupplyChainStep(_index,uint(items[_index]._state),address(items[_index].item));
    }
}
