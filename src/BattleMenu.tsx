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
import {addBattle} from "./solidity/Web3Scripts/run_kovan";
import moment from "moment";


interface BattleMenuState {
    email: string | null;
    type: string | null;
    amount: number | null;
    trend:boolean;
    date:number;


}

interface BattleMenuPros {
    isOpen: DialogProps["open"];
    handleClose: () => void
}

export var stock: string = ("stock");
export var coin: string = ("EthVsUsd");

declare let window: any;


export class BattleMenu extends React.Component<BattleMenuPros, BattleMenuState> {
    state: BattleMenuState = {
        email: null,
        type: coin,
        amount:1,
        trend:true,
        date:moment(BattleMenu.getDefaultDueTime()).unix()
    };


    handleClose = () => {
        this.props.handleClose();

    }

    handleEmailChange = (e: any) => {
        this.setState(
            {
                email: e.target.value
            }
        );


    }
    handleTypeChange = (e: any) => {
        this.setState(
            {
                type: e.target.value
            }
        );


    }

    handleAmountChange = (e: any) => {
        this.setState(
            {
                amount: e.target.value
            }
        );


    }

    handleTrendChange = (str: string) => {
        this.setState(
            {
                trend: "up"===str
            }
        );

    }

    handleDateChange = (e:any) => {
        this.setState(
            {
                date:moment(e.target.value).unix()
            }
        );

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
                                id="email"
                                label="Email Address"
                                type="email"
                                fullWidth
                                onChange={this.handleEmailChange}
                            />
                            <InputLabel id="demo-simple-select-helper-label">Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-helper-label"
                                id="demo-simple-select-helper"
                                defaultValue={coin}
                                onChange={this.handleTypeChange}
                            >

                                <MenuItem value={coin}>coin</MenuItem>
                                <MenuItem value={stock}>stock</MenuItem>
                            </Select>
                            <FormHelperText>type of asset</FormHelperText>
                            <div><TextField id="standard-basic" inputProps={{min: 0}} label="amount"
                            onChange={this.handleAmountChange}/></div>
                            <div style={{paddingTop: "10px", paddingBottom: "10px"}}>
                                Trend

                                <TrendToggle onChange={this.handleTrendChange}/>
                            </div>
                            <TextField
                                id="due-time"
                                label="due time"
                                type="datetime-local"
                                defaultValue={BattleMenu.getDefaultDueTime()}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={this.handleDateChange}
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

        let address = await window.ethereum.enable();



        this.handleClose();
        await addBattle(this.state.type, this.state.date*1000-new Date().getTime(), this.state.trend, this.state.amount,
        window.ethereum, address[0]);


    }

    protected static readonly defaultDueTimeInTheFutureInDays = 7;

    protected static getDefaultDueTime() {
        return getDateString(futureDate(this.defaultDueTimeInTheFutureInDays));
    }
}


