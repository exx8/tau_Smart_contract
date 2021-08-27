import {getDebug} from "../../utils";

const PickTestNet = require('./PickTestNet');
const Web3 = require('web3');
const BinaryOption = require('../build/contracts/BinaryOption.json');
//address = PickTestNet.publicAddress;
let past_events = PickTestNet.past_events;
let web3 = PickTestNet.web3;
let contract = PickTestNet.contract;
let kovan = PickTestNet.kovan;
const idKovan = PickTestNet.idKovan;
const idRinkeby = PickTestNet.idRinkeby;
export const maxNumOfBattles = 3;
const battleFreeSpace = 100;


let debug = getDebug('sol:frontend');
const init = async function init(provide, from) {

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

export const addBattle = async function (battle_type, expire_time, winner, bet_amount, provide, from) {
    await init(provide, from);
    try {
        await contract.methods.addBattle(battle_type, expire_time, winner).send({
            from: from,
            value: bet_amount
        });
        //await getList(provide, from);

        //await getB(provide,from);


        const parallelism = 5;
        const block_num = await web3.eth.getBlockNumber();
        // filtering by the address of the sender to allow parallelism of different senders
        past_events = await contract.getPastEvents('AddEvent', {
            filter: {address_field: from},
            fromBlock: block_num - parallelism, toBlock: block_num
        });
        // we take the most relevant battle referred to address_field
        console.log(past_events);
        const id = past_events[past_events.length - 1].returnValues.id;
        debug("id is: " + id);
        //return id.toString();
        return id;
    } catch (e) {
        debug('caught addBattle');

        if (!kovan) {
            const index = e.message.indexOf("0");
            debug("revert because of: " + e.message.substring(20, index - 1));
            return e.message.substring(20, index - 1);
        }
    }

}

export const acceptBattle = async function (id, bet_amount, provide, from) {
    await init(provide, from);
    try {
        await contract.methods.acceptBattle(id).send({
            from,
            value: bet_amount
        });
        debug('acceptBattle passed!');
        return 'success';
    } catch (e) {
        debug('caught acceptBattle');
        if (!kovan) {
            const index = e.message.indexOf("0");
            debug("revert because of: " + e.message.substring(20, index - 1));
            return e.message.substring(20, index - 1);
        }
        return "";
    }
}
/**
 * check if concurrent limit has been reached
 * if so alerts the user
 * @param provide
 * @param from
 * @returns {Promise<boolean>}  whether the user has been alerted- if so limit has been reached
 */
export const alertReachMax = async function (provide, from) {
    let battles = await getaddressToBattle(provide, from);
    if (battles.length == maxNumOfBattles) {
        alert("You are currently participating in too much battles");
        return true;
    }
    return false;
}
// returns false if there is no battle to withdraw from
export const withdraw = async function (provide, from) {
    let battleList = await getaddressToBattle(provide, from);
    let anyBattleMatch = false;
    if (battleList == [battleFreeSpace, battleFreeSpace, battleFreeSpace]) {
        debug("nothing to withdraw");
        return false;
    }
    for (let i = 0; i < battleList.length; i++) {
        let currBattleId = battleList[i];
        if (currBattleId != battleFreeSpace) {
            let currBattle = await getBattleInfo(currBattleId, provide, from, false);
            console.log("battle: " + currBattle + " id: " + currBattleId);
            // eslint-disable-next-line
            if (
                (currBattle.betDate <= Date.now()) && (currBattle.whoWin == 3) && (currBattle.creator != currBattle.opponent)) {
                anyBattleMatch = true;
                try {
                    await contract.methods.withdraw(currBattleId).send({
                        from: from
                    });
                    debug("withdraw in battle: " + currBattleId);
                } catch (e) {
                    console.log('caught withdraw in battle: ' + currBattleId);
                    if (!kovan) {
                        const index = e.message.indexOf("0");
                        debug("revert because of: " + e.message.substring(20, index - 1));

                    }
                    debug("full error: " + e);
                    return false;
                }
            }
            debug("\n\n");
        }
    }


    return anyBattleMatch;
}


export const cancelBattle = async function (id, provide, from) {
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
            debug("revert because of: " + e.message.substring(20, index - 1));
            return e.message.substring(20, index - 1);
        }
        return "";
    }

}

export const getBattleInfo = async function (id, provide, from, init_param = true) {

    await init(provide, from);
    try {

        const battle = await contract.methods.getBattleInfo(id).call();
        debug('getBattleInfo passed!');
        debug(battle);
        return battle;
    } catch (e) {
        debug('caught getBattleInfo');
        if (!kovan) {
            const index = e.message.indexOf("0");
            debug("revert because of: " + e.message.substring(20, index - 1));
        }

        return null;
    }
}

export const getAll = async function (provide, from) {
    await init(provide, from);

    try {

        let battle = await contract.methods.getAll().call();

        debug("battleList: " + battle);
        debug("battleList length: " + battle.length);
        return battle;
    } catch (e) {
        console.log('caught getAll');
        if (!kovan) {
            const index = e.message.indexOf("0");
            debug("revert because of: " + e.message.substring(20, index - 1));
        }

        return null;
    }
}

// returns relevant battle id's to withdraw
export const getaddressToBattle = async function (provide, from) {

    await init(provide, from);
    try {

        const battleIds = await contract.methods.getaddressToBattle(from).call();
        debug('getaddressToBattle passed!');
        debug(battleIds);
        return battleIds;
    } catch (e) {
        debug('caught getaddressToBattle');
        if (!kovan) {
            const index = e.message.indexOf("0");
            debug("revert because of: " + e.message.substring(20, index - 1));
        }

        return null;
    }
}

export const cleanBattles = async function (provide, from) {
    await init(provide, from);

    try {
        await contract.methods.cleanBattles().send({
            from: from
        });
        debug('cleanBattles passed!');
        return 'success';
    } catch (e) {
        debug('caught cleanBattles');
        if (!kovan) {
            const index = e.message.indexOf("0");
            debug("revert because of: " + e.message.substring(20, index - 1));
            return e.message.substring(20, index - 1);
        }
        return "";
    }

}

/*export const getB = async function () {

    try {

        const b = await contract.methods.getB().call();
        debug('b passed!');
        debug(b);
        return b;
    } catch (e) {
        debug('caught getB');
        if (!kovan) {
            const index = e.message.indexOf("0");
            debug("revert because of: "+e.message.substring(20, index - 1));
        }

        return null;
    }
}

export const getList = async function (provide, from) {

    try {

        let b = await contract.methods.getList(from).call();
        debug('getList passed!');
        debug(b);

    } catch (e) {
        debug('caught getList');
        if (!kovan) {
            const index = e.message.indexOf("0");
            debug("revert because of: "+e.message.substring(20, index - 1));
        }


    }
}*/
