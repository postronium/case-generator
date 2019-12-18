import * as React from "react";

import AlterablePCBConnectorI from '../model/AlterablePCBConnectorI';
import PCBConnector from '../model/PCBConnector';
import UIConnectorParam from './UIConnectorParam';
import ComponentModel from '../model/ComponentModel';
import * as COMP from './UIutils';
import Area2D from '../utils/Area2D';
import UICollapseRoot from './UICollapse/UICollapseRoot';
import UICollapseItem from './UICollapse/UICollapseItem';
import Vector from '../utils/Vector';

export default class UIAddConnector extends React.Component<{area: Area2D, onUpdate: Function, connectors: AlterablePCBConnectorI[]}, {connectors: AlterablePCBConnectorI[]}>{

    selectedConnector: string;

    constructor(props) {
        super(props);
        this.onConnectorChange = this.onConnectorChange.bind(this);
        this.onAddConnector = this.onAddConnector.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.state = {connectors: this.props.connectors};
        this.selectedConnector = ComponentModel.conmponents[0].getName();
    }

    render() {
        let availableConnType = ComponentModel.conmponents.map((conn) => {
            return (<option value={conn.getName()}>{conn.getName()}</option>);
        });

        return (<div>
            <h5>CONNECTORS</h5>
            <div className="input-group input-group-sm mb-3">
                <select className="custom-select" onChange={(event) => {
                        this.selectedConnector = event.target.value;
                        this.setState({});
                    }} value={this.selectedConnector} name="connectorType">
                    {availableConnType}
                </select>
                <COMP.BTNAdd onClick={this.onAddConnector}/>
            </div>
            <UICollapseRoot id="-connector">
                {this.state.connectors.map((conn, index) => {
                    return (<UICollapseItem title={conn.getName()} itemId={""+index} rootId="-connector" style={{}}>
                        <UIConnectorParam area={this.props.area} connectorData={conn}
                            onDelete={this.onDelete} onUpdate={this.onConnectorChange} index={index}/>
                    </UICollapseItem>);
                })}
            </UICollapseRoot>
        </div>);
    }

    private onDelete(index: number) {
        let connectors = this.state.connectors;
        connectors.splice(index, 1);
        this.setState({connectors: connectors});
        this.props.onUpdate(connectors);
    }

    private onAddConnector(event) {
        let connectors = this.state.connectors;
        let type = ComponentModel.getComponentByType(this.selectedConnector);
        let side = type.getSideBoxes().length == 0 ? 4 : 0;
        let newConn = new PCBConnector("name", this.selectedConnector, side, new Vector(0, 0, 0), 0, false);
        connectors.push(newConn);
        this.setState({connectors: connectors});
        this.props.onUpdate(connectors);
    }

    private onConnectorChange(connectorIndex: number, connectorData: PCBConnector) {
        let connectors = this.state.connectors;
        connectors[connectorIndex] = connectorData;
        this.setState({connectors: connectors});
        this.props.onUpdate(connectors);
    }

}
