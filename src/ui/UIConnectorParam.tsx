import * as React from "react";

import AlterablePCBConnectorI from '../model/AlterablePCBConnectorI';
import { ConnectorModel } from '../model/ConnectorModels';
import * as COMP from './UIutils';
import UICheckbox from './UICheckbox';
import Area2D from '../utils/Area2D';
import Position2D from "./UIPosition";

export default class UIAddConnector extends React.Component<{
        area: Area2D, connectorData: AlterablePCBConnectorI, onUpdate: Function, onDelete: Function, index: number},
        {}>{

    private sideOptions: string[];
    private connectorType: ConnectorModel;

    constructor(props) {
        super(props);
        this.onSideChange = this.onSideChange.bind(this);
        this.onPositionChange = this.onPositionChange.bind(this);
        this.onHeightChange = this.onHeightChange.bind(this);
        this.onOutsetChange = this.onOutsetChange.bind(this);
        this.onHoleChecked = this.onHoleChecked.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.sideOptions = ["0", "1", "2", "3"];
        this.connectorType = this.props.connectorData.getModel();
    }

    render() {
        let isTop = this.connectorType.topConnector;//TODO may be wrong
        let domElement = [];
        if (isTop) {
            return (<div className="indent item-separation">
                <Position2D onUpdate={(valX, valY, id) => {
                        this.props.connectorData.setPositionX(valX);
                        this.props.connectorData.setPositionY(valY);
                        this.updateChange();
                    }} id={this.props.index}
                    validArea={this.props.area} initialPos={{x: this.props.connectorData.getPositionX(), y: this.props.connectorData.getPositionY(), z: 0}} />
                <UICheckbox index={-1} name={"Make Hole in case"} checked={this.props.connectorData.isHoleOpen()} onChange={this.onHoleChecked}/>
            </div>);
        }

        let maxPos: number = 0;
        let minPos: number = this.connectorType.startX;
        if (this.props.connectorData.getSide()%2 == 0)
            maxPos = (this.props.area.getMaxX() - this.connectorType.startX)/10*10;
        else
            maxPos = (this.props.area.getMaxY() - this.connectorType.startX)/10*10;

        return (<div className="indent item-separation">
            <div className="input-group input-group-sm">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="connector-side-label">Name </span>
                </div>
                <input type="text" className="form-control form-control-sm"
                    value={this.props.connectorData.getName()}
                    onChange={this.onNameChange} />
            </div>
            <div className="input-group input-group-sm">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="connector-side-label">Side :</span>
                </div>
                <select className="form-control form-control-sm custom-select" onChange={this.onSideChange} value={this.props.connectorData.getSide()} name="side">
                    {this.sideOptions.map((option, index) => {
                        return (<option value={index}>{option}</option>);
                        })}
                </select>
            </div>
            <COMP.NumValue onUpdate={this.onPositionChange} default={this.props.connectorData.getPositionX()}
                min={minPos} max={maxPos} label="Position" />
            <COMP.NumValue onUpdate={this.onHeightChange} default={this.props.connectorData.getPositionZ()}
                min={minPos} max={maxPos} label="Height from PCB" />
            <COMP.NumValue onUpdate={this.onOutsetChange} default={this.props.connectorData.getOutset()}
                min={minPos} max={maxPos} label="Outset" />
            <COMP.BTNDelete id={this.props.index} onClick={(event) => this.props.onDelete(this.props.index)} />
            <UICheckbox index={-1} name={"Make Hole in case"} checked={this.props.connectorData.isHoleOpen()} onChange={this.onHoleChecked}/>
        </div>);
    }

    private onNameChange(event) {
        this.props.connectorData.setName(event.target.value);
        this.updateChange();
    }

    private updateChange() {
        this.props.onUpdate(this.props.index, this.props.connectorData);
    }

    private onHoleChecked(checked, index) {
        this.props.connectorData.setIsHoleOpen(checked);
        this.updateChange();
    }

    private onSideChange(event) {
        let rawVal = parseInt(event.target.value);
        this.props.connectorData.setSide(isNaN(rawVal) ? 0 : rawVal);
        this.updateChange();
    }

    private onPositionChange(val: number) {
        this.props.connectorData.setPositionX(isNaN(val) ? 0 : val);
        this.updateChange();
    }

    private onHeightChange(val: number) {
        this.props.connectorData.setPositionZ(isNaN(val) ? 0 : val);
        this.updateChange();
    }

    private onOutsetChange(val: number) {
        this.props.connectorData.setOutset(isNaN(val) ? 0 : val);
        this.updateChange();
    }

}
