//librairie classes
import * as THREE from './../lib/three';

import Vector from '../utils/Vector';
import ComponentZone from './ComponentZone';
import CaseTreeNode from './CaseTreeNode';
import GeneratableComponentInterface from '../generator/GeneratableComponentInterface';
import AssemblyLinePreviewI from './AssemblyLinePreviewI';
import AssemblyLineModelI from './AssemblyLineModelI';

/*
 * The wall is a box that fills the entire parent zone
 */
export default class SecondaryWall implements CaseTreeNode {

    private parent: ComponentZone;
    private mesh: THREE.Mesh;
    private invertNormals: boolean = false;

    constructor(parentComponent: ComponentZone, pcbModel: GeneratableComponentInterface) {
        this.parent = parentComponent;
    }

    public getStartPosition(): Vector {
        return new Vector(0, 0, 0);
    }

    public getEndPositions(): Vector {
        return this.parent.getSize();
    }

    public getSize(): Vector {
        return this.parent.getSize();
    }

    public getMesh() {
        if (!this.mesh)
            return undefined;
        return this.mesh;
    }

    private getGeometry() {
        let geometry = new THREE.BoxGeometry(
            this.getSize().x, this.getSize().y, this.getSize().z);
        geometry.translate(
            this.getSize().x/2, this.getSize().y/2, this.getSize().z/2);

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

    public addToScene(scene: any) {
        throw new Error("Method not implemented.");
    }

    public assembleForPreview(assembly: AssemblyLinePreviewI) {
        assembly.addShape(this.getMesh());
    }

    public assemblyModel(assembly: AssemblyLineModelI) {
        assembly.addShape(this.getMesh());
    }

    public setInnerNode(node: CaseTreeNode) {
        throw new Error("Method not implemented.");
    }

    public updateWithParentMatrix(m: THREE.Matrix4) {
        let geometry = this.getGeometry();
        geometry.applyMatrix(m);
        this.mesh = new THREE.Mesh(geometry);
    }

    public toString(): string {
        throw new Error("Method not implemented.");
    }
}
