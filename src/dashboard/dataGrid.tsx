import React from "react";
import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';
import {getAll as getAllFE} from "../solidity/Web3Scripts/frontend";
import {addBattleResult} from "../BattleMenu";
import {TrendingDown, TrendingUp} from "@material-ui/icons";
import {fillEtherDetailsInFunc} from "./../utils"

export class DataGrid extends React.Component<{}, {dataSource:any[]}> {
    columns = [
        {name: 'amountBet', header: 'wei', minWidth: 20, defaultFlex: 2},
        {name: 'betType', header: 'type', minWidth: 40, defaultFlex: 3},
        {name: 'isUp', header: 'trend', minWidth: 10, defaultFlex: 2.2},
        {name: 'WhoWin', header: 'status', minWidth: 10, defaultFlex: 3},

        {name: 'betDate', header: 'date', defaultFlex: 6},
    ];

    gridStyle = {minHeight: 250, display: "inline-block", minWidth: "35rem"};

    state = {dataSource: []}

    render() {
        return <ReactDataGrid
            idProperty="id"
            columns={this.columns}
            dataSource={this.state.dataSource}
            style={this.gridStyle}
        />
    }

    async componentDidMount() {
        let getAll = await fillEtherDetailsInFunc(getAllFE);
            let results: addBattleResult = await getAll();
            console.log(results);
            const status={
                0:"opponent",
                1: "creator",
                2: "draw",
                3:"not settled"
            }
            let dataSource = results.map((value, index, array) => {

                    let returned_value = {
                        amountBet: value.amountBet,
                        betType: String(value.betType),
                        isUp: (value.isUp)? <TrendingUp/>:<TrendingDown/>,
                        WhoWin: status[value.whoWin as 1|2|3|0 ],
                        betDate: new Date(Number(value.betDate)).toString()

                    };
                    return returned_value;
                }
            );
            console.log(dataSource)
            this.setState({
                dataSource: dataSource
            });


    }
}
