import * as React from "react";
import PCBModel from '../model/PCBModel';
import * as CASE from '../model/CaseModels';

export default class UIThicknessParameter extends React.Component<{
        defautlVal: number, minWallThick: number, maxWallThick: number,
        caseModel: CASE.CaseModel, onParamUpdate: Function},
        {value: number}> {

    constructor(props) {
        super(props);
        this.state = {value: this.props.defautlVal};
    }

    render() {
        return (<div className="input-group input-group-sm">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="wall-thickness">Wall Thickness in mm</span>
                    </div>
                    <input
                        type="number"
                        min={this.props.minWallThick/10}
                        max={this.props.maxWallThick/10}
                        value={this.state.value/10}
                        step={0.1}
                        onChange={(event) => {
                            let val = parseFloat(event.target.value)*10;
                            this.setState({value: val});
                            if(!(isNaN(val) || val > this.props.maxWallThick || val < this.props.minWallThick))
                                this.props.caseModel.setThickness(val);
                            this.props.onParamUpdate();
                        }}
                        className="form-control"
                        aria-describedby="wall-thickness"/>
                </div>);
    }
}
