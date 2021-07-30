// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;


import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";


contract Aggre{

    function getThePrice(address a) public view returns (int) {
        (
        ,
        int price,
        ,
        ,
        ) = AggregatorV3Interface(a).latestRoundData();
        return price;
    }

}