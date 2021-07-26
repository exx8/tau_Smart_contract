//import {p} from './solidity/web3scripts/run_kovan.js';
const m=require('./solidity/web3scripts/run_kovan.js');

// verify that battle got deleted after withdraw
m.init();
setTimeout(function(){
    m.addBattle("EthVsUsd",90,false,'50000');
},40000);
setTimeout(function(){
    m.getAmount(0);
},80000);
setTimeout(function(){
    m.acceptBattle(0,'50000');
},100000);
setTimeout(function(){
    m.withdraw(0);
},120000);
