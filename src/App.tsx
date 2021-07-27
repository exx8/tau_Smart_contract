import React from 'react';
import './App.css';
import { Button } from '@material-ui/core';
import { BattleMenu } from './BattleMenu';
import {withdraw} from "./withdraw";

function App() {
    const [dialogOpen, setDialogOpen] = React.useState(false);
  return (
    <div className="App">
      <header className="App-header">

        <Button variant="contained" color="primary" onClick={setDialogOpen.bind(null,true)}>Create an Option</Button>
          <BattleMenu isOpen={dialogOpen} handleClose={setDialogOpen.bind(null,false)}  handleOpen={setDialogOpen.bind(null,true)}/>
          <Button variant="contained" color="primary" onClick={withdraw}>withdraw</Button>

      </header>
    </div>
  );
}

export default App;
