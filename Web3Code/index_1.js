const Web3=require('web3');
const BinaryOption= require('./build/contracts/BinaryOption.json');


/*const addNew= async() => {
	let result=0;
	const web3=new Web3('http://localhost:9545');
	const id= await web3.eth.net.getId();
	const deployedNetwork=BinaryOption.networks[id];
	const contract= new web3.eth.Contract(
	BinaryOption.abi,deployedNetwork.address
	);
	const addresses= await web3.eth.getAccounts();
	result=await contract.methods.getId().call();
	console.log("Before:" +result);
	await contract.methods.addBattle("Dollar",30,false).send({
		from: addresses[0],
		value:'100000',
		gas: 180000,
        gasPrice: '30000000'
	});
	result=await contract.methods.getId().call();

	console.log("After:" +result);
}
addNew();*/

const addNew= async() => {
	let result=0;
	const web3=new Web3('http://localhost:9545');
	const id= await web3.eth.net.getId();
	const deployedNetwork=BinaryOption.networks[id];
	const contract= new web3.eth.Contract(
	BinaryOption.abi,deployedNetwork.address
	);
	const addresses= await web3.eth.getAccounts();

	/*await contract.methods.addBattle("Dollar",15,false).send({
		from: addresses[0],
		value:'100000',
		gas: 180000,
        gasPrice: '30000000'
	});

	await contract.methods.acceptBattle(0).send({
	from: addresses[1],
	value:'100000',
	gas: 180000,
    gasPrice: '30000000'
	});
	result=await contract.methods.tempVal().call();
	console.log(result);*/


	await contract.methods.withdraw(0).send({
		from: addresses[0],
		gas: 180000,
        gasPrice: '30000000'
	});
	result=await contract.methods.tempVal().call();
	console.log("After cancel:" +result);

	/*await contract.methods.cancelBattle(1).send({
		from: addresses[0],
		value:'100000',
		gas: 180000,
        gasPrice: '30000000'
	});
	result=await contract.methods.tempVal().call();
	console.log("After cancel:" +result);*/

}
addNew();