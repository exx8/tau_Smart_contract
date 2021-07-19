import {addBattle} from "./solidity/Web3Scripts/frontend";
import {sendInvitation} from "./Mail";

declare let window: any;

export function getAnchor() {
    if (window.location.hash) {
        var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
        return hash;
        // hash found
    } else {
        return "";
    }
}

export async function genericEtherRequest<T>(customRequest: (addresses:string) => Promise<T>) {
    if (window.ethereum) {
        try {
            let address = await window.ethereum.enable();
            return await customRequest(address);


        } catch (e) {
            console.log('Payment using Metamask  was denied');

        }
    } else if (window.web3) {
        console.log("Need to see how to extract address in this case, provider is just window.web3. than, call addBattle");
        console.log(window.web3)


    } else {
        console.log('please install a wallet. recommended: Metamask');

    }
}