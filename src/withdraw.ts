import {getAll} from "./solidity/Web3Scripts/frontend";
import {fillEtherDetailsInFunc, genericEtherRequest} from "./utils";
import {addBattleResult} from "./BattleMenu";
import {withdraw as frontend_withdraw} from "./solidity/Web3Scripts/frontend.js"
export async function withdraw() {
    let getAllDetailed = await fillEtherDetailsInFunc(getAll);
    let myaddress = await genericEtherRequest(async address => address);
    let allBattles: addBattleResult[] = await (getAllDetailed());
    let filteredBattles = allBattles.filter((battleData) => {
        if (!myaddress)
            return false;
        if(battleData.betDate<Date.now())
            return false;
        if(battleData.whoWin!=="3")
            return false;
        if (battleData.creator.toLowerCase() === myaddress[0]) {
            return true;
        }
        if (battleData.opponent.toLowerCase() === myaddress[0]) {
            return true;
        }
        return false;

    })
    console.log(filteredBattles);
        // eslint-disable-next-line
    filteredBattles.forEach(async (result,id)=>
    {
        let detailed_fe_withdraw = await fillEtherDetailsInFunc(frontend_withdraw);
        detailed_fe_withdraw(id);


    })
}