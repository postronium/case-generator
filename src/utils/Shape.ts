import * as THREE from './../lib/three';
const ThreeBSP = require('./../lib/three-js-csg.js')(THREE);
import { ThinWallDetector } from './ThinWallDetector';

//TODO implement support for nativ THREE BSP Geometry
//https://stackoverflow.com/questions/35355615/three-js-merge-multiple-geometries-meshes-removing-common-areas

export default class Shape {
    static SMALLES_WALL_THICKNESS = 5; // = 0.5mm

    addShape: THREE.Mesh[];
    subShape: THREE.Mesh[];
    addBSPShape: any[];
    subBSPShape: any[];
    color: number;
    defaultColor: number = 0x40C040;
    erroColor: number = 0xC04040;

    //the data is in a tree structure to make final mesh more efficnet after the boolean operations
    //    the mesh will habe less useless points, faces, edges
    childShapes: Shape[];

    //for debugging
    name: string;

    tooThinWalls: boolean;

    constructor(addShape?: THREE.Mesh[], subShape?: THREE.Mesh[], color?: number) {
        this.addShape = addShape == undefined ? new Array<THREE.Mesh>() : addShape;
        this.subShape = subShape == undefined ? new Array<THREE.Mesh>() : subShape;
        this.addBSPShape = new Array<any>();
        this.subBSPShape = new Array<any>();
        this.color = (color === undefined) ? this.defaultColor : color;
        this.childShapes = new Array<Shape>();
    }

    public setName(name: string) {
        this.name = name;
    }

    public addChildShapes(children: Shape[]) {
        this.childShapes = this.childShapes.concat(children);
    }

    public addChildShape(child: Shape) {
        this.childShapes.push(child);
    }

    public clone() {
        let shape = new Shape(this.addShape.slice(), this.subShape.slice());
        shape.addChildShapes(this.childShapes);
        return shape;
    }

    //deprecated: use addChildShape or addChildShapes
    public getMerged(shape: Shape) {
        let union = new Shape();

        this.addShape.forEach(union.addMesh);
        this.subShape.forEach(union.subMesh);
        this.addBSPShape.forEach(union.addBSPMesh);
        this.subBSPShape.forEach(union.subBSPMesh);

        shape.addShape.forEach(union.addMesh);
        shape.subShape.forEach(union.subMesh);
        shape.addBSPShape.forEach(union.addBSPMesh);
        shape.subBSPShape.forEach(union.subBSPMesh);
        return union;
    }

    //deprecated: use addChildShape or addChildShapes
    public mergeWith(shape: Shape) {
        shape.addShape.forEach(this.addMesh, this);
        shape.subShape.forEach(this.subMesh, this);
        shape.addBSPShape.forEach(this.addBSPMesh, this);
        shape.subBSPShape.forEach(this.subBSPMesh, this);
    }

    public addMesh(mesh: THREE.Mesh) {
        this.addShape.push(mesh);
    }

    public addBSPMesh(mesh: any) {
        this.addBSPShape.push(mesh);
    }

    public subMesh(mesh: THREE.Mesh) {
        //switch comment to show negative shapes
        this.subShape.push(mesh);
        //this.addShape.push(mesh);
    }

    public subBSPMesh(mesh: any) {
        this.subBSPShape.push(mesh);
    }

    public assembleShapeTree() {
        let mainShape: any;
        if (this.childShapes.length != 0) {
            mainShape = this.childShapes[0].assembleShapeTree();
            //union all children
            for (let i = 1; i < this.childShapes.length; i++) {
                let child = this.childShapes[i].assembleShapeTree();
                if (!child) continue;
                mainShape = mainShape.union(child);
            }
            let localShape = this.assembleLocalShape();
            if (!localShape) return mainShape;
            return mainShape.union(localShape);
        } else {
            return this.assembleLocalShape();
        }
    }

    public assembleFullShape(onError?: Function) {
        let shape = this.assembleShapeTree();
        let color = this.tooThinWalls ? this.erroColor : this.color;
        if (this.tooThinWalls) onError();
        return shape.toMesh(
            new THREE.MeshLambertMaterial({color: color, overdraw: 0.5})
        );
    }

    public assembleLocalShape() {
        if (this.addShape.length < 1)
            return null;

        this.detectTooThinWalls();

        // union positive parts
        let originShape = new ThreeBSP(this.addShape[0]);
        for (let i = 1; i < this.addShape.length; i++) {                    //merge regular meshes
            originShape = originShape.union(new ThreeBSP(this.addShape[i]));
        }
        for (let i = 0; i < this.addBSPShape.length; i++) {                 //merge native BSP meshes
            originShape = originShape.union(this.addBSPShape[i]);
        }

        //subtrac negative parts (holes)
        for (let i = 0; i < this.subShape.length; i++) {                    //subtract regular meshes
            originShape = originShape.subtract(new ThreeBSP(this.subShape[i]));
        }
        for (let i = 0; i < this.subBSPShape.length; i++) {                 //subtract native BSP meshes
            originShape = originShape.subtract(this.subBSPShape[i]);
        }

        return originShape;
    }

    public areIntersect(a: THREE.Mesh, b: THREE.Mesh) {
        return new THREE.Box3().setFromObject(a).intersectsBox(new THREE.Box3().setFromObject(b));
    }

    //detecte too thin wall of future combined shape from the 'local' level (= childs and parent excluded)
    public detectTooThinWalls() {
        this.tooThinWalls = false;

        let thinWallDetector = new ThinWallDetector();
        //foreach addShape check with witch subShape it interacts
        //for each add/sub shape intersection test if a wall will be to small
        this.addShape.forEach((add) => {
            if (add.name == "ignore-thin-wall")
                return;                                             //TODO make that cleaner
            this.subShape.forEach((sub) => {
                if (sub.name == "ignore-thin-wall")
                    return;                                         //TODO make that cleaner
                if (this.areIntersect(add, sub)) {
                    let boxAdd = new THREE.Box3().setFromObject(add);
                    let boxSub = new THREE.Box3().setFromObject(sub);
                    //console.log(add.name + " AND " + sub.name + " are intersecting in : " + this.name);
                    let result = thinWallDetector.getSmallestWall(boxAdd, boxSub);
                    //console.log("    and the smallest wall is : " + Math.floor(result));
                    if (result < Shape.SMALLES_WALL_THICKNESS && result > 0.0000000001) {
                        console.warn("Too thin wall between " + add.name + " and " + sub.name + " the wall is " + (result/10) + "mm thick an schould not be smaller than 0.5mm.");
                        this.tooThinWalls = true;
                    }
                }
            }, this);
        }, this);
    }
}
