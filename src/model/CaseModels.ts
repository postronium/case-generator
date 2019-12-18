//react imports
import * as React from "react";
import * as ReactDOM from "react-dom";

import GeneratableComponentInterface from '../generator/GeneratableComponentInterface';
import PCBConnector from './PCBConnector';
import UIInfo from '../ui/UIInfo';

/*
    Units are in 1/10 mm (10=1mm in reality)
*/

export class CaseModel {

    public static CORNER_LEFT_FRONT: number = 0;              //0 = left corner of the side 0
    public static CORNER_RIGHT_FRONT: number = 1;             //1 = right corner of the side 0
    public static CORNER_RIGHT_BACK: number = 2;               //2 = right corner of the side 2
    public static CORNER_LEFT_BACK: number = 3;              //3 = left corner of the side 2
    public static SIDE_FRONT: number = 0;       //0 front side, long side of the RPI3 with the origin on the left
    public static SIDE_LEFT: number = 1;        //1 left side, short side of the RPI3, with the origin on the right
    public static SIDE_BACK: number = 2;        //2 back side, long side of the RPI3, disconnected from the origin
    public static SIDE_RIGHT: number = 3;       //3 right side, short side of the RPI3, disconnected from the origin
    public static TOP: number = 4;
    public static BOTTOM: number = 5;

    public static MIN_SCREW_POS: number = 25;
    private static DEFAULT_SPACER_HIGHT = 0;
    private static DEFAULT_SPACER_TOL = 0;
    private static M25_SCREW_DIAM = 25;
    private static DEFAULT_SCREW_SUPPORT_THICKNESS = 13;
    private static DEFAULT_CIRCLE_RESOLUTION = 16;
    private static M25_SCREW_HEAD_DIAM = 55;
    private static DEFAULT_INNER_THICKNESS = 30;
    private static BASEPLATE_THICKNESS: number = 25;

    public static DEFAULT_CASE_THICKNESS: number = 20;
    public static MAX_CASE_THICKNESS: number = 25;
    public static MIN_CASE_THICKNESS: number = 15;

    name: string;
    baseToleranceH: number;
    baseToleranceV: number;
    screwSupportTkickness: number;
    private screwDiameter: number;

    //EXT
    pcbHolderHeight: number;
    pcbHolderTol: number;

    private thickness: number;
    private screwless: boolean;

    constructor(name: string, baseToleranceH: number, baseToleranceV: number, thickness: number, screwSupportTkickness?: number, screwDiameter?: number) {
        this.name = name;
        this.baseToleranceH = baseToleranceH;
        this.baseToleranceV = baseToleranceV;
        this.thickness = thickness;
        this.screwSupportTkickness = screwSupportTkickness == undefined ? CaseModel.DEFAULT_SCREW_SUPPORT_THICKNESS : screwSupportTkickness;
        this.screwDiameter = screwDiameter == undefined ? CaseModel.M25_SCREW_DIAM : screwDiameter;
        this.screwless = false;
        this.pcbHolderHeight = 20;
        this.pcbHolderTol = 1;
    }

    public getCaseEdge(edgeId: number, pcbModel: GeneratableComponentInterface) {
        let x, y;
        let side = this.getHSideMargin(pcbModel);
        switch(edgeId) {
            case CaseModel.CORNER_LEFT_FRONT:
                x = -side;
                y = -side;
                break;
            case CaseModel.CORNER_RIGHT_FRONT:
                x = pcbModel.getDimensionX() + side;
                y = -side;
                break;
            case CaseModel.CORNER_RIGHT_BACK:
                x = pcbModel.getDimensionX() + side;
                y = pcbModel.getDimensionY() + side;
                break;
            case CaseModel.CORNER_LEFT_BACK:
                x = -side;
                y = pcbModel.getDimensionY() + side;
                break;
            default:
                console.error("invalide edge ID (can be from 0 to 3)");
                break;
        }
        return {x: x, y: y};
    }

    public getCaseEdges(pcbModel: GeneratableComponentInterface) {
        let sides = [
            CaseModel.CORNER_LEFT_FRONT,
            CaseModel.CORNER_RIGHT_FRONT,
            CaseModel.CORNER_RIGHT_BACK,
            CaseModel.CORNER_LEFT_BACK
        ];
        return sides.map((side) => {
            return this.getCaseEdge(side, pcbModel);
        }, this);
    }

    public getScrewholeRadiusTight() {
        return (this.screwDiameter-this.pcbHolderTol)/2;
    }

    public getScrewHoleRadiusLoosen() {
        return (this.screwDiameter+this.pcbHolderTol)/2;
    }

    private checkPCBValidity(pcbModel: GeneratableComponentInterface) {
        if (!pcbModel) {
            console.warn("PCBModel is undefined, returning -1 as default value");
            return false;
        }
        return true;
    }

    //Functions for the dimensions

    public getHTol() {
        return this.baseToleranceH;
    }

    public getVTol() {
        return this.baseToleranceV;
    }

    public getThickness() {
        return this.thickness;
    }

    public setThickness(thickness: number) {
        this.thickness = thickness;
    }

    public getCylinderResolution() {
        return CaseModel.DEFAULT_CIRCLE_RESOLUTION;
    }

    public getInnerTopThickness() {
        return CaseModel.DEFAULT_INNER_THICKNESS;
    }

    /*
     * If the case is less hight that the spacer : print the case with the spacer included
    */
    public getSpacerHeight(pcbModel: GeneratableComponentInterface) {
        if (!this.checkPCBValidity(pcbModel)) return -1;
        if (pcbModel.getDimensionZUp() >= CaseModel.DEFAULT_SPACER_HIGHT)
            return CaseModel.DEFAULT_SPACER_HIGHT + CaseModel.DEFAULT_SPACER_TOL;
        return CaseModel.DEFAULT_SPACER_TOL;
    }

    public getHSideMargin(pcbModel?: GeneratableComponentInterface, side?: number) {
        let hMargin = this.getHTol() + this.getThickness();
        if (side === undefined)
            return hMargin;
        return hMargin;
    }

    public getVSideMargine() {
        return this.getVTol() + this.getThickness();
    }

    public getFullHMargine() {
        return 2*this.getHSideMargin();
    }

    public getScrewGap(pcbModel: GeneratableComponentInterface) {
        if (!this.checkPCBValidity(pcbModel)) return -1;
        return this.getVTol() + pcbModel.getDimensionZDown();
    }

    //distance from z=0 to the outter bottom of the case
    public getBottomOffset(pcbModel: GeneratableComponentInterface) {
        if (!this.checkPCBValidity(pcbModel)) return -1;
        return pcbModel.getDimensionZDown() + this.getVTol() + CaseModel.BASEPLATE_THICKNESS;
    }

    public getTopOffset(pcbModel: GeneratableComponentInterface) {
        if (!this.checkPCBValidity(pcbModel)) return -1;
        return pcbModel.getDimensionZUp() + this.getThickness();
    }

    public getOutterCaseLength(pcbModel: GeneratableComponentInterface): number {
        if (!this.checkPCBValidity(pcbModel)) return -1;
        return this.getFullHMargine() + pcbModel.getDimensionX();
    }

    public getOutterCaseWidth(pcbModel: GeneratableComponentInterface): number {
        if (!this.checkPCBValidity(pcbModel)) return -1;
        return this.getFullHMargine() + pcbModel.getDimensionY();
    }

    public getInnerCaseLength(pcbModel: GeneratableComponentInterface) {
        if (!this.checkPCBValidity(pcbModel)) return -1;
        return this.getHTol()*2 + pcbModel.getDimensionX();
    }

    public getInnerCaseWidth(pcbModel: GeneratableComponentInterface) {
        if (!this.checkPCBValidity(pcbModel)) return -1;
        return this.getHTol()*2 + pcbModel.getDimensionY();
    }

    public getInnerCaseHeight(pcbModel: GeneratableComponentInterface) {
        if (!this.checkPCBValidity(pcbModel)) return -1;
        return pcbModel.getDimensionFullHeight() + this.getVTol();
    }

    public getOutterCaseHeight(pcbModel: GeneratableComponentInterface): number {
        if (!this.checkPCBValidity(pcbModel)) return -1;
        return this.getTopOffset(pcbModel) + this.getBottomOffset(pcbModel);
    }

    public getWallHeight(pcbModel: GeneratableComponentInterface) {
        if (!this.checkPCBValidity(pcbModel)) return -1;
        return pcbModel.getDimensionZDown() + this.getVTol() + CaseModel.BASEPLATE_THICKNESS + pcbModel.getDimensionZUp() + pcbModel.getPCBThickness() +
                CaseModel.DEFAULT_INNER_THICKNESS;
    }

    public getScrewDiameter() {
        return this.screwDiameter;
    }

    public setScrewless(isScrewless: boolean) {
        this.screwless = isScrewless;
    }

    public isScrewless() {
        return this.screwless;
    }




    connectorFilter(conn: PCBConnector) {
        return false;
    }

    connectorEnabled(conn: PCBConnector) {
        //conn.hole = false;
    }

    // ############## Setting UI ##############
    getSettingUI(onUpdate: Function, pcbModel: GeneratableComponentInterface) {
        return React.createElement(UIInfo, {});
    }
}

export class DEFAULT extends CaseModel {

    public static baseToleranceH = 1;
    public static baseToleranceV = 0;
    public static thickness = 20;

    constructor() {
        super("Default RPI Case", DEFAULT.baseToleranceH, DEFAULT.baseToleranceV, DEFAULT.thickness);
    }

    connectorFilter(conn: PCBConnector) {
        return true;
    }
}

export class JSON extends CaseModel {
    constructor(json: any) {
        super("CaseModel from json", json.horizontalTolerance, 0, json.wallThickness);
    }

    connectorFilter(conn: PCBConnector) {
        return true;
    }
}
