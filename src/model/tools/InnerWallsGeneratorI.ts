import { PCBContainer } from '../PCBModelCluster';

/*
 * Generate the locations and sizes of any inner wall of a case
 */
export default interface InnerWallsGeneratorI {
    getWallsOfPCBs();

    addPCB(pcb: PCBContainer);
    removePCB(pcb: PCBContainer);
}
