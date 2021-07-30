// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;
import "./Aggre.sol";

contract BinaryOption{

    uint256  public battleId; // unique id for each battle
    mapping(uint256 => Battle) public battleInfo; // map of the existing battles
    mapping(string=>address) public feedAddress; // map of addresses for the price feeds
    Aggre public age;

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
        if(isKovan){
        feedAddress["EthVsUsd"]=0x9326BFA02ADD2366b30bacB125260Af641031331;
        }
        else{
        // those addresses (of rinkbey test network) can be found at: https://docs.chain.link/docs/ethereum-addresses/
        feedAddress["eth_vs_usd"]=0x8A753747A1Fa494EC906cE90E9f37563A8AF630e;
        feedAddress["btc_vs_usd"]=0xECe365B379E1dD183B20fc5f022230C044d51404;
        feedAddress["eur_vs_usd"]=0x78F9e60608bF48a1155b4B2A5e31F32318a1d85F;
        feedAddress["usdc_vs_eth"]=0xdCA36F27cbC4E38aE16C4E9f99D39b42337F6dcf;
        feedAddress["dai_vs_usd"]=0x2bA49Aaa16E6afD2a993473cfB70Fa8559B523cF;
        feedAddress["dai_vs_eth"]=0x74825DbC8BF76CC4e9494d0ecB210f676Efa001D;
        feedAddress["sdefi_vs_usd"]=0x0630521aC362bc7A19a4eE44b57cE72Ea34AD01c;
        feedAddress["snx_vs_usd"]=0xE96C4407597CD507002dF88ff6E0008AB41266Ee;
        }

    }


    // a creator create a new battle
    function addBattle(string memory betType,uint betDate,bool direction) public payable {
        require(msg.value>0, "You have to bet on positive value!");
        battleInfo[battleId]=Battle(msg.sender,msg.sender,msg.value,betType,betDate,direction,age.getThePrice(feedAddress[betType]),3);
        emit AddEvent(battleId,msg.sender);
        battleId++;
    }

    // get information about battle number: battle_id
    function getBattleInfo(uint256 battle_id) public payable returns(Battle memory) {
        Battle storage bate=battleInfo[battle_id];
        require(bate.amountBet>0, "This battle isn't exist.\n");
        return battleInfo[battle_id];
    }

    // get all the battles for statistics
    function getAll() public view returns (Battle[] memory){
            Battle[] memory ret = new Battle[](battleId);
            for (uint i = 0; i < battleId; i++) {
                ret[i] = battleInfo[i];
            }
            return ret;
        }

    // an opponent is signed to battle number: battle_id
    function acceptBattle(uint256 battle_id) public payable{

        Battle storage bate=battleInfo[battle_id];
        require(bate.amountBet>0, "Battle number isn't exist.\n");
        //require(bate.creator!=msg.sender, "Impossible to fight against yourself.");
        require(bate.creator==bate.opponent, "This battle is closed, opponent already exist.");
        require(msg.value==bate.amountBet, "Betting value isn't as specified for this battle.");
        bate.opponent=msg.sender;
    }

    // a creator cancels his battle
    function cancelBattle(uint256 battle_id) public payable{
        Battle memory bate=battleInfo[battle_id];
        require(bate.amountBet>0, "This battle isn't exist.");
        require(bate.creator==msg.sender, "Only the creator may cancel his own battle.");
        require(bate.creator==bate.opponent, "There is already opponent, this battle can't be canceled.");
        payable(bate.creator).transfer(bate.amountBet); // return the amount which was invested
        delete battleInfo[battle_id]; // battle is canceled
    }

    // the winner may draw his money
    function withdraw(uint256 battle_id) public {
        int winner; // 0=lose 1=win 2=draw
        int oldPrice;
        int newPrice;
        Battle storage bate=battleInfo[battle_id];
        //require(battleInfo[battle_id].creator!=battleInfo[battle_id].opponent, "This battle didn't start."); // in case the creator try to withdraw before having opponent. He may use cancel function if he wants.
        //require((bate.creator==msg.sender||bate.opponent==msg.sender), "You are not part of this battle.");
        require(block.timestamp>=bate.betDate, "Too early to check who is the winner.");
        //require(bate.whoWin==3, "Withdrawn already.");
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
        else {
            winner=2;
            payable(bate.opponent).transfer(bate.amountBet);
            payable(bate.creator).transfer(bate.amountBet);
        }
        bate.whoWin=winner;
    }

}