const Web3=require('web3');
const BinaryOption= require('./build/contracts/BinaryOption.json');
const HDWalletProvider=require('@truffle/hdwallet-provider');
const address='0x41b121f607965E9488BF4A4b34ABCDfd99E10C0D';
const privateKey="0x714b23ef4e5686c68ed7c78d252d7764dd3cea6d43f11a0a3ec947ac4819d7b5";

const init= async() => {
	const provider=new HDWalletProvider(privateKey,'http://localhost:9545');
	const web3=new Web3(provider);
	const id= await web3.eth.net.getId();
	const deployedNetwork=BinaryOption.networks[id];
	const contract= new web3.eth.Contract(
	BinaryOption.abi,
	deployedNetwork.address
	);
	//contract=await contract.deploy({data: BinaryOption.bytecode})
	//.send({from: address});
	
	
	await contract.methods.settempVal(3).send({
		from: address
	});
	const result=await contract.methods.gettempVal(3).call();
	
	console.log(result);
	
}
init();