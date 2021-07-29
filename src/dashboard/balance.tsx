import React from "react";
import Chart from 'chart.js/auto';
import {fillEtherDetailsInFunc, genericEtherRequest} from "../utils";
import {getAll as getAllFE} from "../solidity/Web3Scripts/frontend";
import {addBattleResult} from "../BattleMenu";

export class Balance extends React.Component<{}, {}> {


    render() {
        return <>
            <div style={{display:"inline-block"}}>
                <canvas id={"myChart2"} style={{height: "250px", width: "250px"}}/>
            </div>
        </>;
    }

    public async componentDidMount() {
        let getAll = await fillEtherDetailsInFunc(getAllFE);
        genericEtherRequest(async (address) => {
            let results: addBattleResult[] = await getAll();

            var ct: HTMLCanvasElement = document.getElementById('myChart2') as HTMLCanvasElement;
            var ctx = ct.getContext('2d') as CanvasRenderingContext2D;

            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                    datasets: [{
                        data: [86,114,106,106,107,111,133],
                        label: "Total",
                        borderColor: "#3e95cd",
                        backgroundColor: "#7bb6dd",
                        fill: false,
                    }, {
                        data: [70,90,44,60,83,90,100],
                        label: "Accepted",
                        borderColor: "#3cba9f",
                        backgroundColor: "#71d1bd",
                        fill: false,
                    }, {
                        data: [10,21,60,44,17,21,17],
                        label: "Pending",
                        borderColor: "#ffa500",
                        backgroundColor:"#ffc04d",
                        fill: false,
                    }, {
                        data: [6,3,2,2,7,0,16],
                        label: "Rejected",
                        borderColor: "#c45850",
                        backgroundColor:"#d78f89",
                        fill: false,
                    }
                    ]
                },
            });
        } )

}}
