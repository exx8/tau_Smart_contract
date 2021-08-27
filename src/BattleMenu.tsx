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
import {fillEtherDetailsInFunc, genericEtherRequest, getAnchor, getDebug} from "./utils";
import {alertReachMax, getBattleInfo} from "./solidity/Web3Scripts/frontend"
import {addBattle} from "./solidity/Web3Scripts/frontend"
import {TrendingDown, TrendingUp} from "@material-ui/icons";
import {AcceptButton} from "./BattleMenuComponents/AcceptButton";
import {CancelButton} from "./BattleMenuComponents/CancelButton";
import {assetList} from "./assetsList";

let debug = getDebug("battleMenu");

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
    actionOnSubmitAndCancel: boolean;


}

interface BattleMenuPros {
    isOpen: DialogProps["open"];
    handleClose: () => void;
    handleOpen: () => void;
}

export var stock: string = ("stock");
export var coin: string = ("eth_vs_usd");

declare let window: any;


export class BattleMenu extends React.Component<BattleMenuPros, Partial<BattleMenuState>> {
    state: BattleMenuState = {
        email: null,
        type: "eth_vs_usd",
        amount: 1,
        trend: true,
        trendChangeable: true,
        date: moment(BattleMenu.getDefaultDueTime()).unix(),
        showMail: false,
        amountChangeable: true,
        typeChangeable: true,
        dateChangeable: true,
        actionOnSubmitAndCancel: true
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
                date: moment(e.target.value).unix() * 1000
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
        this.state.date = moment(BattleMenu.getDefaultDueTime()).unix() * 1000;
        debug(this.state.date, "date");

        this.updateFormAccordingToHash();

    }
   static mapAsset()
    {
        let arr=[]
        for(const [key, ] of Object.entries(assetList) )
        {
            arr.push(<MenuItem value={key as string }>{(key as string).replaceAll("_"," ")}</MenuItem>)
        }

        return arr;
    }

    render() {
        let emailBox = this.computeMail();
        let trendToggle = this.computeTrend();
        let datePicker = <TextField
            id="due-time"
            label="due time"
            type="datetime-local"
            value={getDateString(new Date(this.state.date))}
            InputLabelProps={{
                shrink: true,
            }}
            onChange={this.handleDateChange}
            disabled={!this.state.dateChangeable}
        />;
        ;
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
                                value={this.state.type}
                                onChange={this.handleTypeChange}
                                disabled={!this.state.typeChangeable}
                            >
                                {BattleMenu.mapAsset()}


                            </Select>
                            <FormHelperText>type of asset</FormHelperText>
                            <div><TextField id="standard-basic" inputProps={{min: 0}} label="amount"
                                            onChange={this.handleAmountChange} value={this.state.amount}
                                            disabled={!this.state.amountChangeable}/></div>
                            <div style={{paddingTop: "10px", paddingBottom: "10px"}}>
                                Trend

                                {trendToggle}
                            </div>
                            {datePicker}
                        </DialogContent>
                        <DialogActions>
                            {this.getActionButton()}

                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        );
    }

    private getActionButton() {
        if (this.state.actionOnSubmitAndCancel)
            return <>
                <Button onClick={this.handleClose} color="primary">
                    <CloseIcon/>
                    Cancel
                </Button>
                <Button onClick={this.sendHandle} color="primary">
                    <SendIcon/>
                    Send
                </Button>
            </>;
        return <>
            <AcceptButton value={String(this.state.amount)} id={getAnchor() ?? -1} close={this.handleClose}/>
            <CancelButton id={getAnchor() ?? -1} close={this.handleClose}/>
        </>
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

                console.log("received date:", battleData.betDate, new Date(Number(battleData.betDate)));
                this.moveToSendMode(battleData);
            }
        })

    }

    protected moveToSendMode(battleData: addBattleResult) {
        this.setState({
            amount: Number(battleData.amountBet),
            showMail: false,
            trendChangeable: false,
            amountChangeable: false,
            type: battleData.betType,
            typeChangeable: false,
            date: Number(battleData.betDate),
            dateChangeable: false,
            actionOnSubmitAndCancel: false,
            trend:!battleData.isUp
        })
    }

    private sendHandle = async () => {
        //window.addEventListener("load",async()=>{}); // where to wrap? not in this function, but where page is opended
        if (window.ethereum) {

            try {
                let address = await window.ethereum.enable();
                console.log(this.state.date);
                let detailedAlertReachMax = await fillEtherDetailsInFunc(alertReachMax);
                if (await detailedAlertReachMax()) {
                } else {

                    let battleID: string = await addBattle(this.state.type, this.state.date, this.state.trend, this.state.amount,
                        window.ethereum, address[0]);
                    const fixedEmail: string = this.state.email ?? "";
                    sendInvitation(fixedEmail, battleID)
                }
            } catch (e) {
                alert('Payment using Metamask was denied');
                throw new Error('Payment using Metamask was denied');
            }
        } else if (window.web3) {
            alert('please install a wallet. recommended: Metamask');
            throw new Error("no wallet was found");
        } else {
            alert('please install a wallet. recommended: Metamask');
            throw new Error("no wallet was found");

        }
        this.handleClose();
    }

    protected static readonly defaultDueTimeInTheFutureInDays = 7;

    protected static getDefaultDueTime() {
        return getDateString(futureDate(this.defaultDueTimeInTheFutureInDays));
    }
}
export interface addBattleResult extends Array<any> {

    amountBet: string;
    betDate: number;
    betType: string;
    creator: string;
    currVal: string;
    isUp: boolean;
    opponent: string;
    whoWin:"1"|"2"|"3"|"0";
    length: 8;

}
