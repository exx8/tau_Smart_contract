

const PickTestNet=require('./PickTestNet');
const Web3=require('web3');
const BinaryOption= require('../build/contracts/BinaryOption.json');
const HDWalletProvider=require('@truffle/hdwallet-provider');
let address=PickTestNet.publicAddress;
let privateKey=PickTestNet.privateAddress;
let result=PickTestNet.result;
let web3=PickTestNet.web3;
let provider=PickTestNet.provider;
let contract=PickTestNet.contract;
let kovan=PickTestNet.kovan;
let infuraKovan=PickTestNet.infuraKovan;
let infuraRinkeby=PickTestNet.infuraRinkeby;
let idKovan=PickTestNet.idKovan;
let idRinkeby=PickTestNet.idRinkeby;

const init=async function init(from=address) {

    if(kovan){provider=new HDWalletProvider({privateKeys:[privateKey],providerOrUrl:infuraKovan,chainId:idKovan});}
    else{provider=new HDWalletProvider({privateKeys:[privateKey],providerOrUrl:infuraRinkeby,chainId:idRinkeby});}

	web3=new Web3(provider);
	//web3.eth.handleRevert =true;
	try{
    let id="0";
    if(kovan){id="42";}
    else{id="4";}

	contract= new web3.eth.Contract(

	BinaryOption.abi,
	BinaryOption.networks[id].address,
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
    	if(!kovan){
        const index=e.message.indexOf("0");
        console.log(e.message.substring(20,index-1));
        }
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
                console.log(result);

    const id=result[result.length-1].returnValues.id;
    console.log(id);
    return id;
	}
	catch(e){
	console.log('caught addBattle');
	console.log(e);
	if(!kovan){
	const index=e.message.indexOf("0");
    console.log(e.message);
    }

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
	if(!kovan){
    const index=e.message.indexOf("0");
    console.log(e.message.substring(20,index-1));
    return e.message.substring(20,index-1);
    }
    return "";
    }

}



const withdraw= async function (from = address) {
	let battleList=await getAll(from);

	for(let i = 0; i < battleList.length; i++){
	let currBattle=battleList[i];

	if((currBattle.creator==from||currBattle.opponent==from)&&(currBattle.betDate<=Date.now())
	&&(currBattle.whoWin==3)&&(currBattle.creator!=currBattle.opponent)){

	    try{
    	    await contract.methods.withdraw(i).send({
    		from: from
    	    });
    	    console.log("withdraw in battle: "+i);
        }

        catch(e){
            console.log('caught withdraw');
            if(!kovan){
            const index=e.message.indexOf("0");
            console.log(e.message.substring(20,index-1));
            return e.message.substring(20,index-1);
            }

            return "";
            }
    	}
	}


	return "success";

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
    if(!kovan){
    const index=e.message.indexOf("0");
    console.log(e.message.substring(20,index-1));
    }
    return "";
    }

}


const getBattleInfo= async function (id , from = address)  {
	await init(from);

    try{

	const battle=await contract.methods.getBattleInfo(id).call();
	console.log('getBattleInfo passed!');
	console.log(battle);
	return battle;
	}
	catch(e){
	console.log('caught getBattleInfo');
	if(!kovan){
	const index=e.message.indexOf("0");
    console.log(e.message.substring(20,index-1));
	}

    return null;
	}
}

const getAll= async function (from = address)  {
	await init(from);

    try{

	let battle=await contract.methods.getAll().call();
	console.log('getAll passed!');
	console.log(battle);
	return battle;
	}
	catch(e){
	console.log('caught getAll');
	if(!kovan){
	const index=e.message.indexOf("0");
    console.log(e.message.substring(20,index-1));
	}

    return null;
	}
}



//addBattle("EthVsUsd",2,false,'2'); // now 90 isnt good, need to be unix time
//acceptBattle(4,'2');
//getAll();
withdraw();
//getBattleInfo(1);