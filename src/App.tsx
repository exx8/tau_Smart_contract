import React from 'react';
import './App.css';
import { Button } from '@material-ui/core';
import { BattleMenu } from './BattleMenu';
import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
function App() {
    const [dialogOpen, setDialogOpen] = React.useState(false);
  return (
    <div className="App">
      <header className="App-header">

        <Button variant="contained" color="primary" onClick={setDialogOpen.bind(null,true)}>Create an Option</Button>
          <BattleMenu isOpen={dialogOpen} handleClose={setDialogOpen.bind(null,false)}/>

      </header>
    </div>
  );
}

export default App;
