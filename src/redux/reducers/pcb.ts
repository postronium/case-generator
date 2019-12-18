import initialState from "../initState";
import producer from 'immer';

interface Action<T> {type: string, payload: T}

const addPcb = function(state = initialState, action: Action<any>) {
    const newContainer = {
        pcb: action.payload,
        pos: {x: state.nextPos.x, y: state.nextPos.y, z: state.nextPos.z},
        shields: []
    };

    const posY = state.nextPos.y;

    let finalState = Object.assign({}, state, {
        containers: state.containers.concat(newContainer),
        nextPos: {x: 0, y: posY + state.config.innerWallThickness + action.payload.dimY, z: 0}
    });

    return finalState;
}

const setShield = function(state = initialState, action: Action<{shield: any, modelIndex: number}>) {
    const payload = action.payload;
    const modelInterface = payload.shield.interface.find((int) => int.model == state.containers[payload.modelIndex].pcb.name);
    if (modelInterface == undefined) {
        console.error("Error in reducer addShield, no interface corresponding found!");
        return;
    }
    const containerPos = state.containers[payload.modelIndex].pos;
    const pos = {
        x: containerPos.x + modelInterface.offset.x,
        y: containerPos.y + modelInterface.offset.y,
        z: containerPos.z + modelInterface.offset.z
    };
    const newContainer = {
        pcb: payload.shield,
        pos: pos
    };
    let finalState = producer(state, draftState => {
        draftState.containers[payload.modelIndex].shields[0] = newContainer
    });

    return finalState;
}

const removeShield = function(state = initialState, action: Action<{modelIndex: number}>) {
    let finalState = producer(state, draftState => {
        draftState.containers[action.payload.modelIndex].shields = []
    });

    return finalState;
}

const rmPcb = function(state = initialState, action: Action<{index: number}>) {
    let finalState = producer(state, draftState => {
        const removeCont = draftState.containers[action.payload.index]
        const removePosY = removeCont.pos.y;
        draftState.containers.splice(action.payload.index, 1);
        draftState.containers.filter(cont => cont.pos.y > removePosY).forEach((cont) => {
            cont.pos.y -= (removeCont.pcb.dimY + state.config.innerWallThickness);removeCont.pcb.dimY
        });
        draftState.nextPos.y -= removeCont.pcb.dimY;
    });

    return finalState;
}

const movePcb = function(state = initialState, action: Action<any>) {
    const payload = action.payload;
    const finalState = producer(state, draftState => {
        draftState.containers[payload.index].pos.x = payload.pos.x;
        draftState.containers[payload.index].pos.y = payload.pos.y;
        draftState.containers[payload.index].pos.z = payload.pos.z;
    });

    return finalState;
}

export {addPcb, rmPcb, movePcb, setShield, removeShield};
