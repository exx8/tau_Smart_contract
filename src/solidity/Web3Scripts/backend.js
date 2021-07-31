/*const PickTestNet=require('./PickTestNet');
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

const init = async function init(from) {

    if(kovan){provider=new HDWalletProvider({privateKeys:[privateKey],providerOrUrl:infuraKovan,chainId:idKovan});}
    else{provider=new HDWalletProvider({privateKeys:[privateKey],providerOrUrl:infuraRinkeby,chainId:idRinkeby});}
    web3 = new Web3(provide);
    //web3.eth.handleRevert =true;
    try {
        let id = "0";
        if (kovan) {
            id = idKovan;
        } else {
            id = idRinkeby;
        }
        contract = new web3.eth.Contract(
            BinaryOption.abi,
            BinaryOption.networks[id].address // The address of the deployed smart contract. May be seen in /build/BinaryOption.json
            //deployedNetwork.address
        );
        console.log('before deploy');
        //estimated_gas=web3.eth.estimateGas({data:BinaryOption.bytecode}).then(console.log);
        //console.log(estimated_gas);

    } catch (e) {
        debug('caught in init');
        if (!kovan) {
            const index = e.message.indexOf("0");
            console.log(e.message.substring(20, index - 1));
        }
    }

}

export const addBattle = async function (battle_type, expire_time, winner, bet_amount, from ) {
    await init(from);


        await contract.methods.addBattle(battle_type, expire_time, winner).send({
            from: from,
            value: bet_amount
        });
        const block_num = await web3.eth.getBlockNumber();
        past_events = await contract.getPastEvents('AddEvent', {
            filter: {address_field: from}, // we filter by the address of the sender
            fromBlock: block_num - 2, toBlock: block_num
        });

        const id = past_events[past_events.length - 1].returnValues.id; // we take the last event referred to the address of the sender
        console.log("id is: "+id);
        //return id.toString();
        return id;

}

export const acceptBattle = async function (id, bet_amount, from) {
    await init(from);
    try {
        await contract.methods.acceptBattle(id).send({
            from,
            value: bet_amount
        });
        console.log('acceptBattle passed!');
        return 'success';
    } catch (e) {
        debug('caught acceptBattle');
        if (!kovan) {
            const index = e.message.indexOf("0");
            console.log("revert because of: "+e.message.substring(20, index - 1));
            return e.message.substring(20, index - 1);
        }
        return "";
    }
}

export const withdraw= async function (from) {
	let battleList=await getAll(from);

	for(let i = 0; i < battleList.length; i++){
	let currBattle=battleList[i];

    // eslint-disable-next-line
    if((currBattle.creator.toLowerCase()==from||currBattle.opponent.toLowerCase()==from)&&(currBattle.betDate<=Date.now())&&(currBattle.whoWin==3)&&(currBattle.creator!=currBattle.opponent)){

	    try{
    	    await contract.methods.withdraw(i).send({
    		from: from
    	    });
    	    console.log("withdraw in battle: "+i);
        }

        catch(e){
            console.log('caught withdraw in battle: '+i);
            if(!kovan){
            const index=e.message.indexOf("0");
            console.log("revert because of: "+e.message.substring(20, index - 1));

            }
            console.log("full error: "+e);
            return "";
            }
    	}
    	console.log("\n\n");
	}

	return "success";
}


export const cancelBattle = async function (id, from) {
    await init(from);

    try {
        await contract.methods.cancelBattle(id).send({
            from: from
        });
        console.log('cancel passed!');
        return 'success';
    } catch (e) {
        console.log('caught cancel');
        if (!kovan) {
            const index = e.message.indexOf("0");
            console.log("revert because of: "+e.message.substring(20, index - 1));
            return e.message.substring(20, index - 1);
        }
        return "";
    }

}

export const getBattleInfo = async function (id, from) {
    await init(from);

    try {

        const battle = await contract.methods.getBattleInfo(id).call();
        console.log('getBattleInfo passed!');
        console.log(battle);
        return battle;
    } catch (e) {
        debug('caught getBattleInfo');
        if (!kovan) {
            const index = e.message.indexOf("0");
            console.log("revert because of: "+e.message.substring(20, index - 1));
        }

        return null;
    }
}

export const getAll = async function ( from) {
    await init( from);

    try {

        let battle = await contract.methods.getAll().call();
        console.log("battleList: "+battle);
        console.log("battleList length: "+battle.length);
        return battle;
    } catch (e) {
        console.log('caught getAll');
        if (!kovan) {
            const index = e.message.indexOf("0");
            console.log("revert because of: "+e.message.substring(20, index - 1));
        }

        return null;
    }
}

//addBattle("EthVsUsd",0,false,'5'); // now 90 isnt good, need to be unix time
//getAll();
//acceptBattle(0,'1');
//withdraw(0);
//getBattleInfo(3);*/