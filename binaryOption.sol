pragma solidity ^0.6.1;

import "https://github.com/smartcontractkit/chainlink/evm-contracts/src/v0.6/ChainlinkClient.sol";

contract BinaryOption is ChainlinkClient{


    uint256  public battleId; // unique id for each battle
    mapping(uint256 => Battle) public battleInfo; // map of the existing battles
    mapping(bytes32=>uint256) public requests;
    address public owner; // the creator of the contract (we)
    mapping(string=>Query) public queries;
    uint256  public myPrice;

    struct Battle {
        address creator;
        address opponent;
        uint256 amountBet;
        string betType;
        uint256 betDate;
        bool isUp;
        uint256 currVal;
    }

    struct Query{
        string jobId;
        string json;
        string path;
    }

    constructor() public {

        // Set the address for the LINK token for the network
        setPublicChainlinkToken();
        owner = msg.sender;
        // the jobId here correspond to the Rinkbey testnet
        queries["Dollar"]=Query("4ebf9e0c60d6461cb8a894c0f00ee6b0","https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD","USD");
    }



    // get the current value of the dollar
    function requestEthereumPrice(string memory currency, uint256 battleId)
      public

    {
      // newRequest takes a JobID, a callback address, and callback function as input
      Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(queries[currency].jobId), address(this), this.fulfill.selector);
      // Adds a URL with the key "get" to the request parameters
      req.add("get",queries[currency].json);
      // Uses input param (dot-delimited string) as the "path" in the request parameters
      req.add("path", queries[currency].path);
      // Adds an integer with the key "times" to the request parameters
      req.addInt("times", 100);

      // Sends the request with the amount of payment specified to the oracle. The oracle address here correspond to Rinkbey testnet
        bytes32 temp=sendChainlinkRequestTo(address(0x3872E83cccbAA450108bb3DcadcC37b5dBFD2809), req, 1000000000000000000);
        requests[temp]=battleId;
    }

    // fulfill receives a uint256 data type
    function fulfill(bytes32 _requestId, uint256 _price)
      public
      // Use recordChainlinkFulfillment to ensure only the requesting oracle can fulfill
      recordChainlinkFulfillment(_requestId){

        uint256 battleId=requests[_requestId];
        delete requests[_requestId];

        battleInfo[battleId].currVal = _price;
    }


    // a creator create a new battle
    function addBattle(string memory betType,uint256 betDate,bool isUp ) public payable returns(uint){
        require(msg.value>0, "You have to bet on positive value!\n");
        battleInfo[battleId]=Battle(msg.sender,msg.sender,msg.value,betType,block.timestamp+betDate,isUp,0);
        requestEthereumPrice(betType,battleId);

        return battleId++; // to be sent to the creator so he will pass it to optionaly opponents, so they will know to which battle to send their money
    }

    function getIndex(uint256 battleId) public view returns (uint256){
        return battleInfo[battleId].betDate;
    }

    function getId() public view returns (uint256){
        return battleId;
    }


    // an opponent is signed to battle number: battleid
    function acceptBattle(uint256 battleId) public payable{
        require(battleInfo[battleId].amountBet>0, "Battle number isn't exist.\n");
        require(battleInfo[battleId].creator!=msg.sender, "Impossible to fight against yourself.\n");
        require(battleInfo[battleId].creator==battleInfo[battleId].opponent, "This battle is closed, opponent already exist.\n");
        require(msg.value==battleInfo[battleId].amountBet, "Betting value isn't as specified for this battle.\n");
        battleInfo[battleId].opponent=msg.sender;
        return;
    }

    // a creator cancel his battle
    function cancelBattle(uint256 battleId) public payable{
        address payable temp;
        require(battleInfo[battleId].amountBet>0, "Battle number isn't exist.\n");
        require(battleInfo[battleId].creator==msg.sender, "Only the creator may cancel his own battle.\n");

        require(battleInfo[battleId].creator==battleInfo[battleId].opponent, "There is already opponent, this battle can't be canceled.\n");
        temp=address(uint160(battleInfo[battleId].creator));
        temp.transfer(2*battleInfo[battleId].amountBet);
        //payable(battleInfo[battleId].creator).transfer(battleInfo[battleId].amountBet); // return the amount invested
        delete battleInfo[battleId]; // battle is canceled
    }

    // the winner may draw his money
    function withdraw(uint256 battleId) public{
        uint256 oldPrice;
        uint256 newPrice;
        address payable temp;

        require(battleInfo[battleId].amountBet>0, "Battle number isn't exist.\n");
        require(block.timestamp>=battleInfo[battleId].betDate, "Too early to check who is the winner.\n");

        oldPrice=battleInfo[battleId].currVal;
        //requestEthereumPrice("Dollar",battleId);
        newPrice=battleInfo[battleId].currVal;
        // deliver the money to the winner
        if(oldPrice<newPrice){
            if(battleInfo[battleId].isUp){
                temp=address(uint160(battleInfo[battleId].creator));
                temp.transfer(2*battleInfo[battleId].amountBet);
                //payable(battleInfo[battleId].creator).transfer(2*battleInfo[battleId].amountBet); // multiply by 2 since we deliever the money of both the creator and his opponent
            }
            else{
                temp=address(uint160(battleInfo[battleId].opponent));
                temp.transfer(2*battleInfo[battleId].amountBet);
                //payable(battleInfo[battleId].opponent).transfer(2*battleInfo[battleId].amountBet);
            }

        }
        else if(oldPrice>newPrice){
            if(battleInfo[battleId].isUp){
                temp=address(uint160(battleInfo[battleId].opponent));
                temp.transfer(2*battleInfo[battleId].amountBet);
                //payable(battleInfo[battleId].opponent).transfer(2*battleInfo[battleId].amountBet);
            }
            else{
                temp=address(uint160(battleInfo[battleId].creator));
                temp.transfer(2*battleInfo[battleId].amountBet);
                //payable(battleInfo[battleId].creator).transfer(2*battleInfo[battleId].amountBet);
            }
        }
        // if nothing has changed, the creator lose his money
        else {
            temp=address(uint160(battleInfo[battleId].opponent));
            temp.transfer(2*battleInfo[battleId].amountBet);
            //payable(battleInfo[battleId].opponent).transfer(2*battleInfo[battleId].amountBet);
        }
        delete battleInfo[battleId]; // battle is finished
    }

    //just for testing
    function removeBattle(uint256 battleId) public payable{
        require(battleInfo[battleId].amountBet>0, "Battle number isn't exist.\n");
        delete battleInfo[battleId]; // battle is canceled
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