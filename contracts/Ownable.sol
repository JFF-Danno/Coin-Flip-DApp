pragma solidity 0.5.12;

contract Ownable{
    
    constructor() public{
        owner = msg.sender;
    }
     
     address public owner;
        modifier onlyOwner(){
        require(msg.sender == owner);
        _; //Continue execution
    }

}
