import * as THREE from './../lib/three';
import STLModelLoader from '../utils/STLModelLoader';

import Vector from '../utils/Vector';
import Box from './Box';
import StaticConnectorBuilder from '../data/StaticConnectorBuilder';


export default class ComponentModel {
    static conmponents: ComponentModel[] = [];

    static MALE_SHAPE_DEEPNES = 100; // = 1cm

    private topBoxes: Box[];
    private bottomBoxes: Box[];
    private sideBoxes: Box[];
    private sideBoxesMaleShape: Box[];

    private topBoxesHole: Box[];
    private bottomBoxesHole: Box[];
    private sideBoxesHole: Box[];

    private name: string;
    private file3DModel: string;
    private connector3DModel: THREE.Mesh;
    private maxWallThickness: number = 10;
    dimX;
    dimZ;

    constructor(name: string, file3DModel?: string) {
        this.file3DModel = file3DModel ? file3DModel : undefined;
        this.name = name;
    }

    public setBoxes(topBoxes: Box[], bottomBoxes: Box[], sideBoxes: Box[], maleShapeBoxes: Box[]) {
        this.topBoxes = topBoxes;
        this.bottomBoxes = bottomBoxes;
        this.sideBoxes = sideBoxes;
        this.sideBoxesMaleShape = maleShapeBoxes;

        if (this.sideBoxes[0]) {
            let size = new THREE.Vector3(0, 0, 0);
            let shape = this.sideBoxes[0].getShapeClone();
            shape.computeBoundingBox();
            size = shape.boundingBox.getSize(size);
            this.dimX = size.x;
            this.dimZ = size.z;
        } else {
            this.dimX = 0;
            this.dimZ = 0;
        }
    }

    public setHoleBoxes(topBoxesHole: Box[], bottomBoxesHole: Box[], sideBoxesHole: Box[]) {
        this.topBoxesHole = topBoxesHole;
        this.bottomBoxesHole = bottomBoxesHole;
        this.sideBoxesHole = sideBoxesHole;
    }

    public getName() {
        return this.name;
    }

    public getSideBoxes() {
        return this.sideBoxes;
    }

    public getTopBoxes() {
        return this.topBoxes;
    }

    public getBottomBoxes() {
        return this.bottomBoxes;
    }

    public getSideBoxesHole() {
        return this.sideBoxesHole;
    }

    public getTopBoxesHole() {
        return this.topBoxesHole;
    }

    public getBottomBoxesHole() {
        return this.bottomBoxesHole;
    }

    public getMaleShapeBoxes() {
        return this.sideBoxesMaleShape;
    }

    public loadModel() {
        if (this.file3DModel == undefined) {
            this.connector3DModel = null;
            return;
        }
        return STLModelLoader.loadModelPromise(this.file3DModel).then((mesh: any) => {
            this.connector3DModel = mesh;
        }).catch((err) => {
            console.warn("Model not loaded : " + err);
        });
    }

    public static loadComponents() {
        if (ComponentModel.conmponents.length == 0) {
            let builder = new StaticConnectorBuilder();
            ComponentModel.conmponents = builder.getComponents();
        }
        return Promise.all(ComponentModel.conmponents.filter(comp => comp != undefined).map(comp => comp.loadModel()));
    }

    public static getComponentByType(name: string) {
        for (let i = 0; i < ComponentModel.conmponents.length; i++) {
            if (ComponentModel.conmponents[i].name === name)
                return ComponentModel.conmponents[i];
        }
    }
}
