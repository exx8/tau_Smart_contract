const Web3=require('web3');
const BinaryOption= require('../build/contracts/BinaryOption.json');
const HDWalletProvider=require('@truffle/hdwallet-provider');
const address='0xDEdbf82289edB28763463D1FF482a9A94604E6dc';
const privateKey="0xccc943d4061cda10d3c617ff06234810fd195598851774f0c6359e086d31660f";

/* run over kovan */
const init= async() => {
    // for the address below, I created project in infura.io

	const provider=new HDWalletProvider({privateKeys:[privateKey],providerOrUrl:"https://kovan.infura.io/v3/423c508011d14316b04a4ebbf33b0634",chainId:42});
	const web3=new Web3(provider);
	//const id= await web3.eth.net.getId();
	//const deployedNetwork=BinaryOption.networks[id];
	try{
	let contract= new web3.eth.Contract(
	BinaryOption.abi,
	//deployedNetwork.address
	);
	const nonce=await web3.eth.getTransactionCount(address);
	contract=await contract.deploy({data: BinaryOption.bytecode})
	.send({from: address, gas: 12487782, gasPrice: '20000000000',nonce});

	await contract.methods.settempVal(3).send({
        		from: address
        	});
    console.log("broadcast success");
    const result=await contract.methods.gettempVal().call();
    console.log("gettempVal value:"+result);
	}
	catch(e){
	console.log('caught');
	const data=e.data;

    	console.log(e);
	}
	
}
init();
