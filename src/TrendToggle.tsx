import React from "react";
import ToggleButton from "@material-ui/lab/ToggleButton";
import {TrendingDown, TrendingUp} from "@material-ui/icons";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

interface TrendToggleState {
    value: "up" | "down";

}


interface props {
    onChange:any
}

export class TrendToggle extends React.Component<props, TrendToggleState> {
constructor(props:props) {

        super(props);
        this.state={value:"up"}

}
     handleTrend= ( event: any, newTrend: TrendToggleState["value"]) => {
        this.props.onChange(newTrend);

        this.setState({value: newTrend});
    };

    render() {
        return <span style={{padding:"15px"}}>
            <ToggleButtonGroup
            exclusive
            aria-label="Trend"
            value={this.state.value}
            onChange={this.handleTrend}
        >
            <ToggleButton value="up" aria-label="trending up">
                <TrendingUp/>

            </ToggleButton>
            <ToggleButton value="down" aria-label="trending down">
                <TrendingDown/>

            </ToggleButton>

        </ToggleButtonGroup>
        </span>
    }
}