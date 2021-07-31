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

export async function genericEtherRequest<T>(customRequest: (addresses: string) => Promise<T>) {
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

function bind_trailing_args(fn: Function, ...bound_args: any[]): Function {
    return function (...args: any[]) {
        return fn(...args, ...bound_args);
    };
}

export async function fillEtherDetailsInFunc(customRequest: Function): Promise<Function> {
    if (window.ethereum) {
        try {
            let address = await window.ethereum.enable();
            return bind_trailing_args(customRequest, window.ethereum, address[0]);


        } catch (e) {
            console.log('Payment using Metamask  was denied');
            throw e;

        }
    }
    /*
    else if (window.web3) {
        console.log("Need to see how to extract address in this case, provider is just window.web3. than, call addBattle");
        console.log(window.web3)



    }
    */ else {

        console.log('please install a wallet. recommended: Metamask');
        throw new Error("no wallet was found");
    }
}

export function getDebug(namespace: string) {
    let debugNameSpace = require('debug')(namespace);
    debugNameSpace.log = console.log;
    debugNameSpace.enabled = true;
    return debugNameSpace;
}

export function switchAnchor(anchor:string)
{
    window.location = (""+window.location).replace(/#[A-Za-z0-9_]*$/,'')+"#"+anchor;

}