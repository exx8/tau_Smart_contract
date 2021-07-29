import {fillEtherDetailsInFunc} from "./utils";
import {withdraw as withdrawFE} from "./solidity/Web3Scripts/frontend";
export async function withdraw() {
    let withdrawFunc = await fillEtherDetailsInFunc(withdrawFE);
     withdrawFunc();
}