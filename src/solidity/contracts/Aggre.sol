// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

// TODO: implement the code from: https://docs.chain.link/docs/get-the-latest-price/. Works on Remix only.
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";


contract Aggre{

    /*function getThePrice(address a) public view returns (int) {
        (,int price,,,) = AggregatorV3Interface(a).latestRoundData();
        return price;
    }*/

    function PriceByRound(address a, uint date) public view returns (int) {
         uint80 lastRound=getLastRound(a);
         (int price, uint timestamp)=getHistoricalPrice(address a, binarySearchId(a,date ,lastRound-(20), lastRound));
         return price;
    }

    function getLastRound(address a) public view returns (uint80) {
            (uint80 roundId,,,,) = AggregatorV3Interface(a).latestRoundData();
            return roundId;
    }

    function getHistoricalPrice(address a, uint80 roundId) public view returns ((int,uint)) {
            (
                ,
                int price,
                ,
                uint timeStamp,

            ) = AggregatorV3Interface(a).getRoundData(roundId);
            //require(timeStamp > 0, "Round not complete");
            return (price,timestamp);
        }

    function binarySearchId(address a,uint date, uint80 bottom, uint80 top) returns(uint80){
        if(top<=bottom){
            return bottom;
        }
        uint80 mid=(top-bottom)/2;
        (uint before, int priceBefore)=getHistoricalPrice(a, mid);
        (uint after, int priceAfter)=getHistoricalPrice(a, mid+1);
        if(before<date&& after>date){
        return mid;
        }

        else if(before<date){
        return binarySearch(a,date,bottom,mid-1);
        }
        else{
        return binarySearch(a,date,mid+1,top);
        }



    }





}