//librairie classes
import * as THREE from './../lib/three';

import Vector from '../utils/Vector';
import CaseTreeNode from './CaseTreeNode';
import AssemblyLinePreviewI from './AssemblyLinePreviewI';
import AssemblyLineModelI from './AssemblyLineModelI';

//rotation not implemented yet
export default class ComponentZone implements CaseTreeNode {

    private static PRECISION : number = 0.001;

    //these variables describes where the start and end points of the shape are in the global space
    public origin: THREE.Matrix4;                                    //transformation from parent origin
    public originInWorld: THREE.Matrix4  = new THREE.Matrix4();      //transformation from world origin
    public dimension: Vector;                                        //point of the end relative from origin

    public invertNormals: boolean = false;

    public tag: string = "ComponentPlacement";

    public innerNode: CaseTreeNode;

    //all optinal variable are zero be default
    constructor(matrix: THREE.Matrix4, dimension: Vector, parent?: ComponentZone, tag?: string) {
        this.dimension = dimension;
        this.origin = matrix ? matrix : new THREE.Matrix4();

        if (parent) {
            this.updateWithParentMatrix(parent.originInWorld);
            this.invertNormals = parent.invertNormals;
        } else {
            this.updateWithParentMatrix();
        }

        this.tag = tag ? tag : this.tag;
    }

    public setTag(tag: string) {
        this.tag = tag;
    }

    //called when the parent matrix is aplied
    //in this case we need to update the originInWorld matrix
    //origin 0 if pOriginInWorld is null or unspeciied
    public updateWithParentMatrix(pOriginInWorld?: THREE.Matrix4) {
        //do we need to flip?
        let nFlips = 0;
        if (this.dimension.x < 0) nFlips++;
        if (this.dimension.y < 0) nFlips++;
        if (this.dimension.z < 0) nFlips++;
        if (nFlips > 0) {
            console.log(this.tag + " needs to be flipped");
            let flip = new THREE.Matrix4;
            flip.scale(new THREE.Vector3(
                this.dimension.x < 0 ? -1 : 1,
                this.dimension.y < 0 ? -1 : 1,
                this.dimension.z < 0 ? -1 : 1
            ));
            this.invertNormals = nFlips%2 == 1 ? !this.invertNormals : this.invertNormals;
            this.dimension = this.dimension.getPositive();

            this.origin.multiply(flip);
        }

        this.originInWorld.copy(this.origin);

        if (pOriginInWorld) {
            this.originInWorld.multiplyMatrices(pOriginInWorld, this.origin);
        }

        if (this.innerNode)
            this.innerNode.updateWithParentMatrix(this.originInWorld);
    }

    public setInnerNode(node: CaseTreeNode) {
        this.innerNode = node;
        if (this.innerNode)
            this.innerNode.updateWithParentMatrix(this.originInWorld);
    }

    public setInnerZoneWithMargin(startOffset: Vector, endOffset: Vector) {
        let dimension = this.dimension.sub(startOffset);
        dimension = dimension.sub(endOffset);
        let offsetMatrix = new THREE.Matrix4();
        offsetMatrix.makeTranslation(startOffset.x, startOffset.y, startOffset.z);
        this.innerNode = new ComponentZone(offsetMatrix, dimension, this, "InnerNode");
    }

    //Override
    public getSize() : Vector {
        return this.dimension;
    }

    //Override
    public getStartPosition(): Vector {
        return this.origin.multiplyVector3(new THREE.Vector3(0, 0, 0));
    }

    //Override
    public getEndPositions(): Vector {
        return this.origin.multiplyVector3(
            new THREE.Vector3(this.dimension.x, this.dimension.y, this.dimension.z));
    }

    public getWireFrame() {
        let box = new THREE.BoxGeometry(this.dimension.x, this.dimension.y, this.dimension.z);
        box.translate(this.dimension.x/2, this.dimension.y/2, this.dimension.z/2); //always move origin to the corner

        box.applyMatrix(this.originInWorld);       //move box from parent origin to this origin

        let material = new THREE.MeshBasicMaterial({
            color: 0xff0000, wireframe: true
        });

        let mesh = new THREE.Mesh(box, material);
        return mesh;
    }

    public getGeometry() {
        let box = new THREE.BoxGeometry(this.dimension.x, this.dimension.y, this.dimension.z);
        box.translate(this.dimension.x/2, this.dimension.y/2, this.dimension.z/2); //always move origin to the corner

        box.applyMatrix(this.originInWorld);       //move box from parent origin to this origin

        return box;
    }

    //simple function that add shapes to scene, used to debug
    public addToScene(scene: any) {
        scene.add(this.getWireFrame());
        if (this.innerNode)
            this.innerNode.addToScene(scene);
        //if (this.innerNode)
        //    this.innerNode.addToScene(scene);
    }

    //function to assemble the 3D shape to display it to the user in the 3D preview
    public assembleForPreview(assembly: AssemblyLinePreviewI) {
        if (this.innerNode)
            this.innerNode.assembleForPreview(assembly);
    }

    public assemblyModel(assembly: AssemblyLineModelI) {
        if (this.innerNode)
            this.innerNode.assemblyModel(assembly);
    }

    public toString(): string {
        return this.tag
    }
}
