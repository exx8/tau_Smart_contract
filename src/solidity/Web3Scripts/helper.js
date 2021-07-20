const getA= async function(from = address)  {
	await init(from);
    try{
    let a=await contract.methods.getA().call();
    console.log("address is: "+a);
    }
    catch(e){
    console.log('caught getPrice');
    const index=e.message.indexOf("0");
        console.log(e.message.substring(20,index-1));
    }
}

const getEvent= async function(from = address) {
	await init(from);

    try{
	const res=await web3.eth.getBlockNumber();
    result=await contract.getPastEvents('MyEvent',{filter:{id: 1},fromBlock: res-5, toBlock: res});
    console.log(result[0].returnValues.id);

	}
	catch(e){
    const index=e.message.indexOf("0");
        console.log(e.message.substring(20,index-1));

    }

}

const getPrice= async function(from = address)  {
	await init(from);
    try{
    await contract.methods.setPrice().send({
    from: from
    });
    const result=await contract.methods.getPrice().call();
    console.log("price value:"+result);
    }
    catch(e){
    console.log('caught getPrice');
    const index=e.message.indexOf("0");
        console.log(e.message.substring(20,index-1));
    }
}

const getId= async function(from = address){
await init(from);
try{
    let nonce=await web3.eth.getTransactionCount(from);
	const result=await contract.methods.getId().call();
	console.log(result);
	}
	catch(e){
	console.log('caught getId');
        const index=e.message.indexOf("0");
        console.log(e.message.substring(20,index-1));
	}
}

const getAmount= async function(index,from = address)  {
	await init(from);

    try{
    let nonce=await web3.eth.getTransactionCount(from);
    //let deployed_contract=await contract.send({from: from, gas: 2010686, gasPrice: '20000000000',nonce});
    //console.log(deployed_contract);
	const result=await contract.methods.getAmount(index).call();
	console.log(result);
	}
	catch(e){
	console.log('caught getAmount');
        console.log(e);
	}
}