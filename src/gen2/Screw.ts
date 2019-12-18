//librairie classes
import * as THREE from './../lib/three';

import Vector from '../mesh-simplificator/Vector';
import ComponentZone from './ComponentZone';
import CaseTreeNode from './CaseTreeNode';
import { CaseModel } from '../model/CaseModels';
import AssemblyLinePreviewI from './AssemblyLinePreviewI';
import AssemblyLineModelI from './AssemblyLineModelI';
import Shape from '../utils/Shape';

export default class Screw implements CaseTreeNode {

    private static SCREW_RADIUS: number = 13;

    private dimension: Vector;
    private mesh: THREE.Mesh;
    private invertNormals: boolean;
    private caseM: CaseModel;
    private screwHeadRadius: number;

    constructor(parentComponent: ComponentZone, caseM: CaseModel, screwHeadRadius: number) {
        this.dimension = parentComponent.getSize();
        this.invertNormals = parentComponent.invertNormals;
        this.screwHeadRadius = screwHeadRadius;
        this.caseM = caseM;
    }

    public getStartPosition(): Vector {
        return new Vector(0, 0, 0);
    }

    public getEndPositions(): Vector {
        return this.dimension;
    }

    public getSize(): Vector {
        return this.dimension;
    }

    public addToScene(scene: any) {
        if (this.mesh)
            scene.add(this.mesh);
    }

    public assembleForPreview(assembly: AssemblyLinePreviewI) {
        if (this.mesh)
            assembly.addShape(this.mesh);
    }

    public assemblyModel(assembly: AssemblyLineModelI) {
        if (this.mesh)
            assembly.addShape(this.mesh);
    }

    public updateWithParentMatrix(m: THREE.Matrix4) {
        let sh = new Shape();
        sh.addMesh(new THREE.Mesh(this.getSupport()));
        sh.subMesh(new THREE.Mesh(this.getScrewHole()));
        this.mesh = sh.assembleFullShape();
        this.mesh.applyMatrix(m);
    }

    public setInnerNode(node: CaseTreeNode) {
        throw new Error("Method not implemented.");
    }

    public toString(): string {
        return "Screw";
    }

    private getSupport() {
        let r = this.screwHeadRadius;        //radius
        let geo = new THREE.CylinderGeometry(r, r, this.dimension.z, this.caseM.getCylinderResolution());

        geo.rotateX(Math.PI/2);
        geo.translate(0, 0, this.dimension.z/2);    //translate to middle

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

        return geo;
    }

    private getScrewHole() {
        let r = Screw.SCREW_RADIUS;        //radius
        let geo = new THREE.CylinderGeometry(r, r, this.dimension.z, this.caseM.getCylinderResolution());

        geo.rotateX(Math.PI/2);
        geo.translate(0, 0, this.dimension.z/2);    //translate to middle

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

        return geo;
    }

    private getGeometry() {
        let geometry = new THREE.BoxGeometry(
            this.dimension.x, this.dimension.y, this.dimension.z);
        geometry.translate(
            this.dimension.x/2, this.dimension.y/2, this.dimension.z/2);

        if (this.invertNormals) {
            for (var i = 0; i < geometry.faces.length; i++) {
                var face = geometry.faces[i];
                var temp = face.a;
                face.a = face.c;
                face.c = temp;
            }

            geometry.computeFaceNormals();
            geometry.computeVertexNormals();
        }

        return geometry;
    }
}
