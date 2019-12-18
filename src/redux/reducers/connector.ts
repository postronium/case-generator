import produce from 'immer';
import initialState from '../initState';

interface Action<T> {type: string, payload: T}
interface ToggleHolePL {modelIndex: number, connectorIndex: number, enabled: boolean, isShield: boolean}

let toggleConnectorHole = (state = initialState, action: Action<ToggleHolePL>) => {
    const payload = action.payload;
    let finalState;
    if (payload.isShield) {
        finalState = produce(state, draftState => {
            draftState.containers[payload.modelIndex].shields[0].pcb.connectors[payload.connectorIndex].en = payload.enabled ? 1 : 0;
        });
    } else {
        finalState = produce(state, draftState => {
            draftState.containers[payload.modelIndex].pcb.connectors[payload.connectorIndex].en = payload.enabled ? 1 : 0;
        });
    }

    return finalState;
}

export {toggleConnectorHole};
