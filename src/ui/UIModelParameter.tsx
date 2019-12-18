import * as React from "react";
import { connect } from "react-redux";

import UICheckbox from "./UICheckbox";
import { toggleConnectorHole } from "../redux/actions";
import { Connector } from "../redux/types";

const mapStateToProps = (state, props) => {
    let shieldConnectors = [];
    if (state.containers[props.listPos].shields.length != 0)
        shieldConnectors = state.containers[props.listPos].shields[0].pcb.connectors;
    return {
        connectors: state.containers[props.listPos].pcb.connectors,
        shieldConnectors: shieldConnectors
    };
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        onToggleHole: param => dispatch(toggleConnectorHole({
            modelIndex: props.listPos,
            connectorIndex: param.index,
            enabled: param.isChecked,
            isShield: false
        })),
        onToggleHoleShield: param => dispatch(toggleConnectorHole({
            modelIndex: props.listPos,
            connectorIndex: param.index,
            enabled: param.isChecked,
            isShield: true
        })),
    };
};


class UIModelParameter extends React.Component<{listPos: number, connectors: Array<Connector>,
        shieldConnectors: Array<Connector>, onToggleHole: Function, onToggleHoleShield: Function}> {

    render() {
        const mainModelBoxes = this.props.connectors.map((conn, i) => {
            return (<UICheckbox
                onChange={this.props.onToggleHole}
                checked={conn.en == 1}
                index={i}
                name={conn.name}/>);
        }, this);

        const shieldBoxes = this.props.shieldConnectors.map((conn, i) => {
            return (<UICheckbox
                onChange={this.props.onToggleHoleShield}
                checked={conn.en == 1}
                index={i}
                name={conn.name}/>);
        }, this);

        let shieldConnectorsU = (<div></div>);
        if (this.props.shieldConnectors.length != 0) {
            shieldConnectorsU = (
                <div>
                    <hr/>
                    <h4>Shield connectors</h4>
                    {shieldBoxes}
                </div>
            );
        }


        return (<div>
                    <div id="connectors-container">
                            <h4>Connectors</h4>
                            <p>Check the connectors to make a hole in the case.</p>
                            {mainModelBoxes}
                            {shieldConnectorsU}
                        <br/>
                    </div>
                </div>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UIModelParameter);
