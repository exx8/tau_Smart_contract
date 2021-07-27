import React from "react";
import {Button} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import {acceptBattle} from "../solidity/Web3Scripts/frontend";
import CheckIcon from '@material-ui/icons/Check';
export class BattleMenu extends React.Component<{}, {}> {
    render() {

        return (
            <Button onClick={acceptBattle} color="primary">
                <CheckIcon/>
                Send
            </Button>)
    }

}