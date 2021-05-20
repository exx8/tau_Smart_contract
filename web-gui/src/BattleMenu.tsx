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
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import {TrendingDown, TrendingUp} from "@material-ui/icons";

interface BattleMenuState {
}

interface BattleMenuPros {
    isOpen: DialogProps["open"];
    handleClose: () => void
}

export var stock: string = ("stock");
export var coin: string = ("coin");

function TrendToggle() {
    const [Trend, setTrend] = React.useState("");

    const handleTrend = (event: any, newTrend: React.SetStateAction<string>) => {
        setTrend(newTrend);
    };
    return {Trend, setTrend,handleTrend};
}

export class BattleMenu extends React.Component<BattleMenuPros, BattleMenuState> {
    state: BattleMenuState = {
        // optional second annotation for better type inference

    };


    handleClose = () => {
        this.props.handleClose();

    }

    render() {
        const {Trend,handleTrend} = TrendToggle();
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
                            <div>
                                Trend
                                <ToggleButtonGroup
                                    exclusive
                                    aria-label="Trend"
                                    value={Trend}
                                    onChange={handleTrend}
                                >
                                    <ToggleButton value="up" aria-label="trending up">
                                        <TrendingUp/>

                                    </ToggleButton>
                                    <ToggleButton value="down" aria-label="trending down">
                                        <TrendingDown/>

                                    </ToggleButton>

                                </ToggleButtonGroup>

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
                            <Button onClick={this.handleClose} color="primary">
                                <SendIcon/>
                                Send
                            </Button>

                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        );
    }

    protected static readonly defaultDueTimeInTheFutureInDays = 7;

    protected static getDefaultDueTime() {
        return getDateString(futureDate(this.defaultDueTimeInTheFutureInDays));
    }
}


