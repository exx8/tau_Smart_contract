import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ModalProps,
    TextField
} from '@material-ui/core';
import React from 'react';

interface BattleMenuState {
}

interface BattleMenuPros {
    open: ModalProps['open'];
    handleClose: () => void
}

class BattleMenu extends React.Component<BattleMenuPros, BattleMenuState> {
    state: BattleMenuState = {
        // optional second annotation for better type inference

    };


    handleClose() {
        this.props.handleClose();

    }

    render() {
        return (
            <div>
                eturn (
                <div>

                    <Dialog open={open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                To subscribe to this website, please enter your email address here. We will send updates
                                occasionally.
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
                                Cancel
                            </Button>
                            <Button onClick={this.handleClose} color="primary">
                                Subscribe
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div></div>
        );
    }
}


export default BattleMenu;