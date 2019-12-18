import * as THREE from './../lib/three';
import Vector from '../utils/Vector';

/*
 * Imutable class
 */
export default class ConnectorBox {
    private shape: THREE.Geometry;
    private offset: Vector;

    constructor(shape: THREE.Geometry, pos: Vector) {
        let position = (new THREE.Matrix4()).makeTranslation(pos.x, pos.y, pos.z);
        this.shape = shape;
        this.shape.applyMatrix(position);
        this.offset = pos;
    }

    public getOffsetBox(offset: Vector) {
        return new ConnectorBox(this.shape, offset);
    }

    public getOffset() {
        return this.offset;
    }

    public getShapeClone() {
        return this.shape.clone();
    }

    //create a Box Mesh and put the origin in the corner
    public static creatBox(dimX: number, dimY: number, dimZ: number, position: Vector) {
        let box = new THREE.BoxGeometry(dimX, dimY, dimZ);
        return new ConnectorBox(box, position);
    }

    public static creatCylinder(diam: number, height: number, position: Vector) {
        let r = diam/2;
        let cylinder = new THREE.CylinderGeometry(r, r, height, 32);
        //cylinder.rotateZ(Math.PI/2);
        return new ConnectorBox(cylinder, position);
    }

    public static creatTopCylinder(diam: number, height: number, position: Vector) {
        let r = diam/2;
        let cylinder = new THREE.CylinderGeometry(r, r, height, 32);
        cylinder.rotateX(Math.PI/2);
        return new ConnectorBox(cylinder, position);
    }

    public static createBoxCenter(dimX: number, dimY: number, dimZ: number, position: Vector) {
        let box = new THREE.BoxGeometry(dimX, dimY, dimZ);
        return new ConnectorBox(box, position);
    }
}
