import * as React from "react";
import { connect } from "react-redux";

import { removePCB } from "../redux/actions";
import UICollapseItem from "./UICollapse/UICollapseItem";
import UIModelParameter from "./UIModelParameter";
import * as COMP from './UIutils';
import UIPCBPlacement from "./UIPCBPlacement";
import UISetShield from "./UISetShield";

const mapStateToProps = state => {
    return {
        models: state.containers.map(cont => cont.pcb),
        colors: state.ui.colorsList
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onDelete: index => dispatch(removePCB({index: index}))
    };
}

const UIModelList = (props: {models: Array<any>, colors: string[], onDelete: Function}): any => {
    return props.models.map((model, i) => {
        return (
            <UICollapseItem rootId="0" itemId={""+i} title={model.name}
                    style={{backgroundColor: props.colors[i]}}>
                <UIModelParameter listPos={i} />
                <hr/>
                <UIPCBPlacement index={i}/>
                <hr/>
                <UISetShield modelIndex={i}/>
                <hr/>
                <COMP.BTNDelete id={i} onClick={(event) => props.onDelete(event.target.id)}/>
            </UICollapseItem>
        );
    });
}

export default connect(mapStateToProps, mapDispatchToProps)(UIModelList);
