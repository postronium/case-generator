import * as React from "react";
import PCBModel from '../model/PCBModel';
import * as CASE from '../model/CaseModels';
import * as COMP from './UIutils';
import Area2D from '../utils/Area2D';
import Position2D from "./UIPosition";

export default class UIScrews extends React.Component<{area: Area2D, onUpdate: Function, pcbModel: PCBModel}> {

    constructor(props) {
        super(props);
        this.addScrew = this.addScrew.bind(this);
        this.onScrewUpdate = this.onScrewUpdate.bind(this);
        this.onScrewDelete = this.onScrewDelete.bind(this);
    }

    //add screw and update
    private addScrew(event) {
        let screwList = this.props.pcbModel.getScrewPositions();
        screwList.push([CASE.CaseModel.MIN_SCREW_POS, CASE.CaseModel.MIN_SCREW_POS]);
        this.props.onUpdate(screwList);
        this.setState({});
    }

    render() {
        let uiScrews = [];

        let screws = this.props.pcbModel.getScrewPositions();

        for (let i = 0; i < screws.length; i++) {
            uiScrews.push(<Position2D id={i} validArea={this.props.area}
                initialPos={{x: screws[i][0], y: screws[i][1], z: 0}}
                onUpdate={this.onScrewUpdate}/>);
        }

        console.log("re render screws");

        return (<div id="pcb-screw-conntainer">
            <h5>SCREWS    <COMP.BTNAdd onClick={this.addScrew} /></h5>
            <div className="indent" >{uiScrews}</div>
        </div>);
    }

    private onScrewDelete(index: number) {
        let screws = this.props.pcbModel.getScrewPositions();
        screws.splice(index, 1);

        this.props.onUpdate(screws);
        this.setState({});
    }

    private onScrewUpdate(x: number, y: number, index: number) {
        let screws = this.props.pcbModel.getScrewPositions();
        screws[index] = [x, y];

        this.props.onUpdate(screws);
        this.setState({});
    }
}
