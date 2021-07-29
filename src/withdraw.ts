import {getAll} from "./solidity/Web3Scripts/frontend";
import {fillEtherDetailsInFunc, genericEtherRequest} from "./utils";
import {addBattleResult} from "./BattleMenu";
import {withdraw as frontend_withdraw} from "./solidity/Web3Scripts/frontend.js"
export async function withdraw() {
    let withdraw = await fillEtherDetailsInFunc(withdraw);
    return withdraw();
}