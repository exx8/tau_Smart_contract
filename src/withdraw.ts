import {fillEtherDetailsInFunc} from "./utils";

export async function withdraw() {
    let withdraw = await fillEtherDetailsInFunc(withdraw);
    return withdraw();
}