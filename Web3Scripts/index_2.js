const Web3=require('web3');
const BinaryOption= require('../build/contracts/BinaryOption.json');
const HDWalletProvider=require('@truffle/hdwallet-provider');
const address="0x5318CD7Da47999e9E121D917a43f0D68e6fa46D0";
const privateKey="0xe82c0d97a5d9f64a2af6d105734ef83d8288dbfdc0f5b0589911810a75f6cc4e";

/* run over kovan */
const init= async() => {
    // for the address below, I created project in infura.io
	const provider=new HDWalletProvider(privateKey,'https://kovan.infura.io/v3/a8456f3ee9e547c4bc39d840f85dabe6');//https://kovan.infura.io/v3/a8456f3ee9e547c4bc39d840f85dabe6
	const web3=new Web3(provider);
	//const id= await web3.eth.net.getId();
	//const deployedNetwork=BinaryOption.networks[id];
	try{
	let contract= new web3.eth.Contract(
	BinaryOption.abi,
	//deployedNetwork.address
	);
	contract=await contract.deploy({data: BinaryOption.bytecode})
	.send({from: address});
	

	/*await contract.methods.settempVal(3).send({
		from: address
	});*/
	//const result=await contract.methods.gettempVal().call();
	
	console.log('not even here?');
	}
	catch(e){
	const data=e.data;
    	const txHash = Object.keys(data)[0];
        const reason = data[txHash].reason;
    	console.log(reason);
	}
	
}
init();