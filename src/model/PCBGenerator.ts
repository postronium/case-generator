//librairies classes
import * as THREE from './../lib/three';

import PCBConnectorI from './PCBConnectorI';
import PCBGeneratorI from './PCBGeneratorI';

//util classes
import Shape from '../utils/Shape';
import ShapeGenerator from '../utils/ShapeGenerator';
import PCBModel from './PCBModel';
import STLModelLoader from '../utils/STLModelLoader';

/**
 * The instances of that class are immutable.
 * The methods setColor, setOffset and setPCBModel will return a new instance of PCBGenerator.
 */
export default class PCBGenerator implements PCBGeneratorI {

    public static DEFAULT_SCREW_HOLE_DIAMETER: number = 30;
    public static DEFAULT_PCB_COLOR: number = 0x4040FF;

    private static realisticModels: THREE.Mesh[];
    private static MODELS = [
        "PCB_RPI3",
        "PCB_RPI4",
        "PCB_RPI01.3"
    ];

    private pcbModel: PCBModel;
    private mesh: THREE.Mesh;
    private frame: THREE.LineSegments;
    private conn3DModels: THREE.Mesh[];
    private realisticModel: THREE.Mesh;
    private pcbColor: number = PCBGenerator.DEFAULT_PCB_COLOR;

    private offset: {x: number, y: number, z: number};

    constructor(model: PCBModel, color: number, offset: {x: number, y: number, z: number}) {
        this.pcbModel = model;
        this.getSTLOfModel(model);
        this.pcbColor = color;
        this.offset = offset;
        if (this.realisticModel) {
            this.realisticModel.translateX(offset.x);
            this.realisticModel.translateY(offset.y);
            this.realisticModel.translateZ(offset.z);
        }
        this.rebuild();
    }

    public setColor(color: number) {
        return new PCBGenerator(this.pcbModel, color, this.offset);
    }

    public setOffset(offset: {x: number, y: number, z: number}) {
        return new PCBGenerator(this.pcbModel, this.pcbColor, offset);
    }

    public setPCBModel(pcbModel: PCBModel) {
        return new PCBGenerator(pcbModel, this.pcbColor, this.offset);
    }

    private getSTLOfModel(model) {
        const modelIndex = PCBGenerator.MODELS.indexOf(model.getRealisticModel());
        if (modelIndex != -1)
            this.realisticModel = PCBGenerator.realisticModels[modelIndex].clone();
    }

    public getColor() {
        return this.pcbColor;
    }

    public rebuild(part?: string) {
        this.mesh = undefined;
        this.conn3DModels = undefined;
        if (!this.conn3DModels)
            this.generateConnectors();
    }

    public addToScene(scene: THREE.Scene) {
        if (this.realisticModel != undefined) {
            this.generatePCBBase();
            scene.add(this.realisticModel);
            scene.add(this.frame);
        } else {
            this.conn3DModels
                .filter((conn) => conn != undefined)
                .forEach((model3d) => scene.add(model3d));
            scene.add(this.getMesh());
            scene.add(this.frame);
        }
    }

    //return a mesh
    private generateScrewHole(x: number, y: number) {
        let pcbThickness = this.pcbModel.getPCBThickness();
        let pcbScrewHole = ShapeGenerator.creatCylinder(
            PCBGenerator.DEFAULT_SCREW_HOLE_DIAMETER,
            pcbThickness*2
        );

        pcbScrewHole.translateX(x + this.offset.x);
        pcbScrewHole.translateY(y + this.offset.y);
        pcbScrewHole.translateZ(pcbThickness*1.5 + this.offset.z);

        pcbScrewHole.rotateY(Math.PI/2);

        return pcbScrewHole;
    }

    //return a shape
    private generatePCBBase() {
        let baseplate = ShapeGenerator.creatBox(
            this.pcbModel.getDimensionX(),
            this.pcbModel.getDimensionY(),
            this.pcbModel.getPCBThickness()
        );

        baseplate.translateX(this.offset.x);
        baseplate.translateY(this.offset.y);
        baseplate.translateZ(this.offset.z);

        var geo = new THREE.EdgesGeometry(baseplate.geometry, 90);
        var mat = new THREE.LineBasicMaterial({color: this.pcbColor, linewidth: 20});
        this.frame = new THREE.LineSegments(geo, mat);

        this.frame.translateX(this.offset.x);
        this.frame.translateY(this.offset.y);
        this.frame.translateZ(this.offset.z);

        let sh = new Shape([], [], this.pcbColor);
        sh.addMesh(baseplate);

        return sh;
    }

    private generateConnectors() {
        this.conn3DModels = [];
        let conns = this.pcbModel.getConnectors();
        for (let i = 0; i < conns.length; i++) {
            this.conn3DModels.push(this.addConnector(conns[i]));
        }
    }

    private addConnector(conn: PCBConnectorI) {
        let model3D = conn.getModel().connector3DModel;
        if (!model3D) return undefined;
        model3D = model3D.clone();

        model3D.translateZ(conn.getPositionZ() + this.pcbModel.getPCBThickness());

        let outset = -conn.getOutset();

        model3D.translateX(this.offset.x);
        model3D.translateY(this.offset.y);
        model3D.translateZ(this.offset.z);

        switch(conn.getSide()) {
            case 0:
                model3D.translateY(-conn.getOutset());
                model3D.translateX(conn.getPositionX());
                model3D.rotateZ(Math.PI);
                break;
            case 1:
                model3D.translateY(conn.getPositionX());
                model3D.translateX(-conn.getOutset());
                model3D.rotateZ(Math.PI/2);
                break;
            case 2:
                model3D.translateY(this.pcbModel.getDimensionY() + conn.getOutset());
                model3D.translateX(conn.getPositionX());
                break;
            case 3:
                model3D.translateX(this.pcbModel.getDimensionX() + conn.getOutset());
                model3D.translateY(conn.getPositionX());
                model3D.rotateZ(-Math.PI/2);
                break;
            case 4:
                model3D.translateY(conn.getPositionY());
                model3D.translateX(conn.getPositionX());
                break;
        }
        model3D.rotateZ(conn.getOrientation());

        return model3D;
    }

    private generateFullPCBMesh(onError?: Function) {
        let sh = this.generatePCBBase();
        this.pcbModel.getScrewPositions().forEach((screPos) => {
            sh.subMesh(this.generateScrewHole(screPos[0], screPos[1]));
        }, this);

        this.mesh = sh.assembleFullShape(onError);
        this.mesh.material = new THREE.MeshPhongMaterial();
    }

    public getFrame() {
        return this.frame;
    }

    public getMesh() {
        if (!this.mesh)
            this.generateFullPCBMesh();
        return this.mesh;
    }

    public static loadModels() {
        return new Promise((accept, reject) => {
            Promise.all(PCBGenerator.MODELS.map(file => {
                return STLModelLoader.loadModelPromise(file)
            })).then((models: any) => {
                PCBGenerator.realisticModels = models;
                accept();
            });
        });
    }
}
