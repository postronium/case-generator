//librairie classes
import * as THREE from './../lib/three';
import AssemblyLinePreviewI from './AssemblyLinePreviewI';
import Shape from '../utils/Shape';

export default class AssemblyLinePreview implements AssemblyLinePreviewI {

    private subShapes: THREE.Mesh[];
    private addShapes: THREE.Mesh[];

    constructor () {
        this.addShapes = [];
        this.subShapes = [];
    }

    public getFullMeshs() {
        return this.addShapes;
    }



    public assemblyWithLastPositiveShape() {
        if (this.addShape.length == 0) {
            return;
        }
        if (this.subShapes.length == 0) {
            return;
        }

        let subs = "";
        this.subShapes.forEach((s) => subs += " - " + s.name);

        let shape = new Shape();
        shape.addMesh(this.addShapes[this.addShapes.length-1]);
        this.subShapes.forEach((s) => shape.subMesh(s));
        this.addShapes[this.addShapes.length-1] = shape.assembleFullShape(() => {
            console.log("Error while assemling preview shape !");
        });
        this.subShapes = [];
    }

    public addShape(mesh: THREE.Mesh) {
        if (mesh)
            this.addShapes.push(mesh)
    }

    public subShape(mesh: THREE.Mesh) {
        if (mesh)
            this.subShapes.push(mesh);
    }
}
