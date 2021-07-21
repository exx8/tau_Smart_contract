// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

// TODO: implement the code from: https://docs.chain.link/docs/get-the-latest-price/. Works on Remix only.
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";


contract Aggre{

    function getThePrice(address a) public view returns (int) {
        (,int price,,,) = AggregatorV3Interface(a).latestRoundData();
        return price;
    }
    function getTheRoundId(address a) public view returns (uint80) {
        (uint80 roundId,,,,) = AggregatorV3Interface(a).latestRoundData();
        return roundId;
    }

    /*function getHistoricalPrice(address a,uint80 roundId) public view returns (uint) {
            (
                uint80 id,
                int price,
                uint startedAt,
                uint timeStamp,
                uint80 answeredInRound
            ) = AggregatorV3Interface(a).getRoundData(roundId);
            require(timeStamp > 0, "Round not complete");
            return timeStamp;
        }*/

    /*function priceIncrementalSearch(address a) public view returns (int) {
        (,int price,,,) = AggregatorV3Interface(a).latestRoundData();
        return price;
    }

    function priceBinarySearch(address a) public view returns (int) {
        (uint80 roundId,,,,) = AggregatorV3Interface(a).latestRoundData();
        return binarySearch(a,roundId-20,roundId);
    }

    function binarySearch(address a,uint80 bottom, uint80 top){
        if(top-bottom<=1){
        return AggregatorV3Interface(a).getRoundData(top);
        }
        uint80 mid=(top-bottom)/2;
        if(AggregatorV3Interface(a).getRoundData(mid)<myDate&&AggregatorV3Interface(a).getRoundData(mid+1)>=myDate)
            return AggregatorV3Interface(a).getRoundData(mid+1);
    }
    */


}