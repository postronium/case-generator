//librairie classes
import * as THREE from './../lib/three';
import AssemblyLinePreviewI from './AssemblyLinePreviewI';
import Shape from '../utils/Shape';

export default class AssemblyLineTexturedPreview implements AssemblyLinePreviewI {

    private subShapes: THREE.Mesh[];
    private addShapes: THREE.Mesh[];

    constructor () {
        this.addShapes = [];
        this.subShapes = [];
    }

    public getFullMeshs() {
        let final = this.mergeAllPositiveShapes();
        // load a texture, set wrap mode to repeat
        var texture = new THREE.TextureLoader().load("plastic.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 4, 4 );
        let material = new THREE.MeshLambertMaterial({map: texture});
        final.material = material;
        return [final];
    }

    public assemblyWithLastPositiveShape() {
        //do nothing
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
