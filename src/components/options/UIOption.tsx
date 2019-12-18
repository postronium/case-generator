import * as React from "react";

import PCBModel from '../../model/PCBModel';
import CaseOption from '../../generator/CaseOption';
import UICheckbox from '../UICheckbox';

export default class UIOption extends React.Component<{option: CaseOption, update: Function}, {activated: boolean}> {

    constructor(props) {
        super(props);

        this.state = {activated: false};
        this.onChange = this.onChange.bind(this);
    }

    render() {
        return (<div>
            <UICheckbox index={-1} checked={this.state.activated} onChange={this.onChange} name={this.props.option.getOptionName()}/>
            <div className="case-option-param border">{this.getChildren()}</div>
        </div>);
    }

    private getChildren() {
        if (this.state.activated) {
            return this.props.option.getSettingUI(this.props.update);
        }
    }

    private onChange(checked: boolean, index: number) {
        this.props.option.isActivated = checked;
        this.setState({activated: checked});
        this.props.update();
    }
}
