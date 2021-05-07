const Web3=require('web3');
const BinaryOption= require('../build/contracts/BinaryOption.json');
const HDWalletProvider=require('@truffle/hdwallet-provider');
const address='0x5318CD7Da47999e9E121D917a43f0D68e6fa46D0';
const privateKey="0xe82c0d97a5d9f64a2af6d105734ef83d8288dbfdc0f5b0589911810a75f6cc4e";

/* run over kovan */
const init= async() => {
    // for the address below, I created project in infura.io

	const provider=new HDWalletProvider(privateKey,'https://kovan.infura.io/v3/41b491f3ea0941398aaf0e22bd730d50');
	const web3=new Web3(provider);
	//const id= await web3.eth.net.getId();
	//const deployedNetwork=BinaryOption.networks[id];
	try{
	let contract= new web3.eth.Contract(
	BinaryOption.abi,
	//deployedNetwork.address
	);

	contract=await contract.deploy({data: BinaryOption.bytecode})
	.send({from: address, gas: 10000000, gasPrice: '30000000000000'});

	await contract.methods.settempVal(3).send({
        		from: address
        	});
    console.log('not even here?');
    const result=await contract.methods.gettempVal().call();
    console.log(result);
	}
	catch(e){
	console.log('caught');
	const data=e.data;

    	console.log(e);
	}
	
}
init();