import * as React from "react";

import PCBModel from '../../model/PCBModel';
import CaseOption from '../../generator/CaseOption';
import * as COMP from '../utils';
import Area1D from '../../utils/Area1D';

export default class UIScrewMountingOption extends React.Component<{update: Function, range: Area1D, length}, {screwSettings: any}> {

    constructor(props) {
        super(props);
        this.update = this.update.bind(this);
        this.addScrew = this.addScrew.bind(this);
        this.delete = this.delete.bind(this);
        this.updateScrewDiameter = this.updateScrewDiameter.bind(this);

        this.state = {
            screwSettings: {screws: [], d: 30}
        };
    }

    render() {
        return (<div>
                <h5>SCREWS    <COMP.BTNAdd onClick={this.addScrew} /></h5>
                <div className="indent">
                    {this.state.screwSettings.screws.map((screw, i) => {
                        return (<COMP.ScrewPosition1D range={this.props.range} id={i} onDelete={this.delete} onUpdate={this.update}/>)
                        })
                    }
                    <COMP.NumValue label="Diameter in mm" onUpdate={this.updateScrewDiameter} default={40}  min={0} max={80}/>
                </div>
            </div>);
    }

    private updateScrewDiameter(val: number) {
        let screwOptions = this.state.screwSettings;
        screwOptions.d = val;
        this.setState({screwSettings: screwOptions});
        this.props.update(this.state.screwSettings);
    }

    private delete(id) {
        let screwSettings = this.state.screwSettings;
        screwSettings.screws.splice(id, 1);
        this.setState({screwSettings: screwSettings});
        this.props.update(this.state.screwSettings);
    }

    private addScrew(event) {
        let screwSettings = this.state.screwSettings;
        screwSettings.screws.push(100);
        this.setState({screwSettings: screwSettings});
        this.props.update(this.state.screwSettings);
    }

    private update(val: number, id: number) {
        let screwSettings = this.state.screwSettings;
        screwSettings.screws[id] = val;
        this.setState({screwSettings: screwSettings});
        this.props.update(this.state.screwSettings);
    }

}
