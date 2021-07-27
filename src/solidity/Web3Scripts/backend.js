
const Web3=require('web3');
const BinaryOption= require('../build/contracts/BinaryOption.json');
const HDWalletProvider=require('@truffle/hdwallet-provider');
const address='0x082a5b7998Ec14bE1CeC5d2562d7335583382a8c';
const privateKey="0x798c3768cf935dec172b56ac64ae27fcb27b2853e786c84388e8b3fce4425d65";
let result=0;
let web3=null;
let provider=null;
let contract=null;
let addresses=null;
const deployedAddress=BinaryOption;

const init=async function init(from=address) {

	provider=new HDWalletProvider({privateKeys:[privateKey],providerOrUrl:"https://rinkeby.infura.io/v3/9dae83efed4e4a03898b38a302efc552",chainId:4});
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
	await contract.methods.addBattle(battle_type,expire_time,winner).send({
		from: from,
		value:val
	});
	const res=await web3.eth.getBlockNumber();
    result=await contract.getPastEvents('AddEvent',{filter:{ad: from},
                fromBlock: res-2, toBlock: res});

        const id=result[result.length-1].returnValues.id;
                        console.log(id);
        return id;
	}
	catch(e){
	console.log('caught addBattle');
	const index=e.message.indexOf("0");
    console.log(e.message);
    return -1;
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
	result=await contract.getPastEvents('MyEvent',{filter:{id: identifier},fromBlock: "latest"});
	const winner=result[result.length-1].returnValues.win;
	let return_msg=null;
	if (winner==0){
	return_msg='You lost ' +result[0].returnValues.amount+' in battle: '+identifier;
	    console.log(return_msg);
	    return return_msg;
	    }
	else{
	if(winner==1){
	    return_msg='You won ' +result[0].returnValues.amount+' in battle: '+identifier;
        	    console.log(return_msg);
        	    return return_msg;
	    }
	else{
	return_msg='There was draw in battle: '+identifier;
    	    console.log(return_msg);
    	    return return_msg;
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

const getRound= async function (from = address)  {
	await init(from);

    try{
	result=await contract.methods.getRound().call();
	console.log('getRound passed!');
	console.log(result);
	return result;
	}
	catch(e){
	console.log('caught getBattleInfo');
	const index=e.message.indexOf("0");
    console.log(e.message.substring(20,index-1));
    return null;
	}
}

const getByDate= async function (rnd,from = address)  {
	await init(from);

    try{
	result=await contract.methods.getByDate(rnd).call();
	console.log('getByDate passed!');
	console.log(result.toString());
	return result;
	}
	catch(e){
	console.log('caught getByDate');
	const index=e.message.indexOf("0");
    console.log(e.message);
    return null;
	}
}

addBattle("EthVsUsd",90,false,'5');

//acceptBattle(0,'50000');
//getBattleInfo(2);

//getRound();
//getByDate(BigInt("36893488147419112888"));