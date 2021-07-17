
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
	'0x8C7d86514a71e4Fb9Cfe7f9CBFD465be84a64bb0' // The address of the deployed smart contract. Can be seen in /build/BinaryOption.json
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

const addBattle= async function (battle_type, expire_time, winner, val,provide, from = address)  {
	await init(provide,from);

    try{
    let nonce=await web3.eth.getTransactionCount(from); // still need to deal with the nonce issue, since now we do not deploy here
	await contract.methods.addBattle(battle_type,expire_time,winner).send({
		from: from,
		value:val
	});
	console.log('addBattle passed!');
	const r=await contract.methods.getAmount(0).call();
	console.log('This battle is on '+ r+' weis');
	}
	catch(e){
	console.log('caught addBattle');
	const index=e.message.indexOf("0");
    console.log(e.message.substring(20,index-1));
	}
}

const acceptBattle= async function (id,val,provide,from = address)  {
	await init(provide,from);
    try{
    let nonce=await web3.eth.getTransactionCount(from);
	await contract.methods.acceptBattle(id).send({
	from: address,
	value:val
	});
	console.log('acceptBattle passed!');
	}
	catch(e){
	console.log('caught acceptBattle');
    const index=e.message.indexOf("0");
    console.log(e.message.substring(20,index-1));
    }
}

const withdraw= async function (identifier,provide,from = address) {
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
	if (winner==0)
	    console.log('You lost ' +result[0].returnValues.amount+' in battle: '+identifier);
	else{
	if(winner==1)
	    console.log('You won ' +result[0].returnValues.amount+' in battle: '+identifier);
	else
	    console.log('There was draw in battle: '+identifier);
	}
	}
    catch(e){
    console.log('caught withdraw');
    const index=e.message.indexOf("0");
    console.log(e.message.substring(20,index-1));
    //console.log(e.message);
    }

}

const cancelBattle= async function(id,provide,from = address) {
	await init(provide,from);

    try{
	await contract.methods.cancelBattle(id).send({
		from: from
	});
	console.log('cancel passed!');
	}
	catch(e){
    console.log('caught cancel');
    const index=e.message.indexOf("0");
    console.log(e.message.substring(20,index-1));
    }

}
const getId= async function(provide,from = address){
await init(provide,from);
try{
    let nonce=await web3.eth.getTransactionCount(from);
	const result=await contract.methods.getId().call();
	console.log(result);
	}
	catch(e){
	console.log('caught getId');
        const index=e.message.indexOf("0");
        console.log(e.message.substring(20,index-1));
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
    	console.log('caught getPrice');
    	const data=e.data;

        	console.log(e);
    	}
}

/* get the value the winner will take from battle index */
const getAmount= async function(index,provide,from = address)  {
	await init(provide,from);

    try{
    let nonce=await web3.eth.getTransactionCount(from);
	const result=await contract.methods.getAmount(index).call();
	console.log(result);
	}
	catch(e){
	console.log('caught getAmount');
    console.log(e);
	}
}

module.exports={init,addBattle,acceptBattle,withdraw,getAmount,getId};