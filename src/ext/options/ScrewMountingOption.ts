import * as THREE from '../../lib/three';
import * as React from "react";

import CaseOption from '../../generator/CaseOption';
import Shape from '../../utils/Shape';
import ShapeGenerator from '../../utils/ShapeGenerator';
import PCBModel from '../../model/PCBModel';
import { CaseModel } from '../../model/CaseModels';
import UIScrewMountingOption from '../../components/options/UIScrewMountingOption';
import PCBModelCluster from '../../model/PCBModelCluster';
import Area1D from '../../utils/Area1D';

export default class ScrewsMountingOption extends CaseOption {

    public static NAME: string = "MountingOption";
    private static DEFAULT_SCREW_BORDER_MARGIN = 30;
    private static HEIGHT = 30;    // = 0.5 cm
    private static WIDTH = 80;    // = 1   cm

    private width: number;
    private height: number;
    private range: Area1D;

    private shape: Shape;
    private screwSettings: any;

    constructor(caseModel?: CaseModel, pcbModelCluster?: PCBModelCluster) {
        super(caseModel, pcbModelCluster);

        this.screwSettings = {
            d: 45,
            screws: []
        }

        this.range = new Area1D();

        //default dimensions
        this.setDimensions(ScrewsMountingOption.WIDTH, ScrewsMountingOption.HEIGHT);
    }

    private updateRange() {
        this.range.min = ScrewsMountingOption.DEFAULT_SCREW_BORDER_MARGIN;
        this.range.max = this.getCaseModel().getOutterCaseWidth(this.getPcbModelCluster()) - ScrewsMountingOption.DEFAULT_SCREW_BORDER_MARGIN;
    }

    private genScrewHolder() {
        this.shape = new Shape();

        if (!super.areModelsSet()) {
            console.warn("Impossible to genScrewHolder, PCB and/or CaseModel are undefined");
            return ;
        }

        if (!this.screwSettings) {
            console.warn("Impossible to generate screw holes, no screw settings found");
            return ;
        }


        let lengthOfHole = 500;

        //create model shapes
        let base = ShapeGenerator.creatBox(
            this.getCaseModel().getOutterCaseWidth(this.getPcbModelCluster()),
            this.width,
            this.height);
        let holeMesh = ShapeGenerator.creatCylinder(this.screwSettings.d, lengthOfHole);

        let corners = this.getPcbModelCluster().getCaseEdges(this.getCaseModel());   //the 4 corners of the whole case
        let zOffset = -this.getPcbModelCluster().getDimensionZDown() - this.getCaseModel().getVTol() - /*BasePlate.BASEPLATE_THICKNESS*/ 15;

        let corner0 = corners[PCBModel.CORNER_LEFT_FRONT];
        let sdCardSide = base.clone();
        sdCardSide.translateX(corner0.x);
        sdCardSide.translateY(corner0.y);
        sdCardSide.translateZ(zOffset);
        sdCardSide.rotateZ(Math.PI/2);
        this.shape.addMesh(sdCardSide);

        let corner1 = corners[PCBModel.CORNER_RIGHT_FRONT];
        for (let i = 0; i < this.screwSettings.screws.length; i++) {
            let zOffset = -this.getCaseModel().getBottomOffset(this.getPcbModelCluster()) + lengthOfHole/2;
            let middle = this.width/2;

            let screwPos = this.screwSettings.screws[i];
            let screwSdCardSideFront = holeMesh.clone();
            screwSdCardSideFront.translateX(corner0.x - middle);
            screwSdCardSideFront.translateY(corner0.y + screwPos);
            screwSdCardSideFront.translateZ(zOffset);
            screwSdCardSideFront.rotateY(Math.PI/2);
            this.shape.subMesh(screwSdCardSideFront);

            let screwLanSide = holeMesh.clone();
            screwLanSide.translateX(corner1.x + middle);
            screwLanSide.translateY(corner1.y + screwPos);
            screwLanSide.translateZ(zOffset);
            screwLanSide.rotateY(Math.PI/2);
            this.shape.subMesh(screwLanSide);
        }

        let corner2 = corners[PCBModel.CORNER_RIGHT_BACK];
        let lanSide = base.clone();
        lanSide.translateX(corner2.x);
        lanSide.translateY(corner2.y);
        lanSide.translateZ(zOffset);
        lanSide.rotateZ(-Math.PI/2);
        this.shape.addMesh(lanSide);
    }

    public rebuild(caseModel?: CaseModel, pcbModelCluster?: PCBModelCluster, part?: string) {
        super.setPCBAndCaseModel(caseModel, pcbModelCluster);
        this.shape = undefined;
    }

    public setDimensions(w: number, h: number) {
        this.width = w;
        this.height = h;
    }

    public getOptionName() {
        return ScrewsMountingOption.NAME;
    }

    public getBaseplateOption(shape: Shape) {
        this.updateRange();
        if (this.shape == undefined)
            this.genScrewHolder();
        shape.addChildShape(this.shape);
    }

    public getTopplateOption(shape: Shape) {

    }

    public getWallOption(shape: Shape, side: number) {

    }

    public onUpdate(screwSettings: any) {
        this.screwSettings = screwSettings;
    }

    public getSettingUI(update: Function) {
        return React.createElement(UIScrewMountingOption, {
            update: (screwSettings) => {update(), this.onUpdate(screwSettings)},
            length: this.getCaseModel().getOutterCaseWidth(this.getPcbModelCluster()),
            range: this.range
        });
    }

}
