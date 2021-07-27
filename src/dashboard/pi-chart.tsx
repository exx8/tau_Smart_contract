import React from "react";
import Chart from 'chart.js/auto';
import {fillEtherDetailsInFunc, genericEtherRequest} from "../utils";
import {getAll as getAllFE} from "../solidity/Web3Scripts/frontend";
import {addBattleResult, BattleMenu} from "../BattleMenu";

export class PiChart extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);

    }

    render() {
        return <>
            <div>
                <canvas id={"myChart"} style={{height:"250px",width:"250px"}}/>
            </div>
        </>;
    }

    public async componentDidMount() {
        let getAll = await fillEtherDetailsInFunc(getAllFE);
        genericEtherRequest(async (address) => {
            let results: addBattleResult[] = await getAll();
            let statusOfBattles = [0, 0, 0, 0];
            for (let battle of results) {
                console.log(battle)

                if (battle.creator.toLowerCase() == address[0])
                    switch (battle.whoWin) {
                        case "1"://you win
                            statusOfBattles[0]++;
                            break;
                        case "0": //oponnent win
                            statusOfBattles[1]++
                            break;
                        case "2"://draw
                            statusOfBattles[2]++;
                            break;
                        case "3": //hasn't been settled
                            statusOfBattles[3]++;
                            break;

                    }
                if (battle.opponent.toLowerCase() == address[0])
                    switch (battle.whoWin) {
                        case "1"://you win
                            statusOfBattles[1]++

                            break;
                        case "0": //oponnent win
                            statusOfBattles[0]++;
                            break;
                        case "2"://draw
                            statusOfBattles[2]++;
                            break;
                        case "3": //hasn't been settled
                            statusOfBattles[3]++;
                            break;

                    }


            }
            var ct: HTMLCanvasElement = document.getElementById('myChart') as HTMLCanvasElement;
            var ctx = ct.getContext('2d') as CanvasRenderingContext2D;
            var chart = new Chart(ctx, {
                type: 'pie',
                // The type of chart we want to create


                // The data for our dataset
                data: {
                    labels: ["WON", "LOST", "DRAW", "NOT SETTLED"],
                    datasets: [{
                        label: "My First dataset",
                        backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(54, 162, 235)',
                            'rgb(255, 205, 86)',
                            'rgb(40, 205, 86)'
                        ], borderColor: ['rgb(255, 99, 132)',
                            'rgb(54, 162, 235)',
                            'rgb(255, 205, 86)',
                            'rgb(40, 205, 86)'],
                        data: statusOfBattles,
                    }]
                },

                // Configuration options go here
                options: {}
            });
        });


    }
}