import { CaseModel } from '../model/CaseModels';
import PCBConnector from '../model/PCBConnector';
import PCBConnectorI from '../model/PCBConnectorI';

export default interface GeneratableComponentInterface {

    getScrewPositions(): Array<any>;

    getConnectors(): PCBConnectorI[];

    getDimensionZUp(): number;

    //distance between z=0 and the bottom z of the rpi (without tolerance)
    getDimensionZDown(): number;

    getDimensionX(): number;

    getDimensionY(): number;

    //valide parameters: 'x', 'y', 'z'
    getDimension(dimension: string): number;

    getDimensionFullHeight(): number;

    getPCBThickness(): number;

    getNeightboorPCBOffset(sideId: number, caseModel: CaseModel): {x: number, y: number};

    getCaseEdge(edgeId: number, caseModel: CaseModel): {x: number, y: number};

    getCaseEdges(caseModel: CaseModel): Array<{x: number, y: number}>;


    getScrewheadRadius();

    //the smaller the number the smaller the height
    getSlimFitZup(level: number);

    getInnerWalls();

    getSecondaryInnerWalls();

    getNPCBs();

    toJson();
}
