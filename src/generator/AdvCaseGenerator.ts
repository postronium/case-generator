//librairie classes
import * as THREE from './../lib/three';

import CaseGeneratorI from '../generator/CaseGeneratorI';
import * as CASE from '../model/CaseModels';
import GeneratableComponentInterface from '../generator/GeneratableComponentInterface';
import ComponentZone from './ComponentZone';
import Vector from '../utils/Vector';
import PCBModel from '../model/PCBModel';
import WallComponent from './WallComponent';
import AssemblyLinePreviewI from './AssemblyLinePreviewI';
import AssemblyLineModelI from './AssemblyLineModelI';
import AssemblyLineModel from './AssemblyLineModel';
import AssemblyLinePreview from './AssemblyLinePreview';
import Baseplate from './Baseplate';
import Topplate from './Topplate';
import SecondaryWall from './SecondaryWall';
import GeneratableCaseOptionI from '../case-options/GeneratableCaseOptionI';

export default class AdvCaseGenerator implements CaseGeneratorI {

    private static DISPLAY_WIREFRAM = true;
    private static SIDE_WALL_ROTATION = new THREE.Matrix4().makeRotationZ(Math.PI/2); //90 degree rotation
    private preview: AssemblyLinePreviewI;
    private assembly: AssemblyLineModelI;

    private bottomZone: ComponentZone;     //location of the bottom plate
    private topZone: ComponentZone;     //location of the bottom plate
    private wallsZone: ComponentZone[];     //location of the bottom plate
    private innerWallZone: ComponentZone[];
    private walls: WallComponent[];
    private drawWireframe = true;           //display ComponentPlacements to debug
    private needUpdate;
    private isTop = true;
    private assembledMesh: THREE.Mesh;
    private assembledMeshs: THREE.Mesh[];

    constructor(caseM: CASE.CaseModel, pcbModel: GeneratableComponentInterface, options: GeneratableCaseOptionI[], isTop: boolean) {
        this.isTop = isTop;
        this.rebuild(caseM, pcbModel, options);
        this.needUpdate = true;
    }

    public rebuild(caseM?: CASE.CaseModel, pcbModel?: GeneratableComponentInterface, options?: GeneratableCaseOptionI[], part?: string) {
        let corners = caseM.getCaseEdges(pcbModel);     //outter corner of the case

        options.forEach(o => o.rebuild(pcbModel, caseM));

        this.initWallPlacements(caseM, pcbModel);

        //this.wallsZone.forEach((zone, i) => zone.innerNode.setInnerNode(new ConnectorComponent((i==0 || i == 3))));

        this.walls = [];

        for (let i = 0; i < 4; i++) {
            this.walls.push(new WallComponent(this.isTop, this.wallsZone[i], pcbModel, caseM, options, i));
        }

        this.initTopBottom(caseM, pcbModel, options);

        this.wallsZone.forEach((zone, i) => zone.setInnerNode(this.walls[i]));
        this.needUpdate = true;


        this.innerWallZone = [];

        let secondaryWalls = pcbModel.getSecondaryInnerWalls();
        if (secondaryWalls) {
            secondaryWalls.forEach(w => {
                let m = new THREE.Matrix4().makeTranslation(w.pos.x, w.pos.y, -caseM.getBottomOffset(pcbModel));
                let dim = new Vector(w.dim.x, w.dim.y, caseM.getBottomOffset(pcbModel) + pcbModel.getPCBThickness());
                let zone = new ComponentZone(m, dim);
                zone.setInnerNode(new SecondaryWall(zone, pcbModel));
                zone.updateWithParentMatrix();
                this.innerWallZone.push(zone);
            });
        }

        //generate mesh

        this.preview = new AssemblyLinePreview();

        this.wallsZone.forEach(w => w.assembleForPreview(this.preview));
        if (this.isTop){
            this.topZone.assembleForPreview(this.preview);
        } else {
            this.innerWallZone.forEach(w => w.assembleForPreview(this.preview));
            this.bottomZone.assembleForPreview(this.preview);
        }
        //this.walls.forEach((w) => w.addToScene(scene));

        //this.topZone.addToScene(scene);

        this.assembledMeshs = this.preview.getFullMeshs();

        let material = new THREE.MeshLambertMaterial({color: 0x444444});
        // load a texture, set wrap mode to repeat
        /*
        var texture = new THREE.TextureLoader().load("plastic.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 100);
        */

        for (let i = 0; i < this.assembledMeshs.length; i++) {
            this.assembledMeshs[i].material = material;
        }
/*
        this.assembledMeshs.forEach(m => {
            m.material = material;
        });*/
        //this.assembledMesh.material = material;

        //this.topZone.addToScene(scene);
    }

    private initTopBottom(caseM: CASE.CaseModel, pcbModel: GeneratableComponentInterface, options: GeneratableCaseOptionI[]) {
        let corners = caseM.getCaseEdges(pcbModel);     //outter corner of the case

        let bottomMx = new THREE.Matrix4().makeTranslation(
            corners[PCBModel.CORNER_LEFT_FRONT].x,
            corners[PCBModel.CORNER_LEFT_FRONT].y,
            -caseM.getBottomOffset(pcbModel)
        );

        let bottomDim = new Vector(
            caseM.getOutterCaseLength(pcbModel),
            caseM.getOutterCaseWidth(pcbModel),
            caseM.getThickness()
        );
        this.bottomZone = new ComponentZone(bottomMx, bottomDim, undefined);
        this.bottomZone.setInnerNode(new Baseplate(this.bottomZone, pcbModel, caseM, options));



        let topMx = new THREE.Matrix4().makeTranslation(
            corners[PCBModel.CORNER_LEFT_FRONT].x,
            corners[PCBModel.CORNER_LEFT_FRONT].y,
            caseM.getWallHeight(pcbModel) - caseM.getBottomOffset(pcbModel) - caseM.getThickness()
        );

        let topDim = new Vector(
            caseM.getOutterCaseLength(pcbModel),
            caseM.getOutterCaseWidth(pcbModel),
            caseM.getThickness()
        );

        let wallConnectorsZones = this.walls.map((w) => w.getConnectorZone());
        this.topZone = new ComponentZone(topMx, topDim);
        this.topZone.setInnerNode(new Topplate(this.topZone, this.walls, pcbModel, caseM, wallConnectorsZones, options));
    }

    private initWallPlacements(caseM: CASE.CaseModel, pcbModel: GeneratableComponentInterface) {
        let corners = caseM.getCaseEdges(pcbModel);     //outter corner of the case

        //place walls
        this.wallsZone = [];
        let wallTop = caseM.getWallHeight(pcbModel) - caseM.getBottomOffset(pcbModel);
        let wallBottom = -caseM.getBottomOffset(pcbModel);
        let wallHeight = wallTop-wallBottom;

        let frontMx = new THREE.Matrix4();
        frontMx.multiply(new THREE.Matrix4().makeTranslation(
            -caseM.getHTol()-caseM.getThickness(), -caseM.getHTol(), wallBottom));

        this.wallsZone[PCBModel.SIDE_FRONT] = new ComponentZone(frontMx,
            new Vector(caseM.getOutterCaseLength(pcbModel), -caseM.getThickness(), wallHeight),
            undefined, "left wall");



        let leftMx = new THREE.Matrix4();
        leftMx.multiply(AdvCaseGenerator.SIDE_WALL_ROTATION);
        leftMx.multiply(new THREE.Matrix4().makeTranslation(
            -caseM.getHTol()-caseM.getThickness(), caseM.getHTol(), wallBottom));

        this.wallsZone[PCBModel.SIDE_LEFT] = new ComponentZone(leftMx,
            new Vector(caseM.getOutterCaseWidth(pcbModel), caseM.getThickness(), wallHeight),
            undefined, "left wall");




        let backMx = new THREE.Matrix4();
        backMx.multiply(new THREE.Matrix4().makeTranslation(
            -caseM.getHTol()-caseM.getThickness(), caseM.getHTol()+pcbModel.getDimensionY(), wallBottom));

        this.wallsZone[PCBModel.SIDE_BACK] = new ComponentZone(backMx,
            new Vector(caseM.getOutterCaseLength(pcbModel), caseM.getThickness(), wallHeight),
            undefined, "left wall");


        let rightMx = new THREE.Matrix4();
        rightMx.multiply(AdvCaseGenerator.SIDE_WALL_ROTATION);
        rightMx.multiply(new THREE.Matrix4().makeTranslation(
            -caseM.getHTol()-caseM.getThickness(), -caseM.getHTol()-pcbModel.getDimensionX(), wallBottom));

        this.wallsZone[PCBModel.SIDE_RIGHT] = new ComponentZone(rightMx,
            new Vector(caseM.getOutterCaseWidth(pcbModel), -caseM.getThickness(), wallHeight),
            undefined, "left wall");
    }



    addToScene(scene, onError?: Function) {
        //this.assembledMesh.forEach(m => scene.add(m));
        //cene.add(this.assembledMesh);
        this.assembledMeshs.forEach(m => scene.add(m));
/*
        this.wallsZone.forEach(w => w.addToScene(scene));
        if (this.isTop){
            this.topZone.addToScene(scene);
        } else {
            this.innerWallZone.forEach(w => w.addToScene(scene));
            this.bottomZone.addToScene(scene);
        }*/
    }

    getFullMesh() {
        this.assembly = new AssemblyLineModel();
        if (this.isTop) {
            this.topZone.assemblyModel(this.assembly);
        } else {
            this.bottomZone.assemblyModel(this.assembly);
            this.innerWallZone.forEach(w => w.assemblyModel(this.assembly));
        }
        this.wallsZone.forEach(w => w.assemblyModel(this.assembly));
        return this.assembly.getFinalModel();
    }

    getBaseMesh() {
        console.log("get base mesh called");
        return new THREE.Mesh();
    }

    getTopMesh() {
        console.log("get top mesh called");
        return new THREE.Mesh();
    }
}
