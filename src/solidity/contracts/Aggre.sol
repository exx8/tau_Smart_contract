// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

// TODO: implement the code from: https://docs.chain.link/docs/get-the-latest-price/. Works on Remix only.
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