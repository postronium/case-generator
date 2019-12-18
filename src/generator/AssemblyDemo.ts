//librairie classes
import * as THREE from './../lib/three';
import AssemblyLinePreviewI from './AssemblyLinePreviewI';

/*
 *  This class is for debugging, it displays positive and negative shapes
 */
export default class AssemblyDemo implements AssemblyLinePreviewI {

    private addedShapes: THREE.Mesh[];

    constructor(scene: any) {
        this.addedShapes = [];
    }



    public assemblyWithLastPositiveShape() {
        //merge
        //this.addShape[this.addShape.length-1]
        //with content of this.subShapes
    }

    public getFullMeshs() {
        return this.addedShapes;
    }

    public addShape(mesh: THREE.Mesh) {
        this.addedShapes.push(mesh);
    }

    public subShape(mesh: THREE.Mesh) {
        this.addShape(mesh);
    }
}
