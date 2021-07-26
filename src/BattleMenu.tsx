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
import moment from "moment";
import {sendInvitation} from "./Mail";
import {genericEtherRequest, getAnchor, getDebug} from "./utils";
import {getBattleInfo} from "./solidity/Web3Scripts/frontend"
import {addBattle} from "./solidity/Web3Scripts/frontend"
import {TrendingDown, TrendingUp} from "@material-ui/icons";
let debug=getDebug("battleMenu");
interface BattleMenuState {
    email: string | null | undefined;
    type: string | null;
    amount: number | null;
    trend: boolean;
    date: number;
    showMail: boolean;
    trendChangeable: boolean;
    amountChangeable: boolean;
    typeChangeable: boolean;
    dateChangeable: boolean;



}

interface BattleMenuPros {
    isOpen: DialogProps["open"];
    handleClose: () => void;
    handleOpen: () => void;
}

export var stock: string = ("stock");
export var coin: string = ("EthVsUsd");

declare let window: any;


export class BattleMenu extends React.Component<BattleMenuPros, Partial<BattleMenuState>> {
    state: BattleMenuState = {
        email: null,
        type: coin,
        amount: 1,
        trend: true,
        trendChangeable: true,
        date: moment(BattleMenu.getDefaultDueTime()).unix(),
        showMail: false,
        amountChangeable: true,
        typeChangeable: true,
        dateChangeable: true
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
                trend: "up" === str
            }
        );

    }

    handleDateChange = (e: any) => {
        this.setState(
            {
                date: moment(e.target.value).unix()
            }
        );

    }

    getBattleData = async (): Promise<addBattleResult | undefined> => {
        let battleID: string = getAnchor();
        if (battleID) {
            return await genericEtherRequest(async (addresses) => {
                return await getBattleInfo(battleID, window.ethereum, addresses[0]) as addBattleResult;
            });

        }

    }

    constructor(props: BattleMenuPros) {
        super(props);
        this.state.date=moment(BattleMenu.getDefaultDueTime()).unix()*1000;
        debug(this.state.date,"date");

        this.updateFormAccordingToHash();

    }

    render() {
        let emailBox = this.computeMail();
        let trendToggle = this.computeTrend();
        return (
            <div>
                <div>

                    <Dialog open={this.props.isOpen} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title"> Create a Binary Option</DialogTitle>
                        <DialogContent>
                            {emailBox}
                            <InputLabel id="demo-simple-select-helper-label">Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-helper-label"
                                id="demo-simple-select-helper"
                                defaultValue={this.state.type}
                                onChange={this.handleTypeChange}
                                disabled={!this.state.typeChangeable}
                            >

                                <MenuItem value={coin}>coin</MenuItem>
                                <MenuItem value={stock}>stock</MenuItem>
                            </Select>
                            <FormHelperText>type of asset</FormHelperText>
                            <div><TextField id="standard-basic" inputProps={{min: 0}} label="amount"
                                            onChange={this.handleAmountChange} value={this.state.amount}
                                            disabled={!this.state.amountChangeable}/></div>
                            <div style={{paddingTop: "10px", paddingBottom: "10px"}}>
                                Trend

                                {trendToggle}
                            </div>
                            <TextField
                                id="due-time"
                                label="due time"
                                type="datetime-local"
                                defaultValue={getDateString(new Date(this.state.date))}
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

    private computeTrend() {
        let trendToggle = <TrendToggle onChange={this.handleTrendChange}/>;
        if (!this.state.trendChangeable) {

            if (this.state.trend) {
                trendToggle = <> <b>UP</b> <TrendingUp/></>
            } else {
                trendToggle = <> <b>DOWN</b> <TrendingDown/></>
            }
        }
        return trendToggle;
    }

    private computeMail() {

        if (this.state.showMail)
            return <><DialogContentText>
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
                /></>;
        else
            return <></>;
    }

    private updateFormAccordingToHash() {
        let battleDataPromise: Promise<addBattleResult | undefined> = this.getBattleData();
        battleDataPromise.then((battleData) => {
            let senderMode = battleData === undefined;
            if (!senderMode && battleData) {
                this.props.handleOpen();
                debug("received date:",battleData.betDate,new Date(Number(battleData.betDate)));
                this.setState({
                    amount: Number(battleData.amountBet),
                    showMail: senderMode,
                    trendChangeable: senderMode,
                    amountChangeable: false,
                    type: battleData.betType,
                    typeChangeable: false,
                    date:battleData.betDate
                })
            }
        })

    }

    private sendHandle = async () => {
        //window.addEventListener("load",async()=>{}); // where to wrap? not in this function, but where page is opended
        if (window.ethereum) {
            try {
                let address = await window.ethereum.enable();
                console.log(this.state.date);
                let battleID: string = await addBattle(this.state.type, this.state.date , this.state.trend, this.state.amount,
                    window.ethereum, address[0]);
                const fixedEmail: string = this.state.email ?? "";
                sendInvitation(fixedEmail, battleID)

                console.log("battle data is ", battleID);
            } catch (e) {
                console.log('Payment using Metamask  was denied');

            }
        } else if (window.web3) {
            console.log("Need to see how to extract address in this case, provider is just window.web3. than, call addBattle");
            console.log(window.web3)


        } else {
            console.log('please install a wallet. recommended: Metamask');

        }
        this.handleClose();

    }

    protected static readonly defaultDueTimeInTheFutureInDays = 7;

    protected static getDefaultDueTime() {
        return getDateString(futureDate(this.defaultDueTimeInTheFutureInDays));
    }
}

interface addBattleResult extends Array<any> {

    amountBet: string;
    betDate: number;
    betType: string;
    creator: string;
    currVal: string;
    isUp: boolean;
    opponent: string;
    length: 7;

}

