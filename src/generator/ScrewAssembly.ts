//librairie classes
import * as THREE from './../lib/three';

import Vector from '../utils/Vector';
import ComponentZone from './ComponentZone';
import CaseTreeNode from './CaseTreeNode';
import AssemblyLinePreviewI from './AssemblyLinePreviewI';
import AssemblyLineModelI from './AssemblyLineModelI';
import Shape from '../utils/Shape';

export default class ScrewAssembly implements CaseTreeNode {

    public static SCREW_RADIUS = 13;               //=1.3mm
    public static SCREW_HEAD_RADIUS = 30;          //=3mm
    public static TOP_SCREW_ASSEMBLY_HEIGHT = 20;  //=2mm

    private finalHoleMesh: THREE.Mesh;
    private finalSupportMesh: THREE.Mesh;
    private support: THREE.Mesh;
    private hole: THREE.Mesh;
    private fullShape: THREE.Mesh;
    private finalFullShape: THREE.Mesh;

    private invertNormals: boolean;
    private height;
    private bottomOffset: number;

    constructor(parentComponent: ComponentZone, height: number, isTop: boolean) {
        this.invertNormals = parentComponent.invertNormals;
        if (isTop) {
            this.bottomOffset = height;
            this.height = ScrewAssembly.TOP_SCREW_ASSEMBLY_HEIGHT;
        } else {
            this.height = height;
            this.bottomOffset = 0;
        }

        this.buildMesh();
    }

    public getStartPosition(): Vector {
        return new Vector(0, 0, 0);
    }

    public getEndPositions(): Vector {
        return new Vector(0, 0, 0);
    }

    public getSize(): Vector {
        return new Vector(0, 0, 0);
    }

    public addToScene(scene: any) {
        if (this.finalSupportMesh)
            scene.add(this.finalSupportMesh);
        if (this.finalHoleMesh)
            scene.add(this.finalHoleMesh);
    }

    public assembleForPreview(assembly: AssemblyLinePreviewI) {
        /*
        if (this.finalSupportMesh)
            assembly.addShape(this.finalSupportMesh);
        if (this.finalHoleMesh)
            assembly.subShape(this.finalHoleMesh);
        assembly.assemblyWithLastPositiveShape();*/
        if (this.finalFullShape)
            assembly.addShape(this.finalFullShape);
    }

    public assemblyModel(assembly: AssemblyLineModelI) {
        /*
        if (this.finalSupportMesh)
            assembly.addShape(this.finalSupportMesh);
        if (this.finalHoleMesh)
            assembly.subShape(this.finalHoleMesh);*/
        if (this.finalFullShape)
            assembly.addShape(this.finalFullShape);
    }

    public updateWithParentMatrix(m: THREE.Matrix4) {
        this.finalFullShape = this.fullShape.clone();
        this.finalFullShape.applyMatrix(m);
        //this.finalSupportMesh = new THREE.Mesh(this.getSupport());
        //this.finalSupportMesh.applyMatrix(m);
        //this.finalHoleMesh = new THREE.Mesh(this.getScrewHole());
        //this.finalHoleMesh.applyMatrix(m);
    }

    public setInnerNode(node: CaseTreeNode) {
        throw new Error("Method not implemented.");
    }

    public toString(): string {
        return "ScrewAssembly";
    }

    private buildMesh() {
        let shape = new Shape();

        shape.addMesh(new THREE.Mesh(this.getSupport()));
        shape.addMesh(new THREE.Mesh(this.getLink()));
        shape.subMesh(new THREE.Mesh(this.getScrewHole()));

        this.fullShape = shape.assembleFullShape();

        let geo = <THREE.Geometry>this.fullShape.geometry;

        if (this.invertNormals) {
            for (var i = 0; i < geo.faces.length; i++) {
                var face = geo.faces[i];
                var temp = face.a;
                face.a = face.c;
                face.c = temp;
            }

            geo.computeFaceNormals();
            geo.computeVertexNormals();
        }
    }

    private getLink() {
        let s = ScrewAssembly.SCREW_HEAD_RADIUS;
        let geo = new THREE.BoxGeometry(s, s*2, this.height);
        /*
        if (this.invertNormals)
            geo.translate(-s/2, s, this.height/2 + this.bottomOffset);
        else
            geo.translate(-s/2, -s, this.height/2 + this.bottomOffset);*/
        geo.translate(s/2 -s, 0, this.height/2 + this.bottomOffset);
        //geo.rotateZ(-Math.PI/2);

        return geo;
    }

    private getSupport() {
        let r = ScrewAssembly.SCREW_HEAD_RADIUS;        //radius
        let geo = new THREE.CylinderGeometry(r, r, this.height, 16);

        geo.rotateX(Math.PI/2);
        geo.translate(-r, 0, this.height/2 + this.bottomOffset);
        /*
        if (this.invertNormals)
            geo.translate(r, r, this.height/2 + this.bottomOffset);
        else
            geo.translate(-r, r, this.height/2 + this.bottomOffset);*/

        return geo;
    }

    private getScrewHole() {
        let d = ScrewAssembly.SCREW_HEAD_RADIUS;
        let r = ScrewAssembly.SCREW_RADIUS;        //radius
        let geo = new THREE.CylinderGeometry(r, r, this.height, 16);

        geo.rotateX(Math.PI/2);
        geo.translate(-d, 0, this.height/2 + this.bottomOffset);
        /*
        if (this.invertNormals)
            geo.translate(d, d, this.height/2 + this.bottomOffset);
        else
            geo.translate(-d, d, this.height/2 + this.bottomOffset);*/
        return geo;
    }
}
