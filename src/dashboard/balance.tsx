import React from "react";
import Chart from 'chart.js/auto';
import {fillEtherDetailsInFunc, genericEtherRequest} from "../utils";
import {getAll as getAllFE} from "../solidity/Web3Scripts/frontend";
import {addBattleResult} from "../BattleMenu";

export class Balance extends React.Component<{}, {}> {


    render() {
        return <>
            <div style={{display: "inline-block"}}>
                <canvas id={"myChart2"} style={{height: "250px", width: "250px"}}/>
            </div>
        </>;
    }

    public async componentDidMount() {
        let getAll = await fillEtherDetailsInFunc(getAllFE);
        genericEtherRequest(async (address) => {
            let results: addBattleResult[] = await getAll();
            results = Balance.sortResults(results);
            let dates = results.map((value, index, array) => (value.betDate));
            let data = results.map((value, index, array) => {
                    let amount = Number(value.amountBet);
                    switch (value.whoWin) {
                        case "0":
                            amount *= value.opponent == address ? -1 : 1;
                            break;
                        case "1":
                            amount*=value.creator==address?-1:1
                            break;
                        case "2":
                        case "3":
                            amount=0
                            break;
                    }
                return amount;
                }
            );
            let sum=0;
            data=data.map((value, index, array) => sum=sum+value);


            console.log(dates);
            var ct: HTMLCanvasElement = document.getElementById('myChart2') as HTMLCanvasElement;
            var ctx = ct.getContext('2d') as CanvasRenderingContext2D;

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        data,
                        label: "Total",
                        borderColor: "#3e95cd",
                        backgroundColor: "#7bb6dd",
                        fill: false,
                    }
                    ]
                },
            });
        })

    }

    private static sortResults(results: addBattleResult[]) {
        let results2 = new Array<addBattleResult>(...results);
        results2.sort((function (a, b) {
            return a.betDate - b.betDate;
        }));
        return results2;
    }
}
