pragma solidity ^0.8.3;
import "./Aggre.sol";

contract BinaryOption{


uint256  public battleId; // unique id for each battle
    mapping(uint256 => Battle) public battleInfo; // map of the existing battles
    //mapping(bytes32=>uint256) public requests;
    mapping(string=>Query) public queries;
    address public owner; // the creator of the contract (we)
    uint  public tempVal;
    Aggre public age;
    
    struct Battle {
        address creator;
        address opponent;
        uint256 amountBet;
        string betType;
        uint betDate;
        bool isUp;
        int currVal;
    }

    struct Query{
        string jobId;
        string json;
        string path;
    }

    /**
     * Network: Kovan
     * Aggregator: ETH/USD
     * Address: 0x9326BFA02ADD2366b30bacB125260Af641031331
     */
    constructor() public {
        age=new Aggre();
        owner = msg.sender;
        // the jobId here correspond to the Rinkbey testnet
        queries["Dollar"]=Query("4ebf9e0c60d6461cb8a894c0f00ee6b0","https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD","USD");
    }

    /**
     * Returns the latest price
     */
    
    
    // a creator create a new battle
    function addBattle(string memory betType,uint betDate,bool direction) public payable {
        require(msg.value>0, "You have to bet on positive value!\n");
        battleInfo[battleId]=Battle(msg.sender,msg.sender,msg.value,betType,block.timestamp+betDate,direction,age.getThePrice());
		// here there is a problem of mutual exclution
		tempVal=battleId;
        battleId++; // to be sent to the creator so he will pass it to optionaly opponents, so they will know to which battle to send their money
    }
	
	function setIndex() public payable {
        tempVal= msg.value;
    }

    function getIndex(uint256 battle_id) public view returns (uint){
        return battleInfo[battle_id].betDate;
    }
    function getcurrVal(uint256 battle_id) public view returns (int){
        return battleInfo[battle_id].currVal;
    }

    function getId() public view returns (uint256){
        return battleId;
    }
	
	function settempVal(uint num) public {
        tempVal=num;
    }
	
	function gettempVal(uint num) public view returns (uint) {
        return tempVal;
    }


    // an opponent is signed to battle number: battleid
    function acceptBattle(uint256 battle_id) public payable{
        Battle storage bate=battleInfo[battle_id];
        require(bate.amountBet>0, "Battle number isn't exist.\n");
        require(bate.creator!=msg.sender, "Impossible to fight against yourself.\n");
        require(bate.creator==bate.opponent, "This battle is closed, opponent already exist.\n");
        require(msg.value==bate.amountBet, "Betting value isn't as specified for this battle.\n");
        bate.opponent=msg.sender;
		tempVal=9;
        
    }

    // a creator cancel his battle
    function cancelBattle(uint256 battle_id) public payable{
        Battle memory bate=battleInfo[battle_id];
        require(bate.amountBet>0, "Battle number isn't exist.\n");
        require(bate.creator==msg.sender, "Only the creator may cancel his own battle.\n");

        require(bate.creator==bate.opponent, "There is already opponent, this battle can't be canceled.\n");
        //temp=address(battleInfo[battle_id].creator);
        //temp.transfer(2*battleInfo[battle_id].amountBet);
        payable(bate.creator).transfer(bate.amountBet); // return the amount invested
        delete battleInfo[battle_id]; // battle is canceled
    }

    // the winner may draw his money
    function withdraw(uint256 battle_id) public {
		tempVal=7;
        int oldPrice;
        int newPrice;
        Battle memory bate=battleInfo[battle_id];
        require(bate.amountBet>0, "Battle number isn't exist.\n");
        require(block.timestamp>=bate.betDate, "Too early to check who is the winner.\n");
		require((bate.creator==msg.sender||bate.opponent==msg.sender), "You are not part of this battle.\n");
        oldPrice=bate.currVal;
        newPrice=age.getThePrice();
        // deliver the money to the winner
        if(oldPrice<newPrice){
		tempVal=5;
            if(bate.isUp){
                //temp=address(battleInfo[battle_id].creator);
                //temp.transfer(2*battleInfo[battle_id].amountBet);
                payable(bate.creator).transfer(2*bate.amountBet); // multiply by 2 since we deliever the money of both the creator and his opponent
            }
            else{
                //temp=address(battleInfo[battle_id].opponent);
                //temp.transfer(2*battleInfo[battle_id].amountBet);
                payable(bate.opponent).transfer(2*bate.amountBet);
            }

        }
        else if(oldPrice>newPrice){
		tempVal=4;
            if(bate.isUp){
                //temp=address(battleInfo[battle_id].opponent);
                //temp.transfer(2*battleInfo[battle_id].amountBet);
                payable(bate.opponent).transfer(2*bate.amountBet);
            }
            else{
                //temp=address(battleInfo[battle_id].creator);
                //temp.transfer(2*battleInfo[battle_id].amountBet);
                payable(bate.creator).transfer(2*bate.amountBet);
            }
        }
        // if nothing has changed, the creator lose his money
        else {
		tempVal=3;
            //temp=address(battleInfo[battle_id].opponent);
            //temp.transfer(2*battleInfo[battle_id].amountBet);
            payable(bate.opponent).transfer(2*bate.amountBet);
        }
        delete battleInfo[battle_id]; // battle is finished
    }

    //just for testing
    function removeBattle(uint256 battle_id) public {
        require(battleInfo[battle_id].amountBet>0, "Battle number isn't exist.\n");
        delete battleInfo[battle_id]; // battle is canceled
    }


    function stringToBytes32(string memory source) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }
        assembly { // solhint-disable-line no-inline-assembly
            result := mload(add(source, 32))
        }
    }
}