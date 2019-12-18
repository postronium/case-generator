import * as React from "react";
import { connect } from "react-redux";

import PCBModel from "../model/PCBModel";
import * as Modal from "./UIModal";
import { addPCB } from "../redux/actions";

const mapStateToProps = state => {
    return {models: state.models};
}

const mapDispatchToProps = (dispatch) => {
    return {
      onAddModel: pcb => dispatch(addPCB(pcb))
    };
};

class UIAddModel extends React.Component<{models: Array<any>, onAddModel: Function},
        {category: number, item: number, selecIndex: number}> {

    private categories: string[];

    constructor(prop: any) {
        super(prop);
        this.categories = [];
        this.state = {category: 0, selecIndex: -1, item: -1};
        let modelCategories = this.props.models.map((item) => item.cat);
        modelCategories.forEach((el) => {
            if(this.categories.indexOf(el) === -1) this.categories.push(el);
        });
    }

    public render() {
        let categoryOption = this.categories.map((cat, i) => {
            return (<option value={i}>{cat}</option>);
        });

        var optionRows = this.props.models.map((model, i) => {
                if (model.cat == this.categories[this.state.category]) {
                    return (<option value={i}>{model.name}</option>);
                } else {
                    return undefined;
                }
            }).filter((model) => model != undefined);
        return (<div>
            <Modal.Modal text="Add device" tag="add-device" className="btn btn-primary btn-block">
                <Modal.ModalHeader title="Add device" tag="add-device"/>
                <Modal.ModalBody>
                    <div className="form-group">
                        <label>Select a device category.</label>
                        <select multiple className="form-control" onChange={(event) => {
                            this.setState({
                                category: Number.parseInt(event.target.value),
                                selecIndex: -1
                            });
                        }}>
                          {categoryOption}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Select a device to add.</label>
                        <select value={this.state.selecIndex == -1 ? "" : this.state.selecIndex + ""} disabled={this.state.category == -1} multiple className="form-control" onChange={(event) => {
                                this.setState({selecIndex: Number.parseInt(event.target.value)});
                            }}>
                          {optionRows}
                        </select>
                    </div>
                </Modal.ModalBody>
                <Modal.ModalFooter>
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button disabled={this.state.selecIndex == -1} type="button" className="btn btn-success" data-dismiss="modal" onClick={
                        (event) => this.props.onAddModel(this.props.models[this.state.selecIndex])
                    }>
                        Add
                    </button>
                </Modal.ModalFooter>
            </Modal.Modal>
        </div>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UIAddModel);
