import * as React from "react";
import { connect } from "react-redux";

import * as Modal from "./UIModal";
import { setShield } from "../redux/actions";
import * as A from "../redux/constants/action-types";


const mapStateToProps = (state, props) => {
    return {
        shields: state.shields,
        modelContainer: state.containers[props.modelIndex]
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAddShield: payload => dispatch(setShield(payload)),
        onRemoveShield: payload => dispatch({type: A.REMOVE_SHIELD, payload: payload})
    };
};

/**
 * The first element in the selectedIndex is "No shield" the element 1 ist the first possible shield
 */
class UISetShield extends React.Component<{
        shields: Array<any>, onAddShield: Function, modelIndex: number, modelContainer: any, onRemoveShield: Function
    }, {selectedIndex: number}> {

    constructor(props) {
        super(props);
        this.state = {selectedIndex: 0};
        this.save = this.save.bind(this);
    }

    private save(event) {
        if (this.state.selectedIndex == 0) {
            this.props.onRemoveShield({modelIndex: this.props.modelIndex});
        } else {
            this.props.onAddShield({shield: this.props.shields[this.state.selectedIndex-1],
                    modelIndex: this.props.modelIndex});
        }
    }

    public render() {
        let buttonText = "Modify shield";
        if (this.props.modelContainer.shields.length == 0)
            buttonText = "Add shield";
        var optionRows = this.props.shields.filter((shield, i) => {
                const sh = shield.interface.find((int) => int.model == this.props.modelContainer.pcb.name);
                return sh != undefined;
            }).map((model, i) => (<option value={i+1}>{model.name}</option>));
        optionRows.push(<option value={0}>{"No shield"}</option>);

        const modelId = "set-shield-" + this.props.modelIndex;
        return (<div>
            <Modal.Modal disabled={optionRows == undefined || optionRows.length == 0}
                    text={buttonText} tag={modelId} className="btn btn-primary btn-block">
                <Modal.ModalHeader title="Set shield" tag={modelId}/>
                <Modal.ModalBody>
                    <div className="form-group">
                        <label>Select a shield.</label>
                        <select value={this.state.selectedIndex} className="form-control" onChange={(event) => {
                            this.setState({selectedIndex: Number.parseInt(event.target.value)});
                        }}>
                            {optionRows}
                        </select>
                    </div>
                </Modal.ModalBody>
                <Modal.ModalFooter>
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="button" className="btn btn-success" data-dismiss="modal" onClick={this.save}>
                        Save
                    </button>
                </Modal.ModalFooter>
            </Modal.Modal>
        </div>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UISetShield);
