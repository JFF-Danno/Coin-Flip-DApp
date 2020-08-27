var web3 = new Web3(Web3.givenProvider);
var contractInstance;
var houseAddress;
var houseprivatekey;
var contractAddress;
var winAmount;

$(document).ready(function() {
    $('#save').click( Save );
    $("#Heads").click( callHeads );
    $("#Tails").click( callTails );
    $("#AddToBet").click( AddToBet );
    $("#refund").click( Withdraw );
    ShowModal();
});

function init()
{
    
    window.ethereum.enable().then(function(accounts){
        contractInstance = new web3.eth.Contract(abi, contractAddress, {from:accounts[0]})} ).then(function(){FundContract();});
}
        
    



function Withdraw()
{
    WithdrawFunds().then( UpdateDisplay() );
}

async function WithdrawFunds()
{
    contractInstance.methods.withdrawAll().send()
    .on("transactionHash",function(hash){
            console.log(hash);
        })
     .on("confirmation", function(confirmationNr){
            console.log(confirmationNr);

         })
     .on("receipt", function(receipt){
            console.log(receipt);
           UpdateDisplay();
         });
}

async function DisplayBalance()
{
    var account = web3.currentProvider.selectedAddress;
    balance =    web3.utils.fromWei( await web3.eth.getBalance(account), "ether" );
    $('#player_bal').text( balance );  
}

async function DisplayContractBalance()
{
    var contractbal = web3.utils.fromWei( await contractInstance.methods.getContractBalance().call(), "ether" );
    $('#contractbal').text( contractbal );
}

var potbal;
async function DisplayPotBalance()
{
    potbal = web3.utils.fromWei( await contractInstance.methods.GetPotBalance().call(), "ether" );
    winAmount = potbal;
    $('#potbal').text( potbal );
}

function UpdateDisplay()
{
    DisplayBalance().then( DisplayContractBalance() ).then( DisplayPotBalance() );
}

function callHeads()
{
    if ( readyToFlip() )
    {
        makeFlip(1).then( UpdateDisplay );
    }
    else
    {
        alert( "Please place a bet first!" );
    }
}

function callTails()
{
    if ( readyToFlip() )
    {
        makeFlip(0).then( UpdateDisplay );
    }
    else
    {
        alert( "Please place a bet first!" );
    }
}

function readyToFlip()
{
    return potbal > 0;
}

async function makeFlip(fHeads)
{
    var fWinner = await contractInstance.methods.DoFlip(fHeads).call();
    console.log( "toss " + fWinner );
    if ( fWinner )
    {
        handleWin(fHeads);
    }
    else
    {
        handleLoss(fHeads);
    }
}

function handleWin(fHeads)
{
    setTimeout(function() { 
        if ( fHeads ) { $('#result').text('HEADS');  } else { $('#result').text('TAILS');  }
        ShowWinModal();
        $('#playeramount').text( winAmount + " ETH");
        $('#playertitle').text( "Player Wins" );
    }, 1000);
    setTimeout(function() { 
        CompleteTransactions(true);
    }, 1000);
    
}

function handleLoss(fHeads)
{
    setTimeout(function() { 
        if ( ! fHeads ) { $('#result').text('HEADS');  } else { $('#result').text('TAILS');  }
        ShowLoseModal();
        $('#houseamount').text( winAmount + " ETH");
        $('#housetitle').text( "House Wins" );
    }, 1000);
    setTimeout(function() { 
        CompleteTransactions(false);
    }, 1000);
    
}

async function CompleteTransactions(fWinner)
{
    await contractInstance.methods.CompleteTransactions(fWinner).send()
    .on("transactionHash",function(hash){
            console.log(hash);
        })
     .on("confirmation", function(confirmationNr){
            console.log(confirmationNr);
         })
     .on("receipt", function(receipt){
           console.log(receipt);
           
          // finish animation
          setTimeout( function() {  $('#playerwin').collapse();
                                    $('#housewin').collapse();
                                    $('#playeramount').text( "Player One" );
                                    $('#playertitle').text( "" );
                                    $('#houseamount').text( "Ready To Play" );
                                    $('#housetitle').text( "" );
                                    $('#result').text( "" );
                                    UpdateDisplay();
                                }, 500 );
          setTimeout( function() {
                                    $('#playerwin').show();
                                    $('#housewin').show();
                                }, 500 );
          closeWinModal();
          closeLoseModal();
         });
    
}

async function AddToBet()
{
    var amount = $('#range_5').val();
     var config = {
        value: web3.utils.toWei(amount, "ether")
    };
    let balance = contractInstance.methods.getContractBalance.call();
    if ( balance  < amount )
    {
        alert( 'Sorry the contract has insufficient funds to play.' );
    }
    
    contractInstance.methods.AddToPot().send(config)
    .on("transactionHash",function(hash){
            console.log(hash);
        })
     .on("confirmation", function(confirmationNr){
            console.log(confirmationNr);

         })
     .on("receipt", function(receipt){
            console.log(receipt);
           UpdateDisplay();
         });
    UpdateDisplay();
}

function FundContract()
{
     var config = {
        value: web3.utils.toWei("40", "ether")
    };
    contractInstance.methods.FundContract().send(config)
    .on("transactionHash",function(hash){
            console.log(hash);
        })
     .on("confirmation", function(confirmationNr){
            console.log(confirmationNr);

         })
     .on("receipt", function(receipt){
            console.log(receipt);
           UpdateDisplay();
            
         });
    
}


// Get the modal
var modal = document.getElementById( "custom-Modal" );

function closeModal()
{
    $('#custom-Modal').hide();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) 
  {
    modal.style.display = "none";
  }
}

function ShowModal()
{
    setTimeout( function() { document.getElementById( 'custom-Modal' ).style.display = "block" },  500 );
}

function ShowWinModal()
{
    setTimeout( function() { document.getElementById( 'win-modal' ).style.display = "block" },  500 );
}

function closeWinModal()
{
    setTimeout( function() { document.getElementById( 'win-modal' ).style.display = "none"; } , 500 );
}

function ShowLoseModal()
{
    setTimeout( function() { document.getElementById( 'lose-modal' ).style.display = "block" },  500 );
}

function closeLoseModal()
{
    setTimeout( function() { document.getElementById( 'lose-modal' ).style.display = "none"; } , 500 );
}
async function Save()
{
    contractAddress = $('#contract-address').val();
    closeModal();
    init();

}

$(function () {
    /* BOOTSTRAP SLIDER */


$('#range_5').ionRangeSlider({
      min     : 1,
      max     : 10,
      type    : 'single',
      step    : 1,
      postfix : ' ETH',
      prettify: false,
      hasGrid : true
    });
});