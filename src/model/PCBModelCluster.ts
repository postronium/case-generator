import PCBModel from './PCBModel';
import { CaseModel } from './CaseModels';
import GeneratableComponentInterface from '../generator/GeneratableComponentInterface';
import AlterablePCBI from './AlterablePCBI';
import PCBGeneratorI from './PCBGeneratorI';
import Vector from '../utils/Vector';
import InnerWallsGenerator from './tools/InnerWallsGenerator';
import InnerWallsGeneratorI from './tools/InnerWallsGeneratorI';
import PCBGenerator from './PCBGenerator';

/*
 * Groups a pcbModel with it's information about his placement inside a PCBModelCluster.
 * Also contains the PCBGenerator of the Model
 */
export class PCBContainer {

    public pcb: PCBModel;
    private offset: Vector = new Vector(0, 0, 0);
    public pcbGenerator: PCBGeneratorI;

    constructor(pcbGenerator: PCBGeneratorI) {
        this.pcbGenerator = pcbGenerator;
    }

    public getOffset() : Vector {
        return this.offset;
    }

    public updateOffset(x: number, y: number, z?: number) {
        z = (z == undefined) ? this.offset.z : z;
        this.offset = new Vector(x, y, z);
        this.pcbGenerator = this.pcbGenerator.setOffset({x, y, z});
    }

    public getWallConnectors(side: number) {
        return this.pcb.getConnectors().filter(conn => conn.getSide() == side)
            .map((conn) => conn.getOffsetConnector(this.getOffset()));
    }

    public getScrewPositions() {
        return this.pcb.getScrewPositions().map((screwPos) => {
            return [screwPos[0] + this.offset.x, screwPos[1] + this.offset.y];
        });
    }

    public toJson() {
        var json = {};

        json["pcb"] = this.pcb.toJson();
        json["pos"] = {};
        json["pos"]["x"] = this.offset.x;
        json["pos"]["y"] = this.offset.y;
        json["pos"]["z"] = this.offset.z;
        json["color"] = this.pcbGenerator.getColor();

        return json;
    }

    public static fromJson(json, color: number) {
        let model = PCBModel.fromJSON(json["pcb"]);
        let offset = new Vector(json["pos"]["x"], json["pos"]["y"], json["pos"]["z"]);
        var generator = new PCBGenerator(model, color, offset);
        var container = new PCBContainer(generator);
        container.pcb = model;
        container.offset = offset;

        return container;
    }
}

export default class PCBModelCluster implements GeneratableComponentInterface {

    private static MIN_NUMBER = -100000;        //min value for finding the biggest height/width/length
    private static MAX_NUMBER = 100000;         //same than min but with MAX value
    private static MAX_PCB_WALL_DIST = 20;      //max space between pcb and wall to make connector holes

    private static MINIMAL_WALL = 100;          //=1cm The smallest acceptable wall length
    private static WALL_MARGIN = 100;           //=1cm The margin on the left and right of the walls

    private static SEC_WALL_THICKNESS = 20;     //=2mm

    private mainPCBIndex: number;
    private containers: PCBContainer[];

    private wallGen: InnerWallsGeneratorI;

    constructor(container: PCBContainer) {
        this.mainPCBIndex = 0;
        this.containers = [];

        this.containers.push(container);
    }

    public getNPCBs() {
        return this.containers.length;
    }

    public getContainers() {
        var containerList = [];
        for (let i = 0; i < this.containers.length; i++) {
            containerList.push(this.containers[i]);
        }
        return containerList;
    }

    public addContainer(newCont: PCBContainer): void {
        this.containers.push(newCont);
    }

    private getModelForSide(side: number) {
        let containersIndex = [];
        switch(side) {
            case PCBModel.SIDE_FRONT:
                let minY = 0;
                this.containers.forEach((c, i) => {
                    if (Math.abs(c.getOffset().y - minY) < PCBModelCluster.MAX_PCB_WALL_DIST)
                        containersIndex.push(i);
                });
                break;
            case PCBModel.SIDE_LEFT:
                let minX = 0;
                this.containers.forEach((c, i) => {
                    if (Math.abs(c.getOffset().x - minX) < PCBModelCluster.MAX_PCB_WALL_DIST)
                        containersIndex.push(i);
                });
                break;
            case PCBModel.SIDE_BACK:
                let maxY = this.getDimensionY();
                this.containers.forEach((c, i) => {
                    if (Math.abs(c.getOffset().y + c.pcb.getDimensionY() - maxY) < PCBModelCluster.MAX_PCB_WALL_DIST)
                        containersIndex.push(i);
                });
                break;
            case PCBModel.SIDE_RIGHT:
                let maxX = this.getDimensionX();
                this.containers.forEach((c, i) => {
                    if (Math.abs(c.getOffset().x + c.pcb.getDimensionX() - maxX) < PCBModelCluster.MAX_PCB_WALL_DIST)
                        containersIndex.push(i);
                });
                break;
        }

        return this.containers.filter((c, i) => containersIndex.indexOf(i) != -1);
    }

    //works for n PCBs
    public getScrewPositions() {
        let screws = [];
        this.containers.forEach((cont) => {
            screws = screws.concat(cont.getScrewPositions());
        });
        return screws;
    }

    //works for n PCBs
    //may have problematic cases
    public getConnectors() {
        let connectors = [];
        for (let i = 0; i < 4; i++) {
            let pcbContainers = this.getModelForSide(i);
            pcbContainers.forEach(pcb => {
                connectors = connectors.concat(pcb.getWallConnectors(i));
            });
        }
        this.containers.forEach(pcb => {
            connectors = connectors.concat(pcb.getWallConnectors(4));
        });
        return connectors;
    }

    public getAlterableInnerPCB(): AlterablePCBI {
        if (this.containers[1] != null) {
            if ((<AlterablePCBI>this.containers[1].pcb).isEditable) {
                return <AlterablePCBI>this.containers[1].pcb;
            }
            throw new Error("Impossible to return inner PCB because he is not an 'AlterablePCBI'.");
        }
        throw new Error("Impossible to return inner PCB, no additional PCB exists. Add a least one inner PCB with 'addPCBModel' befor calling this function.");
    }

    //works with n pcbs
    public getDimensionFullHeight() {
        //get highest point
        let highest = PCBModelCluster.MIN_NUMBER;
        let lowest = PCBModelCluster.MAX_NUMBER;
        this.containers.forEach((cont, i) => {
            let hight = cont.pcb.getDimensionFullHeight() + cont.getOffset().z;
            let low = cont.getOffset().z;
            if (hight > highest)
                highest = hight;
            if (low < lowest)
                lowest = low;
        });
        return highest;
    }

    //always take the withness of the biggest PCB
    //WARNIGN some function calls may need to be changed
    //works for n pcbs
    public getPCBThickness() {
        let thickest = PCBModelCluster.MIN_NUMBER;
        this.containers.forEach((cont) => {
            if (thickest < cont.pcb.getPCBThickness())
                thickest = cont.pcb.getPCBThickness();
        });
        return thickest;
    }

    //@deprecated
    public getNeightboorPCBOffset(sideId: number, caseModel: CaseModel) {
        return {x: 0, y: 0};
    }

    //@depreceated (this function schould be in the CaseModel class)
    public getCaseEdge(edgeId: number, caseModel: CaseModel) {
        return {x: 0, y: 0};
    }

    //@depreceated (this function schould be in the CaseModel class)
    public getCaseEdges(caseModel: CaseModel) {
        return [];
    }

    public removePCB(index: number) {
        this.containers.splice(index, 1);
    }

    private getNextYPosition() {
        let lastCont = this.containers[this.containers.length-1];
        if (lastCont == undefined)
            return 0;
        else
            return lastCont.getOffset().y + lastCont.pcb.getDimensionY() + PCBModelCluster.SEC_WALL_THICKNESS;
    }

    public addPCBAtEnd(newCont: PCBContainer) {
        newCont.updateOffset(0, this.getNextYPosition(), 0);
        this.containers.push(newCont);
    }

    //@depreceated (this function schould be in the CaseModel class)
    public getOutterCaseLength(caseModel: CaseModel) {
        return 0;  //TODO implement
    }

    //@depreceated (this function schould be in the CaseModel class)
    public getOutterCaseWidth(caseModel: CaseModel) {
        return 0; //TODO implement
    }

    //@depreceated (this function schould be in the CaseModel class)
    public getBottomOffset(caseModel: CaseModel) {

    }

    public getDimension(dim: string): number {
        let biggest = 0;
        this.containers.forEach(c => {
            if (dim == 'x') {
                if (c.getOffset().x + c.pcb.getDimensionX() > biggest)
                    biggest = c.getOffset().x +c.pcb.getDimensionX();
            } else if (dim == 'y') {
                if (c.getOffset().y + c.pcb.getDimensionY() > biggest)
                    biggest = c.getOffset().y +c.pcb.getDimensionY();
            } else if (dim == 'z') {
                if (c.getOffset().z + c.pcb.getDimensionFullHeight() > biggest)
                    biggest = c.getOffset().z + c.pcb.getDimensionFullHeight();
            }
        })

        return biggest;
    }

    public getDimensionX() {
        return this.getDimension('x');
    }

    public getDimensionY() {
        return this.getDimension('y');
    }

    public getDimensionZUp() {
        let biggest = 0;
        this.containers.forEach((cont) => {
            if (biggest < cont.pcb.getDimensionZUp() + cont.getOffset().z) {
                biggest = cont.pcb.getDimensionZUp() + cont.getOffset().z;
            }
        });

        return biggest;
    }

    public getDimensionZDown() {
        let biggest = 0;
        this.containers.forEach((cont) => {
            if (biggest < cont.pcb.getDimensionZDown()) {
                biggest = cont.pcb.getDimensionZDown();
            }
        });

        return biggest;
    }

    public getMainPCB() {
        return this.containers[this.mainPCBIndex].pcb;
    }

    private getOppositSide(side: number): number {
        return 4-side;
    }

    public getScrewheadRadius() {
        let biggest = 0;
        this.containers.forEach((cont) => {
            if (biggest < cont.pcb.getScrewheadRadius()) {
                biggest = cont.pcb.getScrewheadRadius();
            }
        });
        return biggest;
    }

    public getSlimFitZup(level: number) {
        let biggest = 0;
        this.containers.forEach((cont) => {
            if (biggest < cont.pcb.getSlimFitZup(level)) {
                biggest = cont.pcb.getSlimFitZup(level);
            }
        });
        return biggest;
    }

    public getInnerWalls() {
        if (this.containers.length < 2)
            return undefined;       //not inner walls for single pcb

        return undefined;       //not implemented yet
    }

    private getThickness(space: number) {
        let thickness = PCBModelCluster.SEC_WALL_THICKNESS;
        if (thickness > space)
            thickness = space;
        return thickness;
    }

    private addWall(walls, thickness: number, length: number, posX: number, posY: number, ori: boolean) {
        if (length > PCBModelCluster.MINIMAL_WALL + 2*PCBModelCluster.WALL_MARGIN)
            length -= 2*PCBModelCluster.WALL_MARGIN;

        let newWall = {
            pos: new Vector(posX, posY, 0),
            dim: ori ? new Vector(length, thickness, 0) : new Vector(thickness, length, 0)
        };

        if (ori)
            newWall.pos.x += PCBModelCluster.WALL_MARGIN;
        else
            newWall.pos.y += PCBModelCluster.WALL_MARGIN;

        walls.push(newWall);
    }

    public toJson() {
        var json = {};

        json["containers"] = [];

        this.containers.forEach(cont => json["containers"].push(cont.toJson()));

        return json;
    }

    public static fromJson(json: any) : PCBModelCluster {
        var containers = [];
        const nColors = json["ui"]["colorsPCB"].length;
        for (let i = 0; i < json["containers"].length; i++) {
            containers.push(PCBContainer.fromJson(json["containers"][i], json["ui"]["colorsPCB"][i]));
        }
        for (let i = 0; i < json["shieldContainers"].length; i++) {
            containers.push(PCBContainer.fromJson(json["shieldContainers"][i], 0XFFFFFF));
        }
        if (containers[0] == undefined) {
            return null;
        }
        var cluster = new PCBModelCluster(containers[0]);
        for (let i = 1; i < containers.length; i++) {
            cluster.addContainer(containers[i]);
        }
        return cluster;
    }

    public getSecondaryInnerWalls() {
        this.wallGen = new InnerWallsGenerator(this.containers, new Vector(this.getDimensionX(), this.getDimensionY(), 0));
        return this.wallGen.getWallsOfPCBs();
/*
        if (this.containers.length < 2)
            return undefined;       //not inner walls for single pcb

        let walls = [];

        for (let i = 0; i < this.containers.length; i++) {
            let pcbAPos = this.containers[i].getOffset();
            let pcbADim = {x: this.containers[i].pcb.getDimensionX(), y: this.containers[i].pcb.getDimensionY()};
            for (let j = i; j < this.containers.length; j++ ) {
                let pcbBPos = this.containers[j].getOffset();
                let pcbBDim = {x: this.containers[j].pcb.getDimensionX(), y: this.containers[j].pcb.getDimensionY()};

                if (pcbAPos.x + pcbADim.x < pcbBPos.x) {
                    let space = pcbBPos.x - (pcbAPos.x + pcbADim.x);

                    let thickness = PCBModelCluster.SEC_WALL_THICKNESS;
                    if (thickness > space)
                        thickness = space;

                    if (space > PCBModelCluster.SEC_WALL_THICKNESS)       //add a second wall
                        this.addWall(walls, thickness, pcbBDim.y,
                            pcbBPos.x - PCBModelCluster.SEC_WALL_THICKNESS, pcbBPos.y, false);

                    this.addWall(walls, thickness, pcbADim.y, pcbAPos.x + pcbADim.x, pcbAPos.y, false);

                } else if (pcbAPos.y + pcbADim.y < pcbBPos.y) {
                    let space = pcbBPos.y - (pcbAPos.y + pcbADim.y);

                    let thickness = PCBModelCluster.SEC_WALL_THICKNESS;
                    if (thickness > space)
                        thickness = space;

                    //if (space > PCBModelCluster.SEC_WALL_THICKNESS)       //add a second wall
                    this.addWall(walls, thickness, pcbBDim.x, pcbBPos.x,
                        pcbBPos.y - PCBModelCluster.SEC_WALL_THICKNESS, true);

                    this.addWall(walls, thickness, pcbADim.x, pcbAPos.x, pcbAPos.y + pcbADim.y, true);
                }
            }
        }
        return walls;
        */
    }
}
