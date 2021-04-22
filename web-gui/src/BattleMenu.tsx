import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogProps,
    DialogTitle,
    ModalProps,
    TextField
} from '@material-ui/core';
import React from 'react';
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
interface BattleMenuState {
}

interface BattleMenuPros {
    isOpen: DialogProps["open"];
    handleClose: () => void
}

export class BattleMenu extends React.Component<BattleMenuPros, BattleMenuState> {
    state: BattleMenuState = {
        // optional second annotation for better type inference

    };


    handleClose=()=> {
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
                </div></div>
        );
    }
}


