//import {addBattle} from '../run_kovan.js';
const myMethod=require('./solidity/web3scripts/run_kovan.js')

// cancel non exist battle
//await addBattle(0);
myMethod.addBattle("EthVsUsd",5,false,'10000')