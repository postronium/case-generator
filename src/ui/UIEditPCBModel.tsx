import * as React from "react";
import * as ReactDOM from "react-dom";

import PCBModel from '../model/PCBModel';
import * as COMP from '../ui/UIutils';
import Area2D from '../utils/Area2D';
import PCBConnector from '../model/PCBConnector';
import UIScrews from './UIScrews';
import UIAddConnector from './UIAddConnector';
import UICheckbox from '../ui/UICheckbox';
import UIPCBPlacement from './UIPCBPlacement';
import * as CLUSTER from '../model/PCBModelCluster';

export default class UIEditPCBModel extends
        React.Component<{pcbContainer: CLUSTER.PCBContainer, onUpdate: Function}> {

    //TODO change location of this variable
    private static MIN_SCREW_POSITION = 25;
    private static LIMIT: Area2D = new Area2D(1500, 1500);

    private isPrimary: boolean;

    constructor(props) {
        super(props);
        this.onScrewUpdate = this.onScrewUpdate.bind(this);
        this.onPCBDimensionUpdate = this.onPCBDimensionUpdate.bind(this);
        this.onConnectorUpdate = this.onConnectorUpdate.bind(this);
        this.onCheckSlimcase = this.onCheckSlimcase.bind(this);
        this.isPrimary = this.props.pcbContainer == undefined;
    }

    render() {
        let uiItems = [];

        let area = new Area2D(this.props.pcbContainer.pcb.getDimensionX(), this.props.pcbContainer.pcb.getDimensionY());
        area = area.getWithMargin(UIEditPCBModel.MIN_SCREW_POSITION);

        let placemenet;
        if (!this.isPrimary)
            placemenet = <UIPCBPlacement area={UIEditPCBModel.LIMIT} onUpdate={this.props.onUpdate} pcbContainer={this.props.pcbContainer}/>;

        return (<div>
                <div id="pcb-container">
                    <h5>Edit PCB Model</h5>
                    <UICheckbox index={-1} name={"Slim Case"} checked={this.props.pcbContainer.pcb.isSlimCase()} onChange={this.onCheckSlimcase}/>
                    {placemenet}
                </div>
                <div>{this.props.children}</div>
            </div>);
    }

    private onCheckSlimcase(checked: boolean, index: number) {
        this.props.pcbContainer.pcb.setSlimCase(checked);
        this.props.onUpdate();
    }

    private onConnectorUpdate(connectors: PCBConnector[]) {
        this.props.pcbContainer.pcb.updateConnectors(connectors);
        this.props.onUpdate();
    }

    private onPCBDimensionUpdate(val: number) {
        this.props.pcbContainer.pcb.setDimY(val);
        this.props.onUpdate();
    }

    private onScrewUpdate(screws: Array<Array<number>>) {
        this.props.pcbContainer.pcb.setScrewPositions(screws);
        this.props.onUpdate();
    }

}
