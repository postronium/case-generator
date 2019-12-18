import * as React from "react";
import { connect } from 'react-redux';
import Position2D from "./UIPosition";
import { movePcb } from "../redux/actions";
import Area2D from "../utils/Area2D";

interface Vector3D {x: number, y: number, z: number}

const mapStateToProps = (state, props) => {
    return {
        position: state.containers[props.index].pos,
        maxCaseSize: state.config.maxCaseSize,
        pcbSize: {x: state.containers[props.index].pcb.dimX, y: state.containers[props.index].pcb.dimY}
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onUpdate: (pos) => dispatch(movePcb({
            pos: pos,
            index: props.index
        }))
    };
}

class UIPCBPlacement extends React.Component<{
    index: number, position: Vector3D, maxCaseSize: Vector3D, pcbSize: {x: number, y: number}, onUpdate: Function}> {

    constructor(props) {
        super(props);
        this.onUpdate = this.onUpdate.bind(this);
    }

    render() {
        const validArea = new Area2D(
            this.props.maxCaseSize.x - this.props.pcbSize.x,
            this.props.maxCaseSize.y - this.props.pcbSize.y);
        return (<div id="pcb-placement">
            <h5>Position</h5>
            <p>Available area : 130x130mm</p>
            <Position2D id={-1}
                validArea={validArea}
                initialPos={{x: this.props.position.x, y: this.props.position.y, z: 0}}
                onUpdate={this.onUpdate}/>
        </div>);
    }

    private onUpdate(position: Vector3D, index: number) {
        this.props.onUpdate({x: position.x, y: position.y, z: 0});
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UIPCBPlacement);
