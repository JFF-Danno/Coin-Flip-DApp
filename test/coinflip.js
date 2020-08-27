const CoinFlip = artifacts.require("CoinFlip");
//const truffleAssert = require("truffle-assertions");

contract("CoinFlip", async function(accounts){
         let instance;

    
   it("should have a pot balance equal to 2 * the amount sent to the contract", async function(){
        
        let instance = await CoinFlip.deployed();
        await instance.AddToPot(  {value: web3.utils.toWei( "1", "ether")});
        let PotBalance = await instance.GetPotBalance.call();
        var CorrectPotAmount = web3.utils.toWei( "2", "ether");
        assert.equal( PotBalance, CorrectPotAmount, "The pot balance is not equal to 2 * amount sent." );
    });

    it("should only flip when the pot has a balance > 0", async function(){
        
        let instance = await CoinFlip.deployed();
        let fReady = await instance.ReadyToFlip.call();
        assert( fReady, "Should not be ready to flip with no pot balance." );        
       
    });
  
    it("should have random behaviour on the coin flip.", async function(){
              
        var cntHeads=0;
        var cntTails=0;
        for( var i = 0; i < 20; i++ )
        {
            let instance = await CoinFlip.new();
            let result = await instance.random.call();
            console.log( "flip " + i + " > " + result );
            if ( result == 1 )
            {
                cntHeads++;
            }
            else
            {
                cntTails++;
            }
        }
        console.log( cntHeads + " Heads" );
        console.log( cntTails + " Tails" );
        assert( cntTails > 0 && cntHeads > 0 );
        
    });



 });


