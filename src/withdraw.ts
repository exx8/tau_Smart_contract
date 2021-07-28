import {getAll} from "./solidity/Web3Scripts/frontend";
import {fillEtherDetailsInFunc, genericEtherRequest} from "./utils";
import {addBattleResult} from "./BattleMenu";
import {withdraw as frontend_withdraw} from "./solidity/Web3Scripts/frontend.js"
export async function withdraw() {
    let getAllDetailed = await fillEtherDetailsInFunc(getAll);
    let from = await genericEtherRequest(async address => address);
    let allBattles: addBattleResult[] = await (getAllDetailed());
    let filteredBattles = allBattles.filter((currBattle) => {
        if (!from)
            return false;
        return true;
        if((currBattle.creator.toLowerCase()===from||currBattle.opponent.toLowerCase()===from)&&(currBattle.betDate<=Date.now())&&(currBattle.whoWin==="3")
            &&(currBattle.creator.toLowerCase()!==currBattle.opponent.toLowerCase()))
        {

            return true;
    }
        else
            return false;
    });
    console.log(filteredBattles,from);
        // eslint-disable-next-line
    filteredBattles.forEach(async (result,id)=>
    {
        let detailed_fe_withdraw = await fillEtherDetailsInFunc(frontend_withdraw);
        detailed_fe_withdraw(id);


    })
}