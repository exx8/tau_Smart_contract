import React from 'react';
import './App.css';
import {Button} from '@material-ui/core';
import {BattleMenu} from './BattleMenu';
import {PiChart} from "./dashboard/pi-chart";
import {DataGrid} from "./dashboard/dataGrid";
import {withdraw} from "./withdraw";
import {Balance} from "./dashboard/balance";

function App() {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    return (

        <div className="App">

            <header className="App-header">
                <div style={{padding:"10px" ,display:"inherit"}}>
                    <PiChart/>
                                        <DataGrid/>
                    <Balance/>

                </div>
                <div>

                    <Button variant="contained" color="primary" onClick={setDialogOpen.bind(null, true)}>Create an
                        Option</Button>
                    <Button variant="contained" color="primary" onClick={withdraw}>withdraw</Button>

                </div>
                <BattleMenu isOpen={dialogOpen} handleClose={setDialogOpen.bind(null, false)}
                            handleOpen={setDialogOpen.bind(null, true)}/>


            </header>
        </div>
    );
}

export default App;
