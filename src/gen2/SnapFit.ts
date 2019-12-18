//librairie classes
import * as THREE from './../lib/three';

import CaseTreeNode from './CaseTreeNode';
import Vector from '../mesh-simplificator/Vector';
import AssemblyLinePreviewI from './AssemblyLinePreviewI';
import AssemblyLineModelI from './AssemblyLineModelI';
import ComponentZone from './ComponentZone';

export default class SnapFit implements CaseTreeNode {

    private static SNAP_DEEPNESS = 10;  //=1mm

    private geom: THREE.Geometry;
    private mesh: THREE.Mesh;
    private flipMesh: boolean;
    private parent: ComponentZone;
    private isTop: boolean;

    constructor(parent: ComponentZone, flipMesh: boolean, isTop: boolean) {
        this.flipMesh = flipMesh;
        this.parent = parent;
        this.isTop = isTop;

        this.geom = this.getGeometry();
    }

    private getGeometry() {
        let geom = new THREE.Geometry();
        geom.vertices.push(new THREE.Vector3(0, this.getSize().y, 0));
        geom.vertices.push(new THREE.Vector3(0, 0, this.getSize().z/2));
        geom.vertices.push(new THREE.Vector3(0, this.getSize().y, this.getSize().z));
        geom.vertices.push(new THREE.Vector3(0, this.getSize().y, this.getSize().z/2));   //TODO set lower
        geom.vertices.push(new THREE.Vector3(0, this.getSize().y + SnapFit.SNAP_DEEPNESS, this.getSize().z/4));

        geom.vertices.push(new THREE.Vector3(this.getSize().x, this.getSize().y, 0));
        geom.vertices.push(new THREE.Vector3(this.getSize().x, 0, this.getSize().z/2));
        geom.vertices.push(new THREE.Vector3(this.getSize().x, this.getSize().y, this.getSize().z));
        geom.vertices.push(new THREE.Vector3(this.getSize().x, this.getSize().y, this.getSize().z/2));   //TODO set lower
        geom.vertices.push(new THREE.Vector3(this.getSize().x, this.getSize().y + SnapFit.SNAP_DEEPNESS, this.getSize().z/4));

        geom.faces.push(new THREE.Face3(0, 3, 4));
        geom.faces.push(new THREE.Face3(0, 1, 3));
        geom.faces.push(new THREE.Face3(1, 2, 3));

        geom.faces.push(new THREE.Face3(5, 9, 8));
        geom.faces.push(new THREE.Face3(5, 8, 6));
        geom.faces.push(new THREE.Face3(6, 8, 7));

        for (let i = 0; i < 4; i++) {
            geom.faces.push(new THREE.Face3(i, i+5, i+1));
            geom.faces.push(new THREE.Face3(i+1, i+5, i+6));
        }

        geom.faces.push(new THREE.Face3(4, 9, 5));
        geom.faces.push(new THREE.Face3(4, 5, 0));

        if (this.flipMesh)
            for (let i = 0; i < geom.faces.length; i++)
                geom.faces[i] = new THREE.Face3(geom.faces[i].c, geom.faces[i].b, geom.faces[i].a);


        geom.verticesNeedUpdate = true;
        geom.normalsNeedUpdate = true;

        return geom;
    }

    public getStartPosition(): Vector {
        return this.parent.getStartPosition();
    }

    public getEndPositions(): Vector {
        return this.parent.getEndPositions();
    }

    public getSize(): Vector {
        return this.parent.getSize();
    }

    public addToScene(scene: any) {
        //if(this.mesh)
            //scene.add(this.mesh);
    }

    public assembleForPreview(assembly: AssemblyLinePreviewI) {
        if (this.mesh) {
            if (this.isTop)
                assembly.addShape(this.mesh);
            else
                assembly.subShape(this.mesh);
        }
    }

    public assemblyModel(assembly: AssemblyLineModelI) {
        if (this.mesh) {
            if (this.isTop)
                assembly.addShape(this.mesh);
            else
                assembly.subShape(this.mesh);
        }
    }

    public updateWithParentMatrix(m: THREE.Matrix4) {
        this.mesh = new THREE.Mesh(this.geom);
        this.mesh.applyMatrix(m);
    }

    public setInnerNode(node: CaseTreeNode) {
        throw new Error("Method not implemented.");
    }

    public toString(): string {
        return "snap fit";
    }
}
