import React from "react";
import {Button} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import {acceptBattle} from "../solidity/Web3Scripts/frontend";
import CheckIcon from '@material-ui/icons/Check';
import {fillEtherDetailsInFunc} from "../utils";
export class AcceptButton extends React.Component<{value:number,id:number}, {}> {

    render() {

        return (
            <Button color="primary" onClick={ this.acceptBattle}>
                <CheckIcon/>
                accept
            </Button>)
    }

      acceptBattle=async():Promise<void> =>{
        let detailedAcceptBattle = await fillEtherDetailsInFunc(acceptBattle);
         detailedAcceptBattle(this.props.value, this.props.id);
    }
}