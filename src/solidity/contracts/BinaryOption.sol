// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;
import "./PriceFeed.sol";

contract BinaryOption{

    uint256 public battleId; // unique id for each battle
    mapping(uint256 => Battle) public battleInfo; // map of id to battle
    mapping(address => uint256[]) public addressToBattle; // map of address to relevant battle id's
    mapping(string => address) public feedAddress; // map of addresses for the price feeds
    PriceFeed public priceFeed;
    uint256 maxNumOfBattles = 10; // maximum of allowed parallel battles for a user
    uint256 historyWindow = 10; // how many battles are used for the statistics
    uint256 battleFreeSpace = 1000; // represent a free entry
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
        // if creator==opponent it means that the battle hasn't been accepted by anyone (as no one can battle himself).
        uint256 amountBet;
        string betType;
        uint betDate;
        bool isUp;
        int currVal;
        Status whoWin;
    }


    constructor()  {
        priceFeed = new PriceFeed();
        bool isKovan = true; // true if kovan, otherwise rinkeby
        //owner = msg.sender;
        if (isKovan){
            feedAddress["eth_vs_usd"] = 0x9326BFA02ADD2366b30bacB125260Af641031331;
            feedAddress["btc_vs_usd"] = 0x6135b13325bfC4B00278B4abC5e20bbce2D6580e;
            feedAddress["eur_vs_usd"] = 0x0c15Ab9A0DB086e062194c273CC79f41597Bbf13;
            feedAddress["usdc_vs_eth"] = 0x64EaC61A2DFda2c3Fa04eED49AA33D021AeC8838;
            feedAddress["dai_vs_usd"] = 0x777A68032a88E5A84678A77Af2CD65A7b3c0775a;
            feedAddress["dai_vs_eth"] = 0x22B58f1EbEDfCA50feF632bD73368b2FdA96D541;
            feedAddress["sdefi_vs_usd"] = 0x70179FB2F3A0a5b7FfB36a235599De440B0922ea;
            feedAddress["snx_vs_usd"] = 0x31f93DA9823d737b7E44bdee0DF389Fe62Fd1AcD;
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

    function initArray(address target, uint256 battle_id) public {
        if (!(addressToBattle[target].length > 0)){
           addressToBattle[target] = [battle_id];
           for (uint i = 1; i < maxNumOfBattles; i++){
               addressToBattle[target].push(battleFreeSpace);
           }
        } else {
               for (uint i = 0; i < maxNumOfBattles; i++){
                  if (addressToBattle[target][i] == battleFreeSpace){
                     addressToBattle[target][i] = battle_id;
                     break;
                  }
               }
        }
    }

    // a creator create a new battle
    function addBattle(string memory betType, uint betDate,bool direction) public payable {
        uint256 tempId = battleId;
        require(msg.value > 0, "you have to bet on positive value!");
        // doesn't play more than maxNumOfBattles games simultaneously
        require (hasFreeEntry(addressToBattle[msg.sender]), "too many battles" );
        battleInfo[battleId] = Battle(msg.sender,msg.sender,msg.value,betType,betDate,direction,
        priceFeed.getThePrice(feedAddress[betType]), Status.NotOver);
        emit AddEvent(tempId, msg.sender);
        initArray(msg.sender, tempId);
        battleId++;
    }

    // return relevant battle id's to withdraw
    function getaddressToBattle(address a) public view returns(uint256[] memory) {
        return addressToBattle[a];
    }

    // return battle's info
    function getBattleInfo(uint256 battle_id) public view returns(Battle memory) {
        Battle storage bate = battleInfo[battle_id];
        require(bate.amountBet > 0, "this battle isn't exist.\n");
        return battleInfo[battle_id];
    }

    // get statistics to display
    function getAll() public view returns (Battle[] memory){
            uint256 lastIndex = battleId;
            uint256 firstIndex = 0;
            if (lastIndex >= historyWindow){
                firstIndex = lastIndex - historyWindow;
            }
            uint256 viewRange = lastIndex - firstIndex;
            Battle[] memory ret = new Battle[](viewRange);
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
        require(bate.creator == bate.opponent, "this battle is closed, opponent already exist."); //this is how we simbolize that hasn't been accepted by any.
        require(msg.value == bate.amountBet, "betting value isn't as specified for this battle.");
        // doesn't play more than maxNumOfBattles games simultaneously
        require (hasFreeEntry(addressToBattle[msg.sender]), "too many battles" );
        bate.opponent = msg.sender;
        initArray(msg.sender, battle_id);
    }


    // a creator cancels his battle
    function cancelBattle(uint256 battle_id) public {
        Battle memory bate = battleInfo[battle_id];
        require(bate.amountBet > 0, "this battle isn't exist."); // avoid reentry vulnerability
        require(bate.creator == bate.opponent, "there is already opponent, this battle cant be canceled.");
        payable(bate.creator).transfer(bate.amountBet); // return the amount which was invested
        address creator = bate.creator;
        for (uint i = 0; i < maxNumOfBattles; i++){
            if (addressToBattle[creator][i] == battle_id){
                addressToBattle[creator][i] = battleFreeSpace;
                break;
            }
        }
        delete battleInfo[battle_id]; // battle is canceled
    }

    // the winner may draw his money
    function withdraw(uint256 battle_id) public {
        Status winner;
        int oldPrice;
        int newPrice;
        Battle storage bate=battleInfo[battle_id];
        uint betDateSecond = bate.betDate / 1000; // dividing by 1000 to convert milliseconds to seconds
        require(bate.creator != bate.opponent, "this battle didnt start."); // in case the creator try to withdraw before having opponent. He may cancel battle if he wants.
        require((bate.creator == msg.sender || bate.opponent == msg.sender), "you are not part of this battle.");
        require(block.timestamp >= betDateSecond, "too early to check who is the winner.");
        require(bate.whoWin == Status.NotOver, "withdraw already.");
        oldPrice = bate.currVal;
        newPrice = priceFeed.getThePrice(feedAddress[bate.betType]);
        // deliver the money to the winner
        if (oldPrice < newPrice){

            if (bate.isUp){
                winner = Status.Creator;
                payable(bate.creator).transfer(2 * bate.amountBet); // multiply by 2 since we deliver the money of both the creator and his opponent
            }
            else {
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
            if (addressToBattle[creator][i] == battle_id){
                addressToBattle[creator][i] = battleFreeSpace;
                break;
            }
        }
        for (uint i = 0; i < maxNumOfBattles; i ++){
             if (addressToBattle[opponent][i] == battle_id){
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
