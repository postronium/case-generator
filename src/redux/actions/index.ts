import * as A from "../constants/action-types";


//PCB manipulations
export function addPCB(payload) {
  return { type: A.ADD_PCB, payload };
};

export function removePCB(payload) {
    return { type: A.REMOVE_PCB, payload };
}

export function movePcb(payload) {
    return { type: A.MOVE_PCB, payload };
}

export function setShield(payload) {
    return { type: A.SET_SHIELD, payload };
};

export function toggleConnectorHole(payload) {
    return {type: A.TOGGLE_HOLE, payload };
}

export function onToggleTopDisplay(payload) {
    return {type: A.TOGGLE_DISPLAY_TOP, payload };
}
