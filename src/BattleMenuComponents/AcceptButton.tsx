import React from "react";
import {Button} from "@material-ui/core";
import {acceptBattle, alertReachMax} from "../solidity/Web3Scripts/frontend";
import CheckIcon from '@material-ui/icons/Check';
import {fillEtherDetailsInFunc, switchAnchor} from "../utils";

export class AcceptButton extends React.Component<{ value: string, id: number, close: () => any }, {}> {

    render() {

        return (
            <Button color="primary" onClick={this.acceptBattle}>
                <CheckIcon/>
                accept
            </Button>)
    }

    acceptBattle = async (): Promise<void> => {
        let detailedAcceptBattle = await fillEtherDetailsInFunc(acceptBattle);
        let detailedAlertReachMax = await fillEtherDetailsInFunc(alertReachMax);
        if (detailedAlertReachMax()) {
        } else {
            detailedAcceptBattle(this.props.id, this.props.value);
        }
        switchAnchor("")
        this.props.close();
    }
}