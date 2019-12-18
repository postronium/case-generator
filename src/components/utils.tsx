import * as React from "react";

import Area2D from '../utils/Area2D';
import Area1D from '../utils/Area1D';

let checkUserInput = function(val: number, min: number, max: number) {
    return !(isNaN(val) || val > max || val < min);
}

export class BTNDelete extends React.Component<{id: number, onClick: Function}>{
    render() {
        return (<input
            className="btn btn-danger btn-sm"
            value="Delete"
            type="button"
            id={this.props.id.toString()}
            onClick={(event) => this.props.onClick(event)}/>);
    }
}

export class BTNAdd extends React.Component<{onClick: Function}> {
    render() {
        return (<input
            className="btn btn-success btn-sm"
            value="Add"
            type="button"
            onClick={(event) => this.props.onClick(event)}/>);
    }
}

export class Position1D extends React.Component<{onUpdate: Function, val: number, max: number, min: number, label: string}, {val: number}> {

    public constructor(props) {
        super(props);
        this.state = {val: this.props.val};
    }

    render() {

        return (<div className="input-group input-group-sm">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="position-1d-prefix">{this.props.label}</span>
                    </div>
                    <input
                        type="number"
                        max={this.props.max/10}
                        min={this.props.min/10}
                        value={this.state.val/10}
                        onChange={(event) => {
                                let val = parseFloat(event.target.value)*10;
                                this.setState({val: val});
                                if(checkUserInput(val, this.props.min, this.props.max))
                                    this.props.onUpdate(val);
                            }}
                        className="form-control"
                        aria-describedby="position-1d-prefix" />
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="position-1d-suffix">Step in mm</span>
                    </div>
            </div>);
    }
}



export class NumValue extends React.Component<{max: number, min: number, default: number, onUpdate: Function, label: string}, {val: number}> {
    constructor(props) {
        super(props);
        this.state = {val: this.props.default};
    }

    render() {
        return (<div className="input-group input-group-sm">
            <div className="input-group-prepend">
                <span className="input-group-text" id="position-1d-prefix">{this.props.label}</span>
            </div>
            <input
                type="number"
                max={this.props.max/10}
                min={this.props.min/10}
                value={this.state.val/10}
                onChange={(event) => {
                        let val = parseFloat(event.target.value)*10;
                        this.setState({val: val});
                        if (checkUserInput(val,  this.props.min, this.props.max))
                            this.props.onUpdate(val);
                    }}
                step={0.1}
                className="form-control"
                aria-describedby="position-1d-prefix" />
        </div>);
    }
}

export class ScrewPosition1D extends React.Component<{range: Area1D, onDelete: Function, onUpdate: Function, id: number}, {val: number}> {
    constructor(props) {
        super(props);
        this.state = {val: 100};
    }

    render() {
        return (<div className="input-group input-group-sm">
            <div className="input-group-prepend">
                <span className="input-group-text" id="position-1d-prefix">mm</span>
            </div>
            <input
                type="number"
                max={this.props.range.max/10}
                min={this.props.range.min/10}
                value={this.state.val/10}
                onChange={(event) => {
                        let val = parseFloat(event.target.value)*10;
                        this.setState({val: val});
                        if (checkUserInput(val,  this.props.range.min, this.props.range.max))
                            this.props.onUpdate(val, this.props.id);
                    }}
                className="form-control"
                aria-describedby="position-1d-prefix" />
            <BTNDelete onClick={this.props.onDelete} id={this.props.id} />
        </div>);
    }
}
