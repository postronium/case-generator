import * as A from "../constants/action-types";
import initialState from "../initState";
import produce from 'immer';
import * as PCB from "./pcb";
import * as CONN from './connector';


interface Action<T> {type: string, payload: T}
let rootReducer = function(state = initialState, action) {
    switch(action.type) {
        case A.ADD_PCB:                 return PCB.addPcb(state, action);
        case A.REMOVE_PCB:              return PCB.rmPcb(state, action);
        case A.TOGGLE_HOLE:             return CONN.toggleConnectorHole(state, action);
        case A.TOGGLE_DISPLAY_TOP:      return toggleDisplayTop(state, action);
        case A.MOVE_PCB:                return PCB.movePcb(state, action);
        case A.SET_SHIELD:              return PCB.setShield(state, action);
        case A.REMOVE_SHIELD:           return PCB.removeShield(state, action);
    }
    return state;
}

let toggleDisplayTop = (state = initialState, action) => {
    const finalState = produce(state, draftState => {
        draftState.config.generateTop = action.payload.isChecked;
    });

    return finalState;
};

export default rootReducer;
