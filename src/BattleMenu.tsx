import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogProps,
    DialogTitle,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@material-ui/core';
import React from 'react';
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import {futureDate, getDateString} from "./DateUtils";
import {TrendToggle} from "./TrendToggle";
import { addBattle} from "./solidity/Web3Scripts/run_kovan";


interface BattleMenuState {
}

interface BattleMenuPros {
    isOpen: DialogProps["open"];
    handleClose: () => void
}

export var stock: string = ("stock");
export var coin: string = ("coin");

declare let window: any;

export class BattleMenu extends React.Component<BattleMenuPros, BattleMenuState> {
    state: BattleMenuState = {
        // optional second annotation for better type inference

    };


    handleClose = () => {
        this.props.handleClose();

    }

    render() {
        return (
            <div>
                <div>

                    <Dialog open={this.props.isOpen} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title"> Create a Binary Option</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Type Partner's address
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Email Address"
                                type="email"
                                fullWidth
                            />
                            <InputLabel id="demo-simple-select-helper-label">Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-helper-label"
                                id="demo-simple-select-helper"

                            >

                                <MenuItem value={coin}>coin</MenuItem>
                                <MenuItem value={stock}>stock</MenuItem>
                            </Select>
                            <FormHelperText>type of asset</FormHelperText>
                            <div><TextField id="standard-basic" inputProps={{min: 0}} label="amount"/></div>
                            <div style={{paddingTop: "10px", paddingBottom: "10px"}}>
                                Trend

                                <TrendToggle/>
                            </div>
                            <TextField
                                id="due-time"
                                label="due time"
                                type="datetime-local"
                                defaultValue={BattleMenu.getDefaultDueTime()}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                                <CloseIcon/>
                                Cancel
                            </Button>
                            <Button onClick={this.sendHandle} color="primary">
                                <SendIcon/>
                                Send
                            </Button>

                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        );
    }

    private sendHandle = async () => {

         await window.ethereum.enable();


        this.handleClose();
       await addBattle("EthVsUsd",15,false,"5000");


    }

    protected static readonly defaultDueTimeInTheFutureInDays = 7;

    protected static getDefaultDueTime() {
        return getDateString(futureDate(this.defaultDueTimeInTheFutureInDays));
    }
}


