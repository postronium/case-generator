//librairie classes
import * as THREE from './../lib/three';
import AssemblyLineModelI from './AssemblyLineModelI';
import Shape from '../utils/Shape';

export default class AssemblyLineModel implements AssemblyLineModelI {

    private subShapes: THREE.Mesh[];
    private addShapes: THREE.Mesh[];

    constructor () {
        this.addShapes = [];
        this.subShapes = [];
    }

    private subToLastPositiveShape() {
        if (this.addShape.length == 0) {
            console.log("No add shapes");
            return;
        }
        if (this.subShapes.length == 0) {
            console.log("No sub shapes");
        }

        let shape = new Shape();
        shape.addMesh(this.addShapes[this.addShapes.length-1]);
        this.subShapes.forEach((s) => shape.subMesh(s));
        this.addShapes[this.addShapes.length-1] = shape.assembleFullShape(() => {
            console.log("Error while assemling preview shape !");
        });
        this.subShapes = [];
    }

    private mergeAllPositiveShapes() {
        if (this.subShapes.length != 0)
            this.subToLastPositiveShape();

        if (this.addShape.length == 0) {
            console.log("No add shapes");
            return;
        }

        let shape = new Shape();
        shape.addMesh(this.addShapes[this.addShapes.length-1]);
        this.addShapes.forEach((s) => shape.addMesh(s));
        return shape.assembleFullShape(() => {
            console.log("Error while assemling preview shape !");
        });
    }

    public getFinalModel() {
        let final = this.mergeAllPositiveShapes();

        return final;
    }

    public addShape(mesh: THREE.Mesh) {
        if (this.subShapes.length != 0)
            this.subToLastPositiveShape();
        if (mesh)
            this.addShapes.push(mesh);
    }

    public subShape(mesh: THREE.Mesh) {
        if (mesh)
            this.subShapes.push(mesh);
    }
}
