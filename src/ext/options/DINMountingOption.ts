import * as THREE from '../../lib/three';
const ThreeBSP = require('../../lib/three-js-csg.js')(THREE);
import * as React from "react";

import CaseOption from '../../generator/CaseOption';
import Shape from '../../utils/Shape';
import ShapeGenerator from '../../utils/ShapeGenerator';
import STLModelLoader from '../../utils/STLModelLoader';
import StaticBSPMeshBuilder from '../../utils/StaticBSPMeshBuilder';
import PCBModel from '../../model/PCBModel';
import { CaseModel } from '../../model/CaseModels';
import UIScrewMountingOption from '../../components/options/UIScrewMountingOption';
import PCBModelCluster from '../../model/PCBModelCluster';

export default class DINMountingOption extends CaseOption {

    public static NAME: string = "DIN Mounting Options";
    public static MODEL_NAME: string = "DINCaseMount";
    public static MODEL_WIDTH: number = 100;    // = 10mm
    public static BORDER_OFFSET: number = 120;  // = 15mm
    public static MODEL_LENGTH: number = 500;   // = 50mm

    private width: number;
    private height: number;

    private shape: Shape;
    private dinMesh: THREE.Mesh;
    private caseSide: number = 2;

    constructor(caseModel?: CaseModel, pcbModelCluster?: PCBModelCluster) {
        super(caseModel, pcbModelCluster);

        this.dinMesh = new THREE.Mesh(StaticBSPMeshBuilder.getMesh(DINMountingOption.MODEL_NAME).toGeometry());
    }

    private genDINMount(shape: Shape) {
        if (!super.areModelsSet()) {
            console.warn("Impossible to genScrewHolder, PCB and/or CaseModel are undefined");
            return ;
        }

        let middleX = (this.getCaseModel().getOutterCaseLength(this.getPcbModelCluster()) - DINMountingOption.MODEL_LENGTH)/2;
        let originOffset = this.getCaseModel().getHTol() + this.getCaseModel().getThickness();
        let zOffset = -this.getPcbModelCluster().getDimensionZDown() - this.getCaseModel().getVTol();

        let meshA = this.dinMesh.clone();
        meshA.translateX(middleX);
        meshA.translateY(-originOffset + this.getCaseModel().getOutterCaseWidth(this.getPcbModelCluster()) - DINMountingOption.BORDER_OFFSET);
        meshA.translateZ(zOffset);
        meshA.rotateZ(Math.PI);
        meshA.rotateY(Math.PI/2);
        shape.addMesh(meshA);

        let meshB = this.dinMesh.clone();
        meshB.translateX(middleX);
        meshB.translateY(-originOffset + DINMountingOption.MODEL_WIDTH + DINMountingOption.BORDER_OFFSET);
        meshB.translateZ(zOffset);
        meshB.rotateZ(Math.PI);
        meshB.rotateY(Math.PI/2);
        shape.addMesh(meshB);
    }

    public rebuild(caseModel?: CaseModel, pcbModelCluster?: PCBModelCluster, part?: string) {
        super.setPCBAndCaseModel(caseModel, pcbModelCluster);
        this.shape = undefined;
    }

    public getOptionName() {
        return DINMountingOption.NAME;
    }

    public getBaseplateOption(shape: Shape) {

    }

    public getTopplateOption(shape: Shape) {

    }

    public getWallOption(shape: Shape, side: number) {
        if (side != this.caseSide)
            return;

        this.genDINMount(shape);
    }

    public getSettingUI(update: Function) {

    }

}
