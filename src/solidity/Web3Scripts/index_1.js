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
	await contract.methods.addBattle("EthVsUsd",15,false).send({
		from: addresses[0],
		value:'10000', // I made it non positive to test the catch block.
		gas: 180000,
        gasPrice: '30000000'
	});
	console.log('yes');
	}
	catch(e){
	console.log('caught in add');
	const data=e.data;
	const txHash = Object.keys(data)[0];
    const reason = data[txHash].reason;
	console.log(data); // the reason will be as written in the require: "You have to bet on positive value!\n"
	}

}
const acceptBattle= async() => {
	await init();

    try{
	await contract.methods.acceptBattle(2).send({
	from: addresses[3],
	value:'500000',
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
	//result=await contract.methods.getcurrVal(0).call(); //example to the problem I told you about- I have to call this method since I can't get the return value from withdraw()
	const receipt=await contract.methods.withdraw(2).send({
		from: addresses[0],
		gas: 180000,
        gasPrice: '30000000'
	});
	const res=await web3.eth.getBlockNumber();
	result=await contract.getPastEvents('MyEvent',{filter:{id: 1},fromBlock: res-2, toBlock: res});
            console.log(result[0].returnValues.id);
    //console.log(receipt.events.MyEvent.returnValues.amount);

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

const getPrice= async() => {
	await init();

    try{
	result=await contract.methods.getPrice().call(); // I tried also with the send method as in the above functions but it didnt work
	console.log(result);
	}
	catch(e){
    const data=e.data;
        const txHash = Object.keys(data)[0];
        const reason = data[txHash].reason;
        console.log(reason);
        //you can also print the data const if you want
    }

}

const getEvent= async() => {
	await init();

    try{
	const res=await web3.eth.getBlockNumber();
	// look at the last two blocks, filter over the id
    result=await contract.getPastEvents('MyEvent',{filter:{id: 1},fromBlock: res-5, toBlock: res});
    console.log(result[0].returnValues.id);

	}
	catch(e){
    const data=e.data;
        const txHash = Object.keys(data)[0];
        const reason = data[txHash].reason;
        console.log(reason);
        //you can also print the data const if you want
    }

}


addBattle();
//acceptBattle();
//withdraw();
//getEvent();