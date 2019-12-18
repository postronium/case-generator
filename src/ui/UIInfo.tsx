import * as React from "react";
import { connect } from 'react-redux';

import GeneratableComponentInterface from '../generator/GeneratableComponentInterface';
import { CaseModel } from '../model/CaseModels';

const mapStateToProps = (state, props) => {
    return {
        length: 0,
        width: 0,
        height: 0
    };
};

class UIInfo extends React.Component<{length: number, width: number, height: number}> {

    render() {
        return (<div className="border">
            <h5>General informations</h5>
            <p>Length: {this.props.length}</p>
            <p>Width: {this.props.width}</p>
            <p>Height: {this.props.height}</p>
        </div>);
    }
}

export default connect(mapStateToProps)(UIInfo);
