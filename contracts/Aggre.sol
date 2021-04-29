// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

// TODO: implement the code from: https://docs.chain.link/docs/get-the-latest-price/. Works on Remix only.
//import "https://github.com/smartcontractkit/chainlink/blob/develop/evm-contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";


contract Aggre{

    //AggregatorV3Interface internal priceFeed;

    /**
     * Network: Kovan
     * Aggregator: ETH/USD
     * Address: 0x9326BFA02ADD2366b30bacB125260Af641031331
     */
    constructor() public {

    }

    /**
     * Returns the latest price
     */
    function getThePrice(address a) public view returns (int) {

        return 2;
    }

}