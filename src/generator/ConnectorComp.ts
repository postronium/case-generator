//librairie classes
import * as THREE from './../lib/three';

import CaseTreeNode from './CaseTreeNode';
import Vector from '../utils/Vector';
import * as CONNECTOR from '../model/ConnectorModels';
import Box from '../model/Box';
import PCBConnector from '../model/PCBConnector';
import AssemblyLinePreviewI from './AssemblyLinePreviewI';
import AssemblyLineModelI from './AssemblyLineModelI';
import PCBConnectorI from '../model/PCBConnectorI';
import { Side } from './Side';

export default class ConnectorComp implements CaseTreeNode {

    private pcbConnector: PCBConnectorI;
    private meshTopplate: THREE.Mesh[] = [];
    private meshBottom: THREE.Mesh[] = [];
    private meshSide: THREE.Mesh[] = [];
    private needsInversion: boolean;

    public constructor(needsInversion: boolean, pcbConnector: PCBConnectorI) {
        this.needsInversion = needsInversion;
        this.pcbConnector = pcbConnector;
    }

    public getStartPosition() : Vector {
        throw new Error("Method not implemented.");
    }

    public getEndPositions(): Vector {
        throw new Error("Method not implemented.");
    }

    public getSize(): Vector {
        throw new Error("Method not implemented.");
    }

    public addToScene(scene: any) {
        this.meshSide.forEach(m => scene.add(m));
    }

    public assembleForPreview(assembly: AssemblyLinePreviewI) {
        this.meshSide.forEach(m => assembly.subShape(m));
        //if (this.mesh[0]) assembly.subShape(this.mesh[0]);
    }

    public assemblePartForPreview(assembly: AssemblyLinePreviewI, side: Side) {
        if (side == Side.SIDE)
            this.meshSide.forEach(m => assembly.subShape(m));
        else if (side == Side.BOTTOM)
            this.meshBottom.forEach(m => assembly.subShape(m));
        else if (side == Side.TOP)
            this.meshTopplate.forEach(m => assembly.subShape(m));
        //if (this.mesh[0]) assembly.subShape(this.mesh[0]);
    }

    public assemblyModel(assembly: AssemblyLineModelI) {
        this.meshSide.forEach(m => assembly.subShape(m));
    }

    public assemblyPartModel(assembly: AssemblyLineModelI, side: Side) {
        if (side == Side.SIDE)
            this.meshSide.forEach(m => assembly.subShape(m));
        else if (side == Side.BOTTOM)
            this.meshBottom.forEach(m => assembly.subShape(m));
        else if (side == Side.TOP)
            this.meshTopplate.forEach(m => assembly.subShape(m));
    }

    public updateWithParentMatrix(m: THREE.Matrix4) {
        let meshFromBox = function(box, j) {
            let geometry = box.getShapeClone();
            if (this.needsInversion) {
                for (var i = 0; i < geometry.faces.length; i++) {
                    var face = geometry.faces[i];
                    var temp = face.a;
                    face.a = face.c;
                    face.c = temp;
                }

                geometry.computeFaceNormals();
                geometry.computeVertexNormals();
            }
            let mesh = new THREE.Mesh(geometry);
            mesh.applyMatrix(m);
            mesh.name = this.pcbConnector.getName() + " n " + j;
            return mesh;
        }

        this.meshSide = this.pcbConnector.getSideBoxes().map(meshFromBox, this);
        this.meshTopplate = this.pcbConnector.getTopBoxes().map(meshFromBox, this);
        this.meshBottom = this.pcbConnector.getBottomBoxes().map(meshFromBox, this);
    }

    public setInnerNode(node: CaseTreeNode) {
        throw new Error("Method not implemented.");
    }

    public toString(): string {
        return "Connector";
    }
}
