const Web3=require('web3');
const BinaryOption= require('../build/contracts/BinaryOption.json');


let result=0;
let web3=null;
let id=0;
let deployedNetwork=null;
let contract=null;
let addresses=null;

const init= async() => {

    web3=new Web3('http://localhost:9545');
	id= await web3.eth.net.getId();
	deployedNetwork=BinaryOption.networks[id];
	contract= new web3.eth.Contract(
	BinaryOption.abi,deployedNetwork.address
	);
	addresses= await web3.eth.getAccounts();

}

const addBattle= async() => {
	await init();

    try{
	result=await contract.methods.addBattle("EthVsUsd",15,false).send({
		from: addresses[0],
		value:'0', // I made it non positive to test the catch block
		gas: 180000,
        gasPrice: '30000000'
	});
	}
	catch(e){
	const data=e.data;
	const txHash = Object.keys(data)[0];
    const reason = data[txHash].reason;
	console.log(reason);
	}

}
const acceptBattle= async() => {
	await init();

    try{
	await contract.methods.acceptBattle(0).send({
	from: addresses[1],
	value:'100000',
	gas: 180000,
    gasPrice: '30000000'
	});
	}
	catch(e){
    const data=e.data;
    const txHash = Object.keys(data)[0];
    const reason = data[txHash].reason;
    console.log(reason);
    }

}

const withdraw= async() => {
	await init();
    try{
	result=await contract.methods.getcurrVal(0).call(); //example to the problem I told you about- I have to call this method since I can't get the return value from withdraw()
	await contract.methods.withdraw(0).send({
		from: addresses[0],
		gas: 180000,
        gasPrice: '30000000'
	});
	console.log("You earned: " +result.toString());
	}
    catch(e){
    const data=e.data;
    const txHash = Object.keys(data)[0];
    const reason = data[txHash].reason;
    console.log(reason); // the text in the require method, can be used for the frontend
    }

}

const cancelBattle= async() => {
	await init();

    try{
	await contract.methods.cancelBattle(1).send({
		from: addresses[0],
		value:'100000',
		gas: 180000,
        gasPrice: '30000000'
	});
	}
	catch(e){
    const data=e.data;
    const txHash = Object.keys(data)[0];
    const reason = data[txHash].reason;
    console.log(reason);
    }

}

// will go to the catch block since no battle is exist
withdraw();
