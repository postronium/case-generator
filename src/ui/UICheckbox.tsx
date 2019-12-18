import * as React from "react";

import PCBModel from '../model/PCBModel';

export default class UICheckbox extends React.Component<{index: number, name: string, checked: boolean, onChange: Function}, {isChecked: boolean}> {

    constructor(props) {
        super(props);
        this.state =  {isChecked: this.props.checked};
        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        this.props.onChange({isChecked: !this.state.isChecked, index: this.props.index});
        this.setState({isChecked: !this.state.isChecked});
    }

    componentWillReceiveProps(nextProps) {              //this is to update the state.checked when props.checked change
        this.setState({isChecked: nextProps.checked});
    }

    render() {
        let className = "custom-control custom-checkbox";
        if (this.props.index != -1) {
            className += " short";
        }
        return (<div onClick={this.onChange} className={className}>
            <input type="checkbox"
                checked={this.state.isChecked}
                className="custom-control-input" />
            <label className="custom-control-label">{this.props.name}</label>
        </div>);
    }
}
