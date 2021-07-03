
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
const init=async function init(from=address) {

	provider=new HDWalletProvider({privateKeys:[privateKey],providerOrUrl:"https://rinkeby.infura.io/v3/c6212b31c70941ca847fa2a9237a3d1a",chainId:4});
	web3=new Web3(provider);
	//web3.eth.handleRevert =true;
	try{
	contract= new web3.eth.Contract(
	BinaryOption.abi,
	'0x73378f981d39b9284EfC85158dd2C36d72ccE8E4'
	//deployedNetwork.address
	);
	console.log('before deploy');
	//estimated_gas=web3.eth.estimateGas({data:BinaryOption.bytecode}).then(console.log);
	//console.log(estimated_gas);
    //let nonce=await web3.eth.getTransactionCount(from);

    	//contract=await contract.deploy({data: BinaryOption.bytecode})
        //.send({from: from, gas: 2010686, gasPrice: '20000000000',nonce});
    //console.log('after deploy');
	}

	catch(e){
    	console.log('caught in init');
        	const indx=e.message.indexOf("0");

            console.log(e.message.substring(20,indx-1));
    	}

}

const addBattle= async function (battle_type, expire_time, winner, val, from = address)  {
	await init(from);

    try{
    console.log('aaaaaa');
    let nonce=await web3.eth.getTransactionCount(from);
    console.log('aaaaaa');
    //let deployed_contract=await contract.deploy({data: BinaryOption.bytecode})
                                  //.send({from: from, gas: 2010686, gasPrice: '20000000000',nonce}); // lines 49-50 are exist only cuz of nonce

	await contract.methods.addBattle(battle_type,expire_time,winner).send({
		from: from,
		value:val
	});
	console.log('addBattle passed!');
	const r=await contract.methods.getAmount(0).call();
	console.log(r);
	}
	catch(e){
	console.log('caught addBattle');
	const indx=e.message.indexOf("0");

    console.log(e.message);
	}
}

const acceptBattle= async function (id,val,from = address)  {
	await init(from);


    try{
    let nonce=await web3.eth.getTransactionCount(from);
    //let deployed_contract=await contract.send({from: from, gas: 2010686, gasPrice: '20000000000',nonce});
	await contract.methods.acceptBattle(id).send({
	from: address,
	value:val
	});
	console.log('acceptBattle passed!');
	}
	catch(e){
	console.log('caught acceptBattle');
    const indx=e.message.indexOf("0");
    console.log(e.message.substring(20,indx-1));

    }

}

const withdraw= async function (identifier,provide,from = address) {
	await init(provide,from);
    try{
    let nonce=await web3.eth.getTransactionCount(from);
    let deployed_contract=await contract.send({from: from, gas: 2010686, gasPrice: '20000000000',nonce});
	const receipt=await deployed_contract.methods.withdraw(identifier).send({
		from: from
	});
	console.log('withdraw passed!');
	const res=await web3.eth.getBlockNumber();
	result=await contract.getPastEvents('MyEvent',{filter:{id: identifier},fromBlock: res-2, toBlock: res});
	const winner=result[0].returnValues.winner;
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
    	const indx=e.message.indexOf("0");
        console.log(e.message.substring(20,indx-1));
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
    const indx=e.message.indexOf("0");
    console.log(e.message.substring(20,indx-1));
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

const getAmount= async function(indx,from = address)  {
	await init(from);

    try{
    let nonce=await web3.eth.getTransactionCount(from);
    //let deployed_contract=await contract.send({from: from, gas: 2010686, gasPrice: '20000000000',nonce});
    //console.log(deployed_contract);
	const result=await contract.methods.getAmount(indx).call();
	console.log(result);
	}
	catch(e){
	console.log('caught getId');
        console.log(e);
	}
}

//acceptBattle(2,'50000');
getAmount(2);