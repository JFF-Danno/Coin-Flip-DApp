import "./Ownable.sol";
pragma solidity 0.5.12;

contract CoinFlip is Ownable{
    uint        private contractBalance;
    uint        private balance;
    uint        private payout;

    event PayoutPotCreated( uint payout );

    function AddToPot() public payable {
        balance += msg.value;
        contractBalance -= msg.value;
        PreparePotForPayout();
        emit PayoutPotCreated( payout );
    }

    function FundContract() public payable {
        contractBalance += msg.value;
    }

    function PreparePotForPayout() public
    {   
        payout = 2 * balance;
    }

    function GetPotBalance() public view returns(uint) 
    {
        return payout;
    }

    function getContractBalance() public view returns(uint) {
        return contractBalance;
   }

    function ReadyToFlip() public view returns(bool) {
        return payout > 0;
    }

    function DoFlip(uint side) public view returns (bool) {
        return ( side == random() );
    }

    function CompleteTransactions(bool _fWinner) public 
    {
        balance = 0;
        if ( _fWinner )
        {
            msg.sender.transfer( payout );
        }
        else
        {
            contractBalance += payout;
        }
        payout = 0;
    }

    function random() public view returns (uint) {
        return getnow() % 2;
    }

     function getnow() public view returns (uint) {
        return now;
    }

    function withdrawAll() public onlyOwner returns(uint){
        msg.sender.transfer(address(this).balance);
        contractBalance = 0;
        balance = 0;
        payout = 0;
        assert(address(this).balance == 0);
        return address(this).balance;
    }
}

