import * as CASE from "./CaseModels";
import PCBConnector from './PCBConnector';
import GeneratableComponentInterface from '../generator/GeneratableComponentInterface';
import AlterablePCBI from './AlterablePCBI';
/*
    Units are in 1/10 mm (10=1mm in reality)
    each position has a 'pos' prefix and each dimension a 'dim' prefix
*/

export default class PCBModel implements AlterablePCBI {

    public static CORNER_LEFT_FRONT: number = 0;              //0 = left corner of the side 0
    public static CORNER_RIGHT_FRONT: number = 1;             //1 = right corner of the side 0
    public static CORNER_RIGHT_BACK: number = 2;               //2 = right corner of the side 2
    public static CORNER_LEFT_BACK: number = 3;              //3 = left corner of the side 2
    public static SIDE_FRONT: number = 0;       //0 front side, long side of the RPI3 with the origin on the left
    public static SIDE_LEFT: number = 1;        //1 left side, short side of the RPI3, with the origin on the right
    public static SIDE_BACK: number = 2;        //2 back side, long side of the RPI3, disconnected from the origin
    public static SIDE_RIGHT: number = 3;       //3 right side, short side of the RPI3, disconnected from the origin

    private static DEFAULT_PCB_THICKNESS = 15;
    private static LAST_ID = 0;

    name: string;

    //basic parameter of each Raspberry PI
    private dimX: number;   // lengthgetDimensionY
    private dimY: number;   // width
    private dimZup: number;
    private slimFitZup: number[];
    private dimZdown: number;
    private screwPositions: number[][];
    private id: number;
    private isSlim: boolean;
    private realisticModel: string;
    category: string;
    connectors: PCBConnector[];
    minZlevel: number;         //min zup Level
    maxZlevel: number;         //max zup Level
    pcbThickness: number;

    screwHeadDiam: number;

    walls: Array<boolean>;


    constructor(name: string, dimX: number, dimY: number, dimZup: number, dimZdown: number, screwPositions: number[][]) {
        this.name = name;
        this.dimX = dimX;
        this.dimY = dimY;
        this.dimZup = dimZup;
        this.dimZdown = dimZdown;
        this.screwPositions = screwPositions;
        this.minZlevel = this.dimZup;
        this.maxZlevel = this.dimZup;
        this.walls = [true, true, true, true];
        this.pcbThickness = PCBModel.DEFAULT_PCB_THICKNESS;
        this.connectors = [];
        this.id = PCBModel.LAST_ID;
        PCBModel.LAST_ID++;
    }

    public getRealisticModel() : string {
        return this.realisticModel;
    }

    public getNPCBs() {
        return 1;
    }

    public setSlimCase(isSlim: boolean) {
        this.isSlim = isSlim;
    }

    public isSlimCase() {
        return this.isSlim;
    }

    public getId() {
        return this.id;
    }

    public getScrewPositions() {
        return this.screwPositions.filter((pos) => {
            return this.isScrewOnPcb(pos[0], pos[1]);
        });
    }

    public getConnectors() {
        return this.connectors;
    }

    public setScrewPositions(screwPositions: number[][]) {
        this.screwPositions = screwPositions;
    }

    public isScrewOnPcb(x: number, y: number) {
        let minX = CASE.CaseModel.MIN_SCREW_POS;
        let minY = CASE.CaseModel.MIN_SCREW_POS;
        let maxX = this.dimX - CASE.CaseModel.MIN_SCREW_POS;
        let maxY = this.dimY - CASE.CaseModel.MIN_SCREW_POS;

        return x <= maxX && x >= minX && y <= maxY && y >= minY;
    }

    public getDimensionZUp() {
        if (this.isSlim)
            return this.getSlimFitZup(0);
        return this.dimZup;
    }

    public getDimensionZDown() {
        return this.dimZdown;
    }

    public getDimensionX() {
        return this.dimX;
    }

    public getDimensionY() {
        return this.dimY;
    }

    public getDimension(dim: string): number {
        switch(dim) {
            case 'x':
                return this.getDimensionX();
            case 'y':
                return this.getDimensionY();
            case 'z':
                return this.getDimensionFullHeight();
            default:
                console.log("Other dimensions than 'x', 'y' or 'z' are not supported !");
        }
    }

    public getDimensionFullHeight() {
        return this.dimZup + this.dimZdown;
    }

    public getPCBThickness() {
        return this.pcbThickness;
    }

    public getNeightboorPCBOffset(sideId: number, caseModel: CASE.CaseModel) {
        let x = 0;
        let y = 0;
        let side = caseModel.getHSideMargin(this);
        switch(sideId) {
            case PCBModel.CORNER_LEFT_FRONT:
                break;                                      //No change, the corner is at (0, 0)
            case PCBModel.CORNER_RIGHT_FRONT:
                x = this.dimX + caseModel.getHTol()*2;
                break;
            case PCBModel.CORNER_RIGHT_BACK:
                x = this.dimX + caseModel.getHTol()*2;
                y = this.dimY + caseModel.getHTol()*2;
                break;
            case PCBModel.CORNER_LEFT_BACK:
                y = this.dimY + caseModel.getHTol()*2;
                break;
            default:
                console.error("invalide side ID (can be from 0 to 3)");
                break;
        }
        return {x: x, y: y};
    }

    public getCaseEdge(edgeId: number, caseModel: CASE.CaseModel) {
        let x, y;
        let side = caseModel.getHSideMargin(this);
        switch(edgeId) {
            case PCBModel.CORNER_LEFT_FRONT:
                x = -side;
                y = -side;
                break;
            case PCBModel.CORNER_RIGHT_FRONT:
                x = this.dimX + side;
                y = -side;
                break;
            case PCBModel.CORNER_RIGHT_BACK:
                x = this.dimX + side;
                y = this.dimY + side;
                break;
            case PCBModel.CORNER_LEFT_BACK:
                x = -side;
                y = this.dimY + side;
                break;
            default:
                console.error("invalide edge ID (can be from 0 to 3)");
                break;
        }
        return {x: x, y: y};
    }

    public getCaseEdges(caseModel: CASE.CaseModel) {
        let sides = [
            PCBModel.CORNER_LEFT_FRONT,
            PCBModel.CORNER_RIGHT_FRONT,
            PCBModel.CORNER_RIGHT_BACK,
            PCBModel.CORNER_LEFT_BACK
        ];
        return sides.map((side) => {
            return this.getCaseEdge(side, caseModel);
        }, this);
    }

    public resetToDefault(model: CASE.CaseModel) {
        this.dimZup = this.maxZlevel;
        this.resetConnectors(model);
    }

    public resetConnectors(model: CASE.CaseModel) {
        this.connectors.forEach(model.connectorEnabled);
    }

    public forEach3SupportScrew(func) {
        this.screwPositions.forEach(func);
    }

    public static fromJSON(json: any) {
        console.log(json["name"]);
        let rpi = new PCBModel(
            json["name"],
            json["dimX"],
            json["dimY"],
            json["dimZup"],
            json["dimZdown"],
            json["screwPositions"]
        );

        rpi.realisticModel = json['realisticModel'] == undefined ? "" : json['realisticModel'];

        rpi.pcbThickness = json["pcbThickness"] ? json["pcbThickness"] : PCBModel.DEFAULT_PCB_THICKNESS;

        rpi.connectors = json["connectors"].map(PCBConnector.fromJSON);

        rpi.screwHeadDiam = json["screwHeadDiameter"];

        rpi.slimFitZup = json["slimFitZup"];

        rpi.isSlim = json["isSlim"] == undefined ? false : json["isSlim"];

        rpi.category = json["cat"];

        return rpi;
    }

    //From alterable interface Name

    public updateConnectors(connectors: PCBConnector[]) {
        console.log("TODO update connectors");
        return;
    }

    public isEditable() {
        return true;
    }

    public setDimX(dimX: number) {
        this.dimX = dimX;
    }

    public setDimY(dimY: number) {
        this.dimY = dimY;
    }

    public setDimZ(dimZ: number) {
        console.log("TODO Edit dim Z here");
    }

    public getScrewheadRadius() {
        return this.screwHeadDiam/2;
    }

    public getSlimFitZup(level: number) {
        if (this.slimFitZup == undefined || this.slimFitZup.length == 0)
            return this.dimZup;
        return this.slimFitZup[level];
    }

    public getInnerWalls() {
        return undefined;       //not inner walls for single pcb
    }

    public getSecondaryInnerWalls() {
        return undefined;       //not inner walls for single pcb
    }

    public toJson() {
        let json = {};

        json["name"] = this.name;
        json["dimX"] = this.dimX;
        json["dimY"] = this.dimY;
        json["dimZup"] = this.dimZup;
        json["dimZdown"] = this.dimZdown;
        json["screwPositions"] = this.screwPositions;

        json["pcbThickness"] = this.pcbThickness;

        json["connectors"] = this.connectors.map(conn => conn.toJson());
        json["screwHeadDiameter"] = this.screwHeadDiam;
        json["slimFitZup"] = this.slimFitZup;
        json["isSlim"] = this.isSlim;

        return json;
    }

}
