// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;
import "./Aggre.sol";

contract BinaryOption{

    uint256  public battleId; // unique id for each battle
    mapping(uint256 => Battle) public battleInfo; // map of the existing battles
    address public owner; // the creator of the contract (we)
    uint  public tempVal;
    int feed;
    mapping(string=>address) public feedAddress;
    Aggre public age;

    /*event MyEvent(
    uint256 indexed id,
    uint256 indexed amount,
    int win
    );*/

    event AddEvent(
    uint256 indexed id,
    address address_field
    );

    struct Battle {
        address creator;
        address opponent;
        uint256 amountBet;
        string betType;
        uint betDate;
        bool isUp;
        int currVal;
        int whoWin; // 0 for opponent, 1 for creator, 2 for draw, 3 if not over
    }


    constructor()  {
        age=new Aggre();
        bool isKovan=false; // true if kovan, otherwise rinkeby
        //owner = msg.sender;
        if(isKovan){
        feedAddress["EthVsUsd"]=0x9326BFA02ADD2366b30bacB125260Af641031331;
        }
        else{
        // those addresses (of rinkbey test network) can be found at: https://docs.chain.link/docs/ethereum-addresses/
        feedAddress["EthVsUsd"]=0x8A753747A1Fa494EC906cE90E9f37563A8AF630e;
        //feedAddress["BtcVsUsd"]=0x6135b13325bfC4B00278B4abC5e20bbce2D6580e;
        //feedAddress["EurVsUsd"]=0x0c15Ab9A0DB086e062194c273CC79f41597Bbf13;
        }

    }


    // a creator create a new battle
    function addBattle(string memory betType,uint betDate,bool direction) public payable {
        require(msg.value>0, "You have to bet on positive value!");
        battleInfo[battleId]=Battle(msg.sender,msg.sender,msg.value,betType,betDate,direction,age.getThePrice(feedAddress[betType]),3);
        emit AddEvent(battleId,msg.sender);
        battleId++;
    }

    /*function getAmount(uint256 battle_id) public view returns (uint){
            return battleInfo[battle_id].amountBet;
        }*/

    function getBattleInfo(uint256 battle_id) public payable returns(Battle memory) {
        Battle storage bate=battleInfo[battle_id];
        require(bate.amountBet>0, "Battle number isn't exist.\n");
        //require(battleInfo[battle_id].creator!=battleInfo[battle_id].opponent, "This battle didn't start.");
        return battleInfo[battle_id];
    }

    function getAll() public view returns (Battle[] memory){
            Battle[] memory ret = new Battle[](battleId);
            for (uint i = 0; i < battleId; i++) {
                ret[i] = battleInfo[i];
            }
            return ret;
        }

     /*function getBattleId() public view returns (uint256){
             return battleId;
         }*/

    /*
    function setPrice() public {
        if(isKovan){
        feed= age.getThePrice(0x9326BFA02ADD2366b30bacB125260Af641031331);
        }
        else{age.getThePrice(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);}
    }
    function getPrice() public view returns (int){
        return feed;
    }
    */


    /*function getEvent() public {
        emit MyEvent(battleId,battleId);
    }*/

    // an opponent is signed to battle number: battleid
    function acceptBattle(uint256 battle_id) public payable{

        Battle storage bate=battleInfo[battle_id];
        require(bate.amountBet>0, "Battle number isn't exist.\n");
        require(bate.creator!=msg.sender, "Impossible to fight against yourself."); // in comment until we test with two different players
        require(bate.creator==bate.opponent, "This battle is closed, opponent already exist.");
        require(msg.value==bate.amountBet, "Betting value isn't as specified for this battle.");
        bate.opponent=msg.sender;
    }

    // a creator cancel his battle
    function cancelBattle(uint256 battle_id) public payable{
        Battle memory bate=battleInfo[battle_id];
        require(bate.amountBet>0, "Battle number isn't exist.");
        require(bate.creator==msg.sender, "Only the creator may cancel his own battle.");

        require(bate.creator==bate.opponent, "There is already opponent, this battle can't be canceled.");
        payable(bate.creator).transfer(bate.amountBet); // return the amount invested
        delete battleInfo[battle_id]; // battle is canceled
    }


    /*function getcurrVal(uint256 battle_id) public view returns (uint256){
        require(msg.sender==battleInfo[battle_id].creator||msg.sender==battleInfo[battle_id].opponent, "You are not part of this battle.");
        return battleInfo[battle_id].amountBet;
    }*/

    // the winner may draw his money
    function withdraw(uint256 battle_id) public {
        int winner; // 0=lose 1=win 2=draw
        int oldPrice;
        int newPrice;
        Battle storage bate=battleInfo[battle_id];
        require(battleInfo[battle_id].creator!=battleInfo[battle_id].opponent, "This battle didn't start."); // in case the creator try to withdraw before having opponent. He may cancel battle if he wants.
        require((bate.creator==msg.sender||bate.opponent==msg.sender), "You are not part of this battle."); // can be deleted if comes with getcurrval
        require(block.timestamp>=bate.betDate, "Too early to check who is the winner.");
        require(bate.whoWin==3, "Withdraw already.");
        oldPrice=bate.currVal;
        newPrice=age.getThePrice(feedAddress[bate.betType]);
        // deliver the money to the winner
        if(oldPrice<newPrice){

            if(bate.isUp){
                winner=1;
                payable(bate.creator).transfer(2*bate.amountBet); // multiply by 2 since we deliver the money of both the creator and his opponent
            }
            else{
                winner=0;
                payable(bate.opponent).transfer(2*bate.amountBet);
            }

        }
        else if(oldPrice>newPrice){

            if(bate.isUp){
                winner=0;
                payable(bate.opponent).transfer(2*bate.amountBet);
            }
            else{
                winner=1;
                payable(bate.creator).transfer(2*bate.amountBet);
            }
        }
        // if nothing has changed, the creator lose his money
        else {
            winner=2;
            payable(bate.opponent).transfer(bate.amountBet);
            payable(bate.creator).transfer(bate.amountBet);
        }
        bate.whoWin=winner;
        // sign the event
        //emit MyEvent(battle_id,bate.amountBet*2,winner);
        //delete battleInfo[battle_id]; // battle is finished
    }

    //just for testing
    /*function removeBattle(uint256 battle_id) public {
        require(battleInfo[battle_id].amountBet>0, "Battle number isn't exist.\n");
        //delete battleInfo[battle_id]; // battle is canceled
    }*/



}