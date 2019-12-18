//librairies classes
import * as THREE from './../lib/three';

export default class ShapeGenerator {

    //create a Box Mesh and put the origin in the corner
    public static creatBox(dimX: number, dimY: number, dimZ: number) {
        let box = new THREE.BoxGeometry(dimX, dimY, dimZ);
        box.translate(dimX/2,  dimY/2, dimZ/2);
        return new THREE.Mesh(box);
    }

    public static creatCylinder(diam: number, height: number) {
        let r = diam/2;
        let cylinder = new THREE.CylinderGeometry(r, r, height, 32);
        cylinder.rotateZ(Math.PI/2);
        cylinder.translate(height/2, 0, 0);
        return new THREE.Mesh(cylinder);
    }

    public static createBoxCenter(dimX: number, dimY: number, dimZ: number) {
        let box = new THREE.BoxGeometry(dimX, dimY, dimZ);
        box.translate(0, 0, dimZ/2);
        return new THREE.Mesh(box);
    }

}
