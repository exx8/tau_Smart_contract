const Web3=require('web3');
const BinaryOption= require('../build/contracts/BinaryOption.json');
const HDWalletProvider=require('@truffle/hdwallet-provider');
const address='0xDEdbf82289edB28763463D1FF482a9A94604E6dc';
const privateKey="0xccc943d4061cda10d3c617ff06234810fd195598851774f0c6359e086d31660f";

let result=0;
let web3=null;
let provider=null;
let id=0;
let deployedNetwork=null;
let contract=null;
let addresses=null;

const init= async function() {
        try{
	    provider=new HDWalletProvider(privateKey,'http://localhost:9545');
    	web3=new Web3(provider);

    	id= await web3.eth.net.getId();
    	deployedNetwork=BinaryOption.networks[id];
    	contract= new web3.eth.Contract(
    	BinaryOption.abi,
    	deployedNetwork.address
    	);
    	}
	catch(e){
    	console.log('caught');
    	const data=e.data;
        	console.log(e);
    	}

}

const addBattle= async function(battle_type,expire_time,winner,val)  {
	await init();

    try{
	await contract.methods.addBattle(battle_type,expire_time,winner).send({
		from: address,
		value:val
	});
	console.log('yes');
	}
	catch(e){
	console.log('caught');
	const data=e.data;
        console.log(e);
	}
}

const acceptBattle= async function(id,val)  {
	await init();

    try{
	await contract.methods.acceptBattle(id).send({
	from: address,
	value:val
	});
	console.log('yes');
	}
	catch(e){
    const data=e.data;

    console.log(e);
    }

}

const withdraw= async function(id) {
	await init();
    try{
	const receipt=await contract.methods.withdraw(id).send({
		from: address
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

const cancelBattle= async function(id,val) {
	await init();

    try{
	await contract.methods.cancelBattle(id).send({
		from: addresses[address],
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

const getEvent= async function() {
	await init();

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

const getPrice= async function()  {
	await init();
    try{
    await contract.methods.setPrice().send({
            		from: address
            	});
        const res=await contract.methods.getPrice().call();
        console.log("price value:"+res);
    	}
    	catch(e){
    	console.log('caught');
    	const data=e.data;

        	console.log(e);
    	}
}

const getId= async function()  {
	await init();

    try{
	const res=await contract.methods.getId().call();
	console.log(res);
	}
	catch(e){
	console.log('caught');
	const data=e.data;
        console.log(e);
	}
}
//getId();
//getPrice();
addBattle("EthVsUsd",15,false,'50000');
//acceptBattle(0,'500000');
//addBattle("EthVsUsd",10,false,'50000');
//acceptBattle(1,'500000');
//withdraw(0);
//getEvent();