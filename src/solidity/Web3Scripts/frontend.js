import {getDebug} from "../../utils";

const PickTestNet = require('./PickTestNet');
const Web3 = require('web3');
const BinaryOption = require('../build/contracts/BinaryOption.json');
let address = '0xDEdbf82289edB28763463D1FF482a9A94604E6dc';
address = PickTestNet.publicAddress;
let result = PickTestNet.result;
let web3 = PickTestNet.web3;
let contract = PickTestNet.contract;
let kovan = PickTestNet.kovan;




let debug = getDebug('sol:frontend');
const init = async function init(provide, from = address) {

    web3 = new Web3(provide);
    //web3.eth.handleRevert =true;
    try {
        let id = "0";
        if (kovan) {
            id = "42";
        } else {
            id = "4";
        }
        contract = new web3.eth.Contract(
            BinaryOption.abi,
            BinaryOption.networks[id].address // The address of the deployed smart contract. May be seen in /build/BinaryOption.json
            //deployedNetwork.address
        );
        debug('before deploy');
        //estimated_gas=web3.eth.estimateGas({data:BinaryOption.bytecode}).then(console.log);
        //console.log(estimated_gas);

    } catch (e) {
        debug('caught in init');
        if (!kovan) {
            const index = e.message.indexOf("0");
            debug(e.message.substring(20, index - 1));
        }
    }

}

export const addBattle = async function (battle_type, expire_time, winner, val, provide, from = address) {
    await init(provide, from);
    debug("aaaa");
    try {
        await contract.methods.addBattle(battle_type, expire_time, winner).send({
            from: from,
            value: val
        });
        const res = await web3.eth.getBlockNumber();
        result = await contract.getPastEvents('AddEvent', {
            filter: {address_field: from}, // we filter by the address of the sender
            fromBlock: res - 2, toBlock: res
        });
        debug(result);
        debug(result.length);
        const id = result[result.length - 1].returnValues.id; // we take the last event referred to the address of the sender
        debug(id);
        //return id.toString();
        return id;
    } catch (e) {
        debug('caught addBattle');
        if (!kovan) {
            const index = e.message.indexOf("0");
            debug(e.message.substring(20, index - 1));
        }
        console.log(e);
        return -1;
    }
}

export const acceptBattle = async function (id, val, provide, from = address) {
    await init(provide, from);
    try {
        await contract.methods.acceptBattle(id).send({
            from: address,
            value: val
        });
        debug('acceptBattle passed!');
        return 'success';
    } catch (e) {
        debug('caught acceptBattle');
        if (!kovan) {
            const index = e.message.indexOf("0");
            debug(e.message.substring(20, index - 1));
            return e.message.substring(20, index - 1);
        }
        return "";
    }
}

export const withdraw = async function (identifier, provide, from = address) {
    await init(provide, from);
    try {
        await contract.methods.withdraw(identifier).send({
            from: from
        });
        debug('withdraw passed!');
        const res = await web3.eth.getBlockNumber();
        result = await contract.getPastEvents('MyEvent', {filter: {id: identifier}, fromBlock: res - 2, toBlock: res}); // we filter by id
        const winner = result[result.length - 1].returnValues.win;
        let return_msg = null;
        if (winner === 0) {
            return_msg = 'Opponent won ' + result[0].returnValues.amount + ' in battle: ' + identifier;
        } else {
            if (winner === 1) {
                return_msg = 'Creator won ' + result[0].returnValues.amount + ' in battle: ' + identifier;
            } else {
                return_msg = 'There was draw in battle: ' + identifier;
            }
        }
        debug(return_msg);
        return return_msg;
    } catch (e) {
        debug('caught withdraw');
        if (!kovan) {
            const index = e.message.indexOf("0");
            debug(e.message.substring(20, index - 1));
            return e.message.substring(20, index - 1);
        }
        return "";
    }

}

export const cancelBattle = async function (id, provide, from = address) {
    await init(provide, from);

    try {
        await contract.methods.cancelBattle(id).send({
            from: from
        });
        debug('cancel passed!');
        return 'success';
    } catch (e) {
        debug('caught cancel');
        if (!kovan) {
            const index = e.message.indexOf("0");
            debug(e.message.substring(20, index - 1));
            return e.message.substring(20, index - 1);
        }
        return "";
    }

}

export const getBattleInfo= async function (id ,provide, from = address)  {
	await init(provide,from);

    try{

	const battle=await contract.methods.getBattleInfo(id).call();
	debug('getBattleInfo passed!');
	console.log(battle);
	return battle;
	}
	catch(e){
	debug('caught getBattleInfo');
	if(!kovan){
	const index=e.message.indexOf("0");
    debug(e.message.substring(20,index-1));
	}

    return null;
	}
}

export const getAll= async function (provide,from = address)  {
	await init(provide,from);

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