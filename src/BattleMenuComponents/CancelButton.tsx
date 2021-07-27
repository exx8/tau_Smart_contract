import React from "react";
import {Button} from "@material-ui/core";
import { cancelBattle} from "../solidity/Web3Scripts/frontend";
import {fillEtherDetailsInFunc} from "../utils";
import BlockIcon from '@material-ui/icons/Block';
export class CancelButton extends React.Component<{id:number,close:()=>any;}, {}> {

    render() {

        return (
            <Button color="primary" onClick={ this.rejectBattle}>
                <BlockIcon/>
                Reject
            </Button>)
    }

      rejectBattle=async():Promise<void> =>{
        let detailedCancelBattle = await fillEtherDetailsInFunc(cancelBattle);
         detailedCancelBattle(this.props.id);
          this.props.close();

      }
}