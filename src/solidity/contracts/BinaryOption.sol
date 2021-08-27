// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;
import "./PriceFeed.sol";

contract BinaryOption{

    uint256 public battleId; // unique id for each battle
    mapping(uint256 => Battle) public battleInfo; // map of the existing battles
    mapping(address => uint256[]) public addressToBattle; // map of relevant battles
    mapping(string => address) public feedAddress; // map of addresses for the price feeds
    PriceFeed public priceFeed;
    //int public b = 2;
    uint256 maxNumOfBattles = 3;
    uint256 historyWindow = 2;
    uint256 battleFreeSpace = 100;
    //address owner;

    event AddEvent(
    uint256 indexed id,
    address address_field
    );

    enum Status {
            Opponent,
            Creator,
            Draw,
            NotOver
        }

    struct Battle {
        address creator;
        address opponent;
        uint256 amountBet;
        string betType;
        uint betDate;
        bool isUp;
        int currVal;
        Status whoWin;
    }


    constructor()  {
        priceFeed = new PriceFeed();
        bool isKovan = false; // true if kovan, otherwise rinkeby
        //owner = msg.sender;
        if (isKovan){
        feedAddress["EthVsUsd"] = 0x9326BFA02ADD2366b30bacB125260Af641031331;
        }
        else {
        // those addresses (of rinkbey test network) can be found at: https://docs.chain.link/docs/ethereum-addresses/
        feedAddress["eth_vs_usd"] = 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e;
        feedAddress["btc_vs_usd"] = 0xECe365B379E1dD183B20fc5f022230C044d51404;
        feedAddress["eur_vs_usd"] = 0x78F9e60608bF48a1155b4B2A5e31F32318a1d85F;
        feedAddress["usdc_vs_eth"] = 0xdCA36F27cbC4E38aE16C4E9f99D39b42337F6dcf;
        feedAddress["dai_vs_usd"] = 0x2bA49Aaa16E6afD2a993473cfB70Fa8559B523cF;
        feedAddress["dai_vs_eth"] = 0x74825DbC8BF76CC4e9494d0ecB210f676Efa001D;
        feedAddress["sdefi_vs_usd"] = 0x0630521aC362bc7A19a4eE44b57cE72Ea34AD01c;
        feedAddress["snx_vs_usd"] = 0xE96C4407597CD507002dF88ff6E0008AB41266Ee;
        }

    }
       /*function getB() public view returns (int){
          return b;
       }

       function getList(address a) public view returns (uint256[] memory){
          return addressToBattle[a];
       }*/

    function hasFreeEntry(uint256[] memory battles) public view returns (bool){
        if (!(battles.length > 0)){
            return true;
        }
        for (uint i = 0; i < maxNumOfBattles; i++){
            if (battles[i] == battleFreeSpace){
                return true;
            }
        }
        return false;
    }

    // a creator create a new battle
    function addBattle(string memory betType,uint betDate,bool direction) public payable {
        require(msg.value > 0, "you have to bet on positive value!");
        // doesn't play more than 3 games simultaneously
        require (hasFreeEntry(addressToBattle[msg.sender]), "too many battles" );
        battleInfo[battleId] = Battle(msg.sender,msg.sender,msg.value,betType,betDate,direction,
        priceFeed.getThePrice(feedAddress[betType]), Status.NotOver);
        emit AddEvent(battleId, msg.sender);
        if (!(addressToBattle[msg.sender].length > 0)){
        //b = 1;
        addressToBattle[msg.sender] = [battleId, battleFreeSpace, battleFreeSpace]; // battleFreeSpace signs empty entry. -1 doesn't work
        } else {
            //b = 0;
            for(uint i = 0; i < maxNumOfBattles; i++){
                if (addressToBattle[msg.sender][i] == battleFreeSpace){
                    addressToBattle[msg.sender][i] = battleId;
                    break;
                }
            }
        }
        battleId++;
    }

    function getaddressToBattle(address a) public view returns(uint256[] memory) {
        return addressToBattle[a];
    }

    function getBattleInfo(uint256 battle_id) public returns(Battle memory) {
        Battle storage bate = battleInfo[battle_id];
        require(bate.amountBet > 0, "this battle isn't exist.\n");
        return battleInfo[battle_id];
    }

    function getAll() public view returns (Battle[] memory){
            uint256 lastIndex = battleId;
            uint256 firstIndex = 0;
            if (lastIndex >= historyWindow){
                firstIndex = lastIndex - historyWindow;
            }
            uint256 viewRange = lastIndex - firstIndex;
            //b = 1;
            Battle[] memory ret = new Battle[](viewRange);
            //b = 0;
            uint j = 0;
            for (uint i = firstIndex; i < lastIndex; i++) {
                ret[j] = battleInfo[i];
                j += 1;
            }
            return ret;
    }

    // an opponent is signed to battle number: battle_id
    function acceptBattle(uint256 battle_id) public payable{

        Battle storage bate = battleInfo[battle_id];
        require(bate.amountBet > 0, "battle number isn't exist.\n");
        require(bate.creator != msg.sender, "impossible to fight against yourself.");
        require(bate.creator == bate.opponent, "this battle is closed, opponent already exist.");
        require(msg.value == bate.amountBet, "betting value isn't as specified for this battle.");
        // doesn't play more than maxNumOfBattles games simultaneously
        require (hasFreeEntry(addressToBattle[msg.sender]), "too many battles" );
        bate.opponent = msg.sender;
        if (!(addressToBattle[msg.sender].length > 0)){
            addressToBattle[msg.sender] = [battle_id, battleFreeSpace, battleFreeSpace];
        } else {
            for(uint i = 0; i < maxNumOfBattles; i++){
                if (addressToBattle[msg.sender][i] == battleFreeSpace){
                    addressToBattle[msg.sender][i] = battle_id;
                    break;
                }
            }
        }
    }


    // a creator cancels his battle
    function cancelBattle(uint256 battle_id) public {
        Battle memory bate = battleInfo[battle_id];
        require(bate.amountBet > 0, "this battle isn't exist.");
        //require(bate.creator == msg.sender, "only the creator may cancel his own battle.");
        require(bate.creator == bate.opponent, "there is already opponent, this battle cant be canceled.");
        payable(bate.creator).transfer(bate.amountBet); // return the amount which was invested
        address creator = bate.creator;
        for (uint i = 0; i < maxNumOfBattles; i++){
            if(addressToBattle[creator][i] == battle_id){
                addressToBattle[creator][i] = battleFreeSpace;
                break;
            }
        }
        delete battleInfo[battle_id]; // battle is canceled
    }

    // the winner may draw his money
    function withdraw(uint256 battle_id) public {
        Status winner; // 0 = lose 1 = win 2 = draw
        int oldPrice;
        int newPrice;
        Battle storage bate=battleInfo[battle_id];
        uint betDateSecond = bate.betDate / 1000; // divide by 1000 to convert milliseconds to seconds
        require(bate.creator != bate.opponent, "this battle didnt start."); // in case the creator try to withdraw before having opponent. He may cancel battle if he wants.
        require((bate.creator == msg.sender || bate.opponent == msg.sender), "you are not part of this battle.");
        require(block.timestamp >= betDateSecond, "too early to check who is the winner.");
        require(bate.whoWin == Status.NotOver, "withdraw already.");
        oldPrice = bate.currVal;
        newPrice = priceFeed.getThePrice(feedAddress[bate.betType]);
        // deliver the money to the winner
        if(oldPrice < newPrice){

            if (bate.isUp){
                winner = Status.Creator;
                payable(bate.creator).transfer(2 * bate.amountBet); // multiply by 2 since we deliver the money of both the creator and his opponent
            }
            else{
                winner = Status.Opponent;
                payable(bate.opponent).transfer(2*bate.amountBet);
            }

        }
        else if (oldPrice > newPrice){

            if (bate.isUp){
                winner = Status.Opponent;
                payable(bate.opponent).transfer(2 * bate.amountBet);
            }
            else {
                winner = Status.Creator;
                payable(bate.creator).transfer(2*bate.amountBet);
            }
        }

        else {
            winner = Status.Draw;
            payable(bate.opponent).transfer(bate.amountBet);
            payable(bate.creator).transfer(bate.amountBet);
        }

        bate.whoWin = winner;
        address creator = battleInfo[battle_id].creator;
        address opponent = battleInfo[battle_id].opponent;
        for (uint i = 0; i < maxNumOfBattles; i ++){
            if(addressToBattle[creator][i] == battle_id){
                addressToBattle[creator][i] = battleFreeSpace;
                break;
            }
        }
        for (uint i = 0; i < maxNumOfBattles; i ++){
             if(addressToBattle[opponent][i] == battle_id){
                addressToBattle[opponent][i] = battleFreeSpace;
                break;
             }
        }
    }

    /*function cleanBattles() public{
        require(msg.sender == owner, "only the owner may delete battles");
        uint256 numOfBattles = battleId;
        for (uint i = 0; i <numOfBattles; i++){
            // delete battle only if is finished
            if (battleInfo[i].currVal > 0 && battleInfo[i].whoWin != Status.NotOver){
                delete battleInfo[i];
            }
        }
    }*/
}