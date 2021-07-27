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
                <canvas id={"myChart"}/>
            </div>
        </>;
    }

    public async componentDidMount() {
        let getAll = await fillEtherDetailsInFunc(getAllFE);
        genericEtherRequest(async (address) => {
            let results: addBattleResult[] = await getAll();
            let statusOfBattles=[0,0,0,0];
            for(let battle:addBattleResult of results)
            {
                //if(battle.creator=address
                    }
            var ct: HTMLCanvasElement = document.getElementById('myChart') as HTMLCanvasElement;
            var ctx = ct.getContext('2d') as CanvasRenderingContext2D;
            var chart = new Chart(ctx, {
                type: 'pie',
                // The type of chart we want to create


                // The data for our dataset
                data: {
                    labels: ["January", "February", "March", "April", "May", "June", "July"],
                    datasets: [{
                        label: "My First dataset",
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgb(255, 99, 132)',
                        data: [0, 10, 5, 2, 20, 30, 45],
                    }]
                },

                // Configuration options go here
                options: {}
            });
        });


    }
}