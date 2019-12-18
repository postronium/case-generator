//algo
const buckets = require('../../lib/buckets.min.js');

import { PCBContainer }  from '../PCBModelCluster';
import PCBModel from '../PCBModel';
import InnerWallsGeneratorI from './InnerWallsGeneratorI';
import Vector from '../../utils/Vector';

//correspond to add or remove of a PCB
class Event {

    location: Vector;
    isAdd: boolean;
    cont: PCBContainer;

    constructor(cont: PCBContainer, isAdd: boolean) {
        this.cont = cont;
        this.isAdd = isAdd;
        let origin = cont.getOffset();
        if (isAdd) {
            this.location = new Vector(origin.x, origin.y, origin.z);
        } else {
            this.location = new Vector(
                origin.x + this.cont.pcb.getDimensionX(),
                origin.y + this.cont.pcb.getDimensionY(),
                origin.z + this.cont.pcb.getDimensionZUp()
            );
        }
    }

    public static xComp(a: Event, b: Event) {
        if (a.location.x < b.location.x) return -1;
        if (a.location.x > b.location.x) return 1;
        if (a.location.y < b.location.y) return -1;
        if (a.location.y > b.location.y) return 1;
        return 0;
    }

    public static yComp(a: Event, b: Event) {
        if (a.location.y < b.location.y) return -1;
        if (a.location.y > b.location.y) return 1;
        return 0;
    }

    public static zComp(a: Event, b: Event) {
        if (a.location.z < b.location.z) return -1;
        if (a.location.z > b.location.z) return 1;
        return 0;
    }
}

export default class InnerWallsGenerator implements InnerWallsGeneratorI {

    addPCB(pcb: PCBContainer) {
        throw new Error("Method not implemented.");
    }
    removePCB(pcb: PCBContainer) {
        throw new Error("Method not implemented.");
    }
    private static MIN_WALL_LENGTH = 50;        //=5mm
    private static WALL_THICKNESS = 20;         //=2mm;
    private static MIN_WALL_THICKNESS = 10;     //=1mm
    private static START_END_MARGIN = 40;       //=4mm

    private eventsX;
    private eventsY;

    private size: Vector;

    public constructor(pcbs: PCBContainer[], size: Vector) {
        this.eventsX = new buckets.BSTree(Event.xComp);
        this.eventsY = new buckets.BSTree(Event.yComp);
        this.size = size;

        const bottomPcbs = pcbs.filter(cont => cont.getOffset().z == 0);

        bottomPcbs.forEach(p => this.eventsX.add(new Event(p, true)));
        bottomPcbs.forEach(p => this.eventsX.add(new Event(p, false)));
        bottomPcbs.forEach(p => this.eventsY.add(new Event(p, true)));
        bottomPcbs.forEach(p => this.eventsY.add(new Event(p, false)));
    }

    public getWallsOfPCBs() {
        let walls = new Array<{pos: Vector, dim: Vector}>();        //horizontal wall
        let linePCBsX = new buckets.BSTree((a: PCBContainer, b: PCBContainer) => {
            if (a.getOffset().y < b.getOffset().y) return -1;
            if (a.getOffset().y > b.getOffset().y) return 1;
            return 0;
        });
        let linePCBsY = new buckets.BSTree((a: PCBContainer, b: PCBContainer) => {
            if (a.getOffset().x < b.getOffset().x) return -1;
            if (a.getOffset().x > b.getOffset().x) return 1;
            return 0;
        });

        this.eventTraversal('x', this.eventsX, linePCBsX, walls);
        this.eventTraversal('y', this.eventsY, linePCBsY, walls);

        return walls;
    }

    //axis can be 'x' or 'y'
    private eventTraversal(axis: string, events: any, linePCBs: any, walls: Array<{pos: Vector, dim: Vector}>) {
        let last = 0;
        events.inorderTraversal((e) => {
            if (e.isAdd) {
                linePCBs.add(e.cont);
            }
            this.buildWalls(axis, last + InnerWallsGenerator.START_END_MARGIN, (axis == 'x' ? e.location.x : e.location.y) - InnerWallsGenerator.START_END_MARGIN, linePCBs, walls);
            if (!e.isAdd) {
                linePCBs.remove(e.cont);
            }
            last = axis == 'x' ? e.location.x : e.location.y;
        });
    }

    private getYWall(x: number, y: number, length: number) {
        return {
            pos: new Vector(x, y, 0),
            dim: new Vector(InnerWallsGenerator.WALL_THICKNESS, length, 0)
        };
    }

    private getXWall(x: number, y: number, length: number) {
        return {
            pos: new Vector(x, y, 0),
            dim: new Vector(length, InnerWallsGenerator.WALL_THICKNESS, 0)
        };
    }

    //axis can be 'x' or 'y'
    private buildWalls(axis: string, from: number, to: number, pcbs: any, walls: Array<{pos: Vector, dim: Vector}>) {
        if (to - from < InnerWallsGenerator.MIN_WALL_LENGTH)
            return;

        let previousEnd = 0;
        let nextStart = 0;
        let start = 0;
        let pcbStart = 0;
        let pcbEnd = 0;
        let pcbArr = pcbs.toArray();
        for (let i = 0; i < pcbArr.length; i++) {

            if (axis == 'x') {
                if ((to <= pcbArr[i].getOffset().x) || (from >= pcbArr[i].getOffset().x + pcbArr[i].pcb.getDimensionX()))
                    continue;

                pcbStart = pcbArr[i].getOffset().y;
                pcbEnd = pcbArr[i].getOffset().y + pcbArr[i].pcb.getDimensionY();
                if (i == pcbArr.length-1) nextStart = this.size.y;
                else                      nextStart = pcbArr[i+1].getOffset().y;
            } else {
                if ((to <= pcbArr[i].getOffset().y) || (from >= pcbArr[i].getOffset().y + pcbArr[i].pcb.getDimensionY()))
                    continue;

                pcbStart = pcbArr[i].getOffset().x;
                pcbEnd = pcbArr[i].getOffset().x + pcbArr[i].pcb.getDimensionX();
                if (i == pcbArr.length-1) nextStart = this.size.x;
                else                      nextStart = pcbArr[i+1].getOffset().x;
            }

            //wall befor pcb
            let gapSize = pcbStart - previousEnd;
            if (gapSize >= InnerWallsGenerator.MIN_WALL_THICKNESS) {
                if (gapSize > InnerWallsGenerator.WALL_THICKNESS) gapSize = InnerWallsGenerator.WALL_THICKNESS;

                if (axis == 'x')    walls.push(this.getXWall(from, pcbStart - gapSize, to - from));
                else                walls.push(this.getYWall(pcbStart - gapSize, from, to - from));
            }

            //wall after pcb
            gapSize = nextStart - pcbEnd;
            if (gapSize >= InnerWallsGenerator.MIN_WALL_THICKNESS) {
                if (gapSize > InnerWallsGenerator.WALL_THICKNESS) gapSize = InnerWallsGenerator.WALL_THICKNESS;

                if (axis == 'x')    walls.push(this.getXWall(from, pcbEnd, to - from));
                else                walls.push(this.getYWall(pcbEnd, from, to - from));
            }
            previousEnd = pcbEnd;
        }
    }
}
