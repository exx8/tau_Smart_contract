import {fillEtherDetailsInFunc} from "./utils";

export async function withdraw() {
    let withdrawFunc = await fillEtherDetailsInFunc(withdraw);
    return withdrawFunc();
}