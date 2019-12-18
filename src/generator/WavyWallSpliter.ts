//librairie classes
import * as THREE from './../lib/three';

//algo
const buckets = require('../lib/buckets.min.js');

import Vector from '../utils/Vector';
import ComponentZone from './ComponentZone';0
import CaseTreeNode from './CaseTreeNode';
import GeneratableComponentInterface from '../generator/GeneratableComponentInterface';
import PCBConnectorI from '../model/PCBConnectorI';
import { CaseModel } from '../model/CaseModels';
import ConnectorsZone from './ConnectorsZone';
import * as CONNECTOR from '../model/ConnectorModels';
import AssemblyLinePreviewI from './AssemblyLinePreviewI';
import AssemblyLineModelI from './AssemblyLineModelI';
import SnapFit from './SnapFit';

export default class WavyWallSpliter implements CaseTreeNode {

    private static CORNER_SPLIT_HEIGHT = 40;        //=4mm
    private static EPSILON = 0.001;
    private static WAVE_LENGTH = 50;            //=5mm
    private static WAVE_DEEPNESS_BOTTOM = 22;   //=2.2mm      hole
    private static WAVE_DEEPNESS_TOP = 20;      //=2mm      outset
    private static MIN_WIDTH_FOR_WAVE = 70;     //=7mm
    private static WAVE_INDENT = 1;             //0.2mm

    private dimensions: Vector;
    private splitPlane: THREE.Geometry;
    private mesh: THREE.Mesh;
    private hTol: number;           //used to know if connector makes a hole in the wall
    private parent: ComponentZone;
    private needsFlip: boolean;
    private isTop: boolean;

    constructor(needsFlip: boolean, isTop: boolean, parent: ComponentZone, connectors: PCBConnectorI[], hTol: number) {
        this.dimensions = parent.getSize();
        this.hTol = hTol;
        this.parent = parent;
        this.needsFlip = needsFlip;
        this.isTop = isTop;

        let pts = this.getMiddlePoints(connectors, WavyWallSpliter.CORNER_SPLIT_HEIGHT, WavyWallSpliter.CORNER_SPLIT_HEIGHT);

        this.generatePlane(needsFlip, pts);
    }

    private addSplitPoint(points: any, x: number, z: number) {
        points.push(new THREE.Vector3(x, 0, z));
        points.push(new THREE.Vector3(x, this.dimensions.y, z));
    }


    private splitBorder(points: any, connHMin: number, connHMax: number, connX: number, cornerX: number) {
        if (Math.abs(connX - cornerX) > WavyWallSpliter.MIN_WIDTH_FOR_WAVE) {           //width enougth for a wave
            let height = WavyWallSpliter.CORNER_SPLIT_HEIGHT;
            if (connHMax < height)
                height = connHMax;
            else if (connHMin > height)
                height = connHMin;

            if (connX < cornerX){        //right corner
                this.addSplitPoint(points, connX, height);
                this.addWave(points, connX, cornerX, height);
                this.addSplitPoint(points, cornerX, WavyWallSpliter.CORNER_SPLIT_HEIGHT);
            } else {
                this.addSplitPoint(points, cornerX, WavyWallSpliter.CORNER_SPLIT_HEIGHT);
                this.addWave(points, cornerX, connX, height);
                this.addSplitPoint(points, connX, height);
            }
        } else {
            let height = WavyWallSpliter.CORNER_SPLIT_HEIGHT;
            if (connHMax < height)
                height = connHMax;
            else if (connHMin > height)
                height = connHMin;

            this.addSplitPoint(points, connX, height);
        }
    }

    private splitInterval(points: any, connA: PCBConnectorI, connB: PCBConnectorI) {
        let modelA = connA.getModel()
        let modelB = connB.getModel()
        let startX = connA.getPositionX() + modelA.dimX/2;
        let endX = connB.getPositionX() - modelB.dimX/2;

        let down = connA.getMinZ() < connB.getMinZ() ? connB.getMinZ() : connA.getMinZ();
        let up = connA.getMaxZ() < connB.getMaxZ() ? connA.getMaxZ() : connB.getMaxZ();

        let height = (up + down) / 2;       //height that is at the center of the connectos common Z range

        if (endX - startX > WavyWallSpliter.MIN_WIDTH_FOR_WAVE) {           //width enougth for a snap fit
            this.addSplitPoint(points, startX, height);
            this.addWave(points, startX, endX, height);
            this.addSplitPoint(points, endX, height);
        } else {
            this.addSplitPoint(points, startX, height);
            this.addSplitPoint(points, endX, height);
        }
    }

    private addWave(points: Array<THREE.Vector3>, startX: number, endX: number, height: number) {
        let bottomMargin = (endX - startX - WavyWallSpliter.WAVE_LENGTH)/2;
        let topMargin = bottomMargin + WavyWallSpliter.WAVE_INDENT;

        this.addSplitPoint(points, startX + topMargin, height);

        if (this.isTop) {
            this.addSplitPoint(points, startX + bottomMargin, height - WavyWallSpliter.WAVE_DEEPNESS_TOP);
            this.addSplitPoint(points, endX - bottomMargin, height - WavyWallSpliter.WAVE_DEEPNESS_TOP);
        } else {
            this.addSplitPoint(points, startX + bottomMargin, height - WavyWallSpliter.WAVE_DEEPNESS_BOTTOM);
            this.addSplitPoint(points, endX - bottomMargin, height - WavyWallSpliter.WAVE_DEEPNESS_BOTTOM);
        }

        this.addSplitPoint(points, endX - topMargin, height);
    }

    private getMiddlePoints(connectors: PCBConnectorI[], startHeight: number, endHeight: number) {
        let points = [];

        let conns = new buckets.BSTree((a, b) => {
            if (a.getPositionX() < b.getPositionX()) return -1;
            if (a.getPositionX() > b.getPositionX()) return 1;
            if (a.getPositionX() < b.getPositionX()) return -1;
            return 1;
        });
        connectors.filter(c => c.getSideBoxes() != 0).forEach((c) => conns.add(c));

        this.addSplitPoint(points, -this.dimensions.y, startHeight);
        this.addSplitPoint(points, 0, startHeight);

        conns = conns.toArray();

        if (conns.length == 0 || !conns[0]) {
            this.addSplitPoint(points, - this.dimensions.y, startHeight);
            this.addWave(points, 0, this.dimensions.x, startHeight);
            this.addSplitPoint(points, this.dimensions.x + this.dimensions.y, startHeight);
            return points;
        }
        let model = conns[0].getModel();
/*
        let lastHeight = startHeight;
        let model = conns[0].getModel();
        let zPos = conns[0].getPositionZ();
        if (zPos - model.dimZ/2 > startHeight) {
            lastHeight = zPos - model.dimZ/2;
        } else if (zPos + model.dimZ/2 < startHeight) {
            lastHeight = zPos + model.dimZ/2;
        }*/

        let middleOffset = model.dimX/2;

        this.splitBorder(points, conns[0].getBoxPosZ() - model.dimZ/2, conns[0].getBoxPosZ() + model.dimZ/2, conns[0].getPositionX() - middleOffset, 0);

        for (let i = 0; i < conns.length; i++) {
            model = conns[i].getModel();
            middleOffset = model.dimX/2;
            if (i != conns.length-1)
                this.splitInterval(points, conns[i], conns[i+1]);
            else
                this.splitBorder(points, conns[i].getBoxPosZ() - model.dimZ/2, conns[i].getBoxPosZ() + model.dimZ/2, conns[i].getPositionX() + middleOffset, this.dimensions.x);
        }

        this.addSplitPoint(points, this.dimensions.x, startHeight);
        this.addSplitPoint(points, this.dimensions.x + this.dimensions.y, startHeight);

        return points;
    }

    //CCW == counter clockwise
    private genCCWFaces(nPoints: number) {
        let faces = [];
        for (let i = 0; i < nPoints-2; i+=2) {
            faces.push(new THREE.Face3(i+2, i+1, i));
            faces.push(new THREE.Face3(i+1, i+2, i+3));
        }
        return faces;
    }

    //CW == clockwise
    private genCWFaces(nPoints: number) {
        let faces = [];
        for (let i = 0; i < nPoints-2; i+=2) {
            faces.push(new THREE.Face3(i, i+1, i+2));
            faces.push(new THREE.Face3(i+3, i+2, i+1));
        }
        return faces;
    }

    private generatePlane(needsFlip: boolean, points: THREE.Vector3[]) {
        this.splitPlane = new THREE.Geometry();
        points.forEach((p, i) => {
            this.splitPlane.vertices.push(p);
        });
        if (needsFlip == this.isTop)
            this.splitPlane.faces = this.genCWFaces(points.length);
        else
            this.splitPlane.faces = this.genCCWFaces(points.length);
    }

    public getStartPosition(): Vector {
        throw new Error("Method not implemented.");
    }

    public getEndPositions(): Vector {
        throw new Error("Method not implemented.");
    }

    public getSize(): Vector {
        throw new Error("Method not implemented.");
    }

    public addToScene(scene: any) {
        if (this.mesh)
            scene.add(this.mesh);
    }

    public assembleForPreview(assembly: AssemblyLinePreviewI) {
        //if (this.isTop)
        //    assembly.addShape(this.mesh);           //split
        //else {
            assembly.subShape(this.mesh);           //split
            assembly.assemblyWithLastPositiveShape();
        //}

    }

    public assemblyModel(assembly: AssemblyLineModelI) {
        assembly.subShape(this.mesh);
    }

    public updateWithParentMatrix(m: THREE.Matrix4) {
        this.mesh = new THREE.Mesh(this.splitPlane);
        this.mesh.applyMatrix(m);
        this.mesh.name = "wallspliter isTop : " + this.isTop;
    }

    public setInnerNode(node: CaseTreeNode) {
        throw new Error("Method not implemented.");
    }

    public toString(): string {
        throw new Error("Method not implemented.");
    }
}
