//librairie classes
import * as THREE from './../lib/three';

//algo
const buckets = require('../lib/buckets.min.js');

import Vector from '../mesh-simplificator/Vector';
import CaseTreeNode from './CaseTreeNode';
import PCBConnectorI from '../model/PCBConnectorI';
import ConnectorsZone from './ConnectorsZone';
import AssemblyLinePreviewI from './AssemblyLinePreviewI';
import AssemblyLineModelI from './AssemblyLineModelI';

export default class AdvanedWallSpliter implements CaseTreeNode {

    private static CORNER_SPLIT_HEIGHT = 50;        //=5mm
    private static INNER_OUTER_DIFF = 30;            //=3mm

    private dimensions: Vector;
    private splitPlane: THREE.Geometry;
    private mesh: THREE.Mesh;
    private hTol: number;           //used to know if connector makes a hole in the wall

    constructor(needsFlip: boolean, connZone: ConnectorsZone, connectors: PCBConnectorI[], hTol: number) {
        this.dimensions = connZone.getSize();
        this.hTol = hTol;
        let pts = this.getMiddlePoints(connectors, AdvanedWallSpliter.CORNER_SPLIT_HEIGHT);

        this.generatePlane(needsFlip, pts);
    }

    private getMiddlePoints(conns: PCBConnectorI[], startHeight: number) {
        let points = new buckets.BSTree((a, b) => {
            if (a.x < b.x) return -1;
            if (a.x > b.x) return 1;
            if (a.y < b.y) return -1;
            return 1;
        });

        let outerStartHeight = startHeight + AdvanedWallSpliter.INNER_OUTER_DIFF/2;
        let innerStartHeight = startHeight - AdvanedWallSpliter.INNER_OUTER_DIFF/2;

        let wThickness = this.dimensions.y - 2*this.hTol;
        let xStart = -this.dimensions.y + this.hTol;
        let xInnerStart = -this.hTol;
        let epsilon = 0.001

        points.add(new THREE.Vector3(xStart, 0, innerStartHeight));                      //outer start points
        points.add(new THREE.Vector3(xStart, this.dimensions.y/2, innerStartHeight));
        points.add(new THREE.Vector3(xStart, this.dimensions.y/2, innerStartHeight));
        points.add(new THREE.Vector3(xStart, this.dimensions.y, innerStartHeight));

        points.add(new THREE.Vector3(xStart + wThickness/(2+epsilon), 0, innerStartHeight));                                       //inner start points
        points.add(new THREE.Vector3(xStart + wThickness/(2+epsilon), this.dimensions.y/2, innerStartHeight));
        points.add(new THREE.Vector3(xStart + wThickness/(2+epsilon), this.dimensions.y/2, innerStartHeight));
        points.add(new THREE.Vector3(xStart + wThickness/(2+epsilon), this.dimensions.y, innerStartHeight));

        points.add(new THREE.Vector3(xStart + wThickness/2, 0, outerStartHeight));                                       //inner start points
        points.add(new THREE.Vector3(xStart + wThickness/2, this.dimensions.y/2, outerStartHeight));
        points.add(new THREE.Vector3(xStart + wThickness/2, this.dimensions.y/2, innerStartHeight));
        points.add(new THREE.Vector3(xStart + wThickness/2, this.dimensions.y, innerStartHeight));

        points.add(new THREE.Vector3(xInnerStart, 0, outerStartHeight));                                       //inner start points
        points.add(new THREE.Vector3(xInnerStart, this.dimensions.y/2, outerStartHeight));
        points.add(new THREE.Vector3(xInnerStart, this.dimensions.y/2, innerStartHeight));
        points.add(new THREE.Vector3(xInnerStart, this.dimensions.y, innerStartHeight));




        points.add(new THREE.Vector3(this.dimensions.x + this.hTol, 0, outerStartHeight));
        points.add(new THREE.Vector3(this.dimensions.x + this.hTol, this.dimensions.y/2, outerStartHeight));
        points.add(new THREE.Vector3(this.dimensions.x + this.hTol, this.dimensions.y/2, innerStartHeight));
        points.add(new THREE.Vector3(this.dimensions.x + this.hTol, this.dimensions.y, innerStartHeight));

        points.add(new THREE.Vector3(this.dimensions.x + this.hTol + wThickness/2, 0, outerStartHeight));
        points.add(new THREE.Vector3(this.dimensions.x + this.hTol + wThickness/2, this.dimensions.y/2, outerStartHeight));
        points.add(new THREE.Vector3(this.dimensions.x + this.hTol + wThickness/2, this.dimensions.y/2, innerStartHeight));
        points.add(new THREE.Vector3(this.dimensions.x + this.hTol + wThickness/2, this.dimensions.y, innerStartHeight));

        points.add(new THREE.Vector3(this.dimensions.x + this.hTol + wThickness/(2-epsilon), 0, innerStartHeight));
        points.add(new THREE.Vector3(this.dimensions.x + this.hTol + wThickness/(2-epsilon), this.dimensions.y/2, innerStartHeight));
        points.add(new THREE.Vector3(this.dimensions.x + this.hTol + wThickness/(2-epsilon), this.dimensions.y/2, innerStartHeight));
        points.add(new THREE.Vector3(this.dimensions.x + this.hTol + wThickness/(2-epsilon), this.dimensions.y, innerStartHeight));

        points.add(new THREE.Vector3(this.dimensions.x + this.hTol + wThickness, 0, innerStartHeight));
        points.add(new THREE.Vector3(this.dimensions.x + this.hTol + wThickness, this.dimensions.y/2, innerStartHeight));
        points.add(new THREE.Vector3(this.dimensions.x + this.hTol + wThickness, this.dimensions.y/2, innerStartHeight));
        points.add(new THREE.Vector3(this.dimensions.x + this.hTol + wThickness, this.dimensions.y, innerStartHeight));

        for (let i = 0; i < conns.length; i++) {
            let model = conns[i].getModel()

            if (conns[i].getOutset() <= this.hTol && !conns[i].isHoleOpen())
                continue;

            let zCenterOuter = conns[i].getPositionZ() + model.dimZ/2 + AdvanedWallSpliter.INNER_OUTER_DIFF/2;
            let zCenterInner = conns[i].getPositionZ() + model.dimZ/2 - AdvanedWallSpliter.INNER_OUTER_DIFF/2;

            //outer wall
            points.add(new THREE.Vector3(conns[i].getPositionX() - model.dimX /2, 0, zCenterOuter));
            points.add(new THREE.Vector3(conns[i].getPositionX() - model.dimX /2, this.dimensions.y/2, zCenterOuter));
            points.add(new THREE.Vector3(conns[i].getPositionX() + model.dimX /2, 0, zCenterOuter));
            points.add(new THREE.Vector3(conns[i].getPositionX() + model.dimX /2, this.dimensions.y/2, zCenterOuter));

            //inner wall
            points.add(new THREE.Vector3(conns[i].getPositionX() - model.dimX /2, this.dimensions.y/2, zCenterInner));
            points.add(new THREE.Vector3(conns[i].getPositionX() - model.dimX /2, this.dimensions.y, zCenterInner));
            points.add(new THREE.Vector3(conns[i].getPositionX() + model.dimX /2, this.dimensions.y/2, zCenterInner));
            points.add(new THREE.Vector3(conns[i].getPositionX() + model.dimX /2, this.dimensions.y, zCenterInner));
        }

        return points.toArray();
    }

    //CCW == counter clockwise
    private genCCWFaces(nPoints: number) {
        let faces = [];
        for (let i = 0; i < nPoints-4; i+=2) {
            faces.push(new THREE.Face3(i, i+4, i+1));
            faces.push(new THREE.Face3(i+1, i+4, i+5));
        }
        for (let i = 1; i < nPoints-4; i+=4) {
            faces.push(new THREE.Face3(i, i+4, i+1));
            faces.push(new THREE.Face3(i+1, i+4, i+5));
        }
        return faces;
    }

    //CW == clockwise
    private genCWFaces(nPoints: number) {
        let faces = [];
        for (let i = 0; i < nPoints-4; i+=2) {
            faces.push(new THREE.Face3(i+1, i+4, i));
            faces.push(new THREE.Face3(i+5, i+4, i+1));
        }
        for (let i = 1; i < nPoints-4; i+=4) {
            faces.push(new THREE.Face3(i+1, i+4, i));
            faces.push(new THREE.Face3(i+5, i+4, i+1));
        }
        return faces;
    }

    private generatePlane(needsFlip: boolean, points: THREE.Vector3[]) {
        this.splitPlane = new THREE.Geometry();
        points.forEach((p, i) => {
            this.splitPlane.vertices.push(p);
        });
        if (!needsFlip)
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
        assembly.subShape(this.mesh);
    }

    public assemblyModel(assembly: AssemblyLineModelI) {
        assembly.subShape(this.mesh);
    }

    public updateWithParentMatrix(m: THREE.Matrix4) {
        this.mesh = new THREE.Mesh(this.splitPlane);
        this.mesh.applyMatrix(m);
    }

    public setInnerNode(node: CaseTreeNode) {
        throw new Error("Method not implemented.");
    }

    public toString(): string {
        throw new Error("Method not implemented.");
    }
}
