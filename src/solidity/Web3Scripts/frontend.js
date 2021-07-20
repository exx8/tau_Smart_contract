import {EventData} from "web3-eth-contract";

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

const init=async function init(provide,from=address) {

	//provider=new HDWalletProvider({privateKeys:[privateKey],providerOrUrl:"https://rinkeby.infura.io/v3/c6212b31c70941ca847fa2a9237a3d1a",chainId:4});
	web3=new Web3(provide);
	//web3.eth.handleRevert =true;
	try{
	contract= new web3.eth.Contract(
	BinaryOption.abi,
	BinaryOption.networks["4"].address // The address of the deployed smart contract. Can be seen in /build/BinaryOption.json
	//deployedNetwork.address
	);
	console.log('before deploy');
	//estimated_gas=web3.eth.estimateGas({data:BinaryOption.bytecode}).then(console.log);
	//console.log(estimated_gas);

	}

	catch(e){
    	console.log('caught in init');
        const index=e.message.indexOf("0");

        console.log(e.message.substring(20,index-1));
    	}

}

export const addBattle= async function (battle_type, expire_time, winner, val,provide, from = address)  {
	await init(provide,from);

    try{
	let battleData=await contract.methods.addBattle(battle_type,expire_time,winner).send({
		from: from,
		value:val
	});
	console.log('addBattle passed!');
	return battleData;
	}
	catch(e){
	console.log('caught addBattle');
	const index=e.message.indexOf("0");
    console.log(e.message.substring(20,index-1));
	}
}

export const acceptBattle= async function (id,val,provide,from = address)  {
	await init(provide,from);
    try{
    let nonce=await web3.eth.getTransactionCount(from);
	await contract.methods.acceptBattle(id).send({
	from: address,
	value:val
	});
	console.log('acceptBattle passed!');
	return 'success';
	}
	catch(e){
	console.log('caught acceptBattle');
    const index=e.message.indexOf("0");
    console.log(e.message.substring(20,index-1));
    }
}

export const withdraw= async function (identifier,provide,from = address) {
	await init(provide,from);
    try{
    let nonce=await web3.eth.getTransactionCount(from);
	const receipt=await contract.methods.withdraw(identifier).send({
		from: from
	});
	console.log('withdraw passed!');
	const res=await web3.eth.getBlockNumber();
	result=await contract.getPastEvents('MyEvent',{filter:{id: identifier},fromBlock: res-2, toBlock: res});
	const winner=result[0].returnValues.win;
	let return_msg=null;
	if (winner==0){
	    return_msg='You lost ' +result[0].returnValues.amount+' in battle: '+identifier;
        	    }
	else{
	if(winner==1){
	    return_msg='You won ' +result[0].returnValues.amount+' in battle: '+identifier;
	    }
	else{
	    return_msg='There was draw in battle: '+identifier;

	    }
	}
	console.log(return_msg);
    return return_msg;
	}
    catch(e){
    console.log('caught withdraw');
    const index=e.message.indexOf("0");
    console.log(e.message.substring(20,index-1));
    return e.message.substring(20,index-1);
    }

}

const cancelBattle= async function(id,provide,from = address) {
	await init(provide,from);

    try{
	await contract.methods.cancelBattle(id).send({
		from: from
	});
	console.log('cancel passed!');
	return 'success';
	}
	catch(e){
    console.log('caught cancel');
    const index=e.message.indexOf("0");
    console.log(e.message.substring(20,index-1));
    return e.message.substring(20,index-1);
    }

}

export const getBattleInfo= async function (id ,provide, from = address)  {
	await init(provide,from);

    try{
    //let nonce=await web3.eth.getTransactionCount(from); // still need to deal with the nonce issue, since now we do not deploy here
	let battleList=await contract.methods.getBattleInfo(id).call();
	console.log('getBattleInfo passed!');
	return battleList;
	}
	catch(e){
	console.log('caught getBattleInfo');
	const index=e.message.indexOf("0");
    console.log(e.message.substring(20,index-1));
    return null;
	}
}

/*const getId= async function(provide,from = address){
await init(provide,from);
try{
	const result=await contract.methods.getId().call();
	console.log(result);
	return 'success';
	}
	catch(e){
	console.log('caught getId');
    const index=e.message.indexOf("0");
    console.log(e.message.substring(20,index-1));
    return e.message.substring(20,index-1);
	}
}

const getEvent= async function(provide,from = address) {
	await init(provide,from);

    try{
	const res=await web3.eth.getBlockNumber();
    result=await contract.getPastEvents('MyEvent',{filter:{id: 1},fromBlock: res-5, toBlock: res});
    console.log(result[0].returnValues.id);
    return 'success';
	}
	catch(e){
    const index=e.message.indexOf("0");
        console.log(e.message.substring(20,index-1));
        return e.message.substring(20,index-1);
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
        return 'success';
    	}
    	catch(e){
    	console.log('caught getPrice');
    	const index=e.message.indexOf("0");
            console.log(e.message.substring(20,index-1));
            return e.message.substring(20,index-1);
    	}
}

// get the value the winner will take from battle index
const getAmount= async function(index,provide,from = address)  {
	await init(provide,from);

    try{
    let nonce=await web3.eth.getTransactionCount(from);
	const result=await contract.methods.getAmount(index).call();
	console.log(result);
	return 'success';
	}
	catch(e){
	console.log('caught getAmount');
    const index=e.message.indexOf("0");
        console.log(e.message.substring(20,index-1));
        return e.message.substring(20,index-1);
	}
}*/



//module.exports={addBattle,acceptBattle,withdraw,getBattleInfo};