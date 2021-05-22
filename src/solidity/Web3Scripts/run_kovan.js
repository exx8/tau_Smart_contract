/* eslint-disable no-unused-vars */

const Web3=require('web3');
const BinaryOption= require('../build/contracts/BinaryOption.json');
const HDWalletProvider=require('@truffle/hdwallet-provider');
const address='0xDEdbf82289edB28763463D1FF482a9A94604E6dc';
const privateKey="0xccc943d4061cda10d3c617ff06234810fd195598851774f0c6359e086d31660f";
let result=0;
let web3=null;
let provider=null;
let contract=null;
let addresses=null;
const init= async function(provide,from=address) {


	//provider=new HDWalletProvider({privateKeys:[privateKey],providerOrUrl:"https://kovan.infura.io/v3/423c508011d14316b04a4ebbf33b0634",chainId:42});
	web3=new Web3(provide);
	try{
	contract= new web3.eth.Contract(
	BinaryOption.abi,
	//deployedNetwork.address
	);
	console.log('before deploy');
	//estimated_gas=web3.eth.estimateGas({data:BinaryOption.bytecode}).then(console.log);
	let nonce=await web3.eth.getTransactionCount(from);

    	contract=await contract.deploy({data: BinaryOption.bytecode})
    	.send({from: from, gas: 2400000, gasPrice: '20000000000',nonce});
    console.log('after deploy');
	}

	catch(e){
    	console.log('caught');

        	console.log(e);
    	}

}

  export async function addBattle(battle_type, expire_time, winner, val,provide, from = address)  {
	await init(provide,from);

    try{
	await contract.methods.addBattle(battle_type,expire_time,winner).send({
		from: from,
		value:val
	});
	console.log('addBattle passed!');
	}
	catch(e){
	console.log('caught');
	const data=e.data;
        console.log(e);
	}
}

export async function acceptBattle(id,val,provide,from = address)  {
	await init(provide,from);

    try{
	await contract.methods.acceptBattle(id).send({
	from: address,
	value:val
	});
	console.log('acceptBattle passed!');
	}
	catch(e){
    const data=e.data;

    console.log(e);
    }

}

const withdraw= async function(id,provide,from = address) {
	await init(provide,from);
    try{
	const receipt=await contract.methods.withdraw(id).send({
		from: from
	});
	const res=await web3.eth.getBlockNumber();
	result=await contract.getPastEvents('MyEvent',{filter:{id: 1},fromBlock: res-2, toBlock: res});
            console.log(result[0].returnValues.id);
	}
    catch(e){
    const data=e.data;
    const txHash = Object.keys(data)[0];
    const reason = data[txHash].reason;
    console.log(reason); // the text in the require method, can be used for the frontend
    }

}

const cancelBattle= async function(id,val,provide,from = address) {
	await init(provide,from);

    try{
	await contract.methods.cancelBattle(id).send({
		from: from,
		value:val
	});
	}
	catch(e){
    const data=e.data;
    const txHash = Object.keys(data)[0];
    const reason = data[txHash].reason;
    console.log(reason);
    }

}

const getEvent= async function(provide,from = address) {
	await init(provide,from);

    try{
	const res=await web3.eth.getBlockNumber();
    result=await contract.getPastEvents('MyEvent',{filter:{id: 1},fromBlock: res-5, toBlock: res});
    console.log(result[0].returnValues.id);

	}
	catch(e){
    const data=e.data;
        const txHash = Object.keys(data)[0];
        const reason = data[txHash].reason;
        console.log(reason);

    }

}

const getPrice= async function(provide,from = address)  {
	await init(provide,from);
    try{
    await contract.methods.setPrice().send({
            		from: from
            	});
        const result=await contract.methods.getPrice().call();
        console.log("price value:"+result);
    	}
    	catch(e){
    	console.log('caught');
    	const data=e.data;

        	console.log(e);
    	}
}

const getId= async function(provide,from = address)  {
	await init(from);

    try{
	const result=await contract.methods.getId().call();
	console.log(result);
	}
	catch(e){
	console.log('caught');
        console.log(e);
	}
}
//getId();
//getPrice();
//addBattle("EthVsUsd",15,false,'50000');
//acceptBattle(0,'500000');
//addBattle("EthVsUsd",10,false,'50000');
//acceptBattle(1,'500000');
//withdraw(0);
//getEvent();