
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
const deployedAddress=BinaryOption;

const init=async function init(from=address) {

	provider=new HDWalletProvider({privateKeys:[privateKey],providerOrUrl:"https://rinkeby.infura.io/v3/c6212b31c70941ca847fa2a9237a3d1a",chainId:4});
	web3=new Web3(provider);
	//web3.eth.handleRevert =true;
	try{

	contract= new web3.eth.Contract(

	BinaryOption.abi,
	BinaryOption.networks["4"].address,
	//deployedNetwork.address
	);

	//estimated_gas=web3.eth.estimateGas({data:BinaryOption.bytecode}).then(console.log);
	//console.log(estimated_gas);
    //let nonce=await web3.eth.getTransactionCount(from);

    	//contract=await contract.deploy({data: BinaryOption.bytecode})
        //.send({from: from, gas: 2010686, gasPrice: '20000000000',nonce});
    //console.log('after deploy');
	}

	catch(e){
    	console.log('caught in init');
        	const index=e.message.indexOf("0");
            console.log(e.message.substring(20,index-1));
            return e.message.substring(20,index-1);//a
    	}

}

const addBattle= async function (battle_type, expire_time, winner, val, from = address)  {
	await init(from);

    try{
    let nonce=await web3.eth.getTransactionCount(from);
    //let deployed_contract=await contract.deploy({data: BinaryOption.bytecode})
                                  //.send({from: from, gas: 2010686, gasPrice: '20000000000',nonce}); // lines 49-50 are exist only cuz of nonce

	await contract.methods.addBattle(battle_type,expire_time,winner).send({
		from: from,
		value:val
	});
	console.log('addBattle passed!');
	return 'success';
	}
	catch(e){
	console.log('caught addBattle');
	const index=e.message.indexOf("0");
    console.log(e.message.substring(20,index-1));
    return e.message.substring(20,index-1);
	}
}

const acceptBattle= async function (id,val,from = address)  {
	await init(from);
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
    return e.message.substring(20,index-1);//a
    }

}

const withdraw= async function (identifier,from = address) {
	await init(from);
    try{
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
	    console.log(return_msg);
	    return_msg;
	    }
	else{
	if(winner==1){
	    return_msg='You won ' +result[0].returnValues.amount+' in battle: '+identifier;
        	    console.log(return_msg);
        	    return_msg;
	    }
	else{
	return_msg='There was draw in battle: '+identifier;
    	    console.log(return_msg);
    	    return_msg;
	}
	}
	}
    catch(e){
    console.log('caught withdraw');
    	const index=e.message.indexOf("0");
        console.log(e.message.substring(20,index-1));
        return e.message.substring(20,index-1);
    }

}

const cancelBattle= async function(id,from = address) {
	await init(from);

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
    }

}

const getEvent= async function(from = address) {
	await init(from);

    try{
	const res=await web3.eth.getBlockNumber();
    result=await contract.getPastEvents('MyEvent',{filter:{id: 1},fromBlock: res-5, toBlock: res});
    console.log(result[0].returnValues.id);

	}
	catch(e){
    const index=e.message.indexOf("0");
        console.log(e.message.substring(20,index-1));

    }

}

const getPrice= async function(from = address)  {
	await init(from);
    try{
    await contract.methods.setPrice().send({
    from: from
    });
    const result=await contract.methods.getPrice().call();
    console.log("price value:"+result);
    }
    catch(e){
    console.log('caught getPrice');
    const index=e.message.indexOf("0");
        console.log(e.message.substring(20,index-1));
    }
}

const getId= async function(from = address){
await init(from);
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

const getAmount= async function(index,from = address)  {
	await init(from);

    try{
    let nonce=await web3.eth.getTransactionCount(from);
    //let deployed_contract=await contract.send({from: from, gas: 2010686, gasPrice: '20000000000',nonce});
    //console.log(deployed_contract);
	const result=await contract.methods.getAmount(index).call();
	console.log(result);
	}
	catch(e){
	console.log('caught getAmount');
        console.log(e);
	}
}

const getBattleInfo= async function (id , from = address)  {
	await init(from);

    try{
    //let nonce=await web3.eth.getTransactionCount(from); // still need to deal with the nonce issue, since now we do not deploy here
	let battle=await contract.methods.getBattleInfo(id).call();
	console.log('getBattleInfo passed!');
	return battle;
	}
	catch(e){
	console.log('caught getBattleInfo');
	const index=e.message.indexOf("0");
    console.log(e.message.substring(20,index-1));
    return null;
	}
}

//addBattle("EthVsUsd",90,false,'50000');
//acceptBattle(0,'50000');
//getBattleInfo(2);