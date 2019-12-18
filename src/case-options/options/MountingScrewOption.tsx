import React = require('react');
import * as THREE from '../../lib/three';

import CaseOptionI from '../CaseOptionI';
import * as ENUM from '../CaseOptionEnums';
import AssemblyLinePreviewI from '../../generator/AssemblyLinePreviewI';
import AssemblyLineModelI from '../../generator/AssemblyLineModelI';
import CaseTreeNode from '../../generator/CaseTreeNode';
import { CaseModel } from '../../model/CaseModels';
import Vector from '../../utils/Vector';
import GeneratableComponentInterface from '../../generator/GeneratableComponentInterface';
import Shape from '../../utils/Shape';
import * as COMP from '../../ui/UIutils';

export default class MountingScrewOption implements CaseOptionI {

    private static SCREW_DIAM_MIN = 30;
    private static SCREW_DIAM_MAX = 70;
    private static SPACING_MIN = 200;

    private thickness: number;      //height of the support
    private spacing: number;        //distance between the two screw on the same side
    private screwDiameter: number;
    private width: number;          //width of the outset
    private outset: number;         //outset from case wall

    private base: THREE.Mesh;
    private hole: THREE.Mesh;

    private pcbModel: GeneratableComponentInterface;
    private caseModel: CaseModel;

    private finalMeshes: THREE.Mesh[];

    constructor() {
        this.thickness = 50;        //5mm
        this.spacing = 750;         //75mm
        this.screwDiameter = 45;    //4.5mm
        this.width = 100;           //15mm
        this.outset = 50;          //10mm

        this.generateBase();
        this.generateScreHole();

        this.updateScrewSpacing.bind(this);
        this.updateScrewDiameter.bind(this);
    }

    private generateBase() {
        let outter = new THREE.CylinderGeometry(this.width/2, this.width/2, this.thickness, 32);
        outter.rotateX(Math.PI/2);
        let inner = new THREE.BoxGeometry(this.width, this.outset, this.thickness);
        inner.translate(0, this.outset/2, 0);

        let shape = new Shape();
        shape.addMesh(new THREE.Mesh(outter));
        shape.addMesh(new THREE.Mesh(inner));
        this.base = shape.assembleFullShape();
    }

    private generateScreHole() {
        let holeGeometry = new THREE.CylinderGeometry(this.screwDiameter/2, this.screwDiameter/2, this.thickness);
        holeGeometry.rotateX(Math.PI/2);
        this.hole = new THREE.Mesh(holeGeometry);
    }

    rebuild(pcbModel: GeneratableComponentInterface, caseModel: CaseModel) {
        this.pcbModel = pcbModel;
        this.caseModel = caseModel;

        this.finalMeshes = [];

        let centerX = caseModel.getOutterCaseLength(pcbModel)/2;
        let width = caseModel.getOutterCaseWidth(pcbModel);

        let firstM = (new THREE.Matrix4()).makeTranslation(centerX - this.spacing/2, -this.outset, this.thickness/2);
        let secondM = (new THREE.Matrix4()).makeTranslation(centerX + this.spacing/2, -this.outset, this.thickness/2);
        let thirdM = (new THREE.Matrix4()).makeTranslation(centerX - this.spacing/2, this.outset + width, this.thickness/2);
        let fourthM = (new THREE.Matrix4()).makeTranslation(centerX + this.spacing/2, this.outset + width, this.thickness/2);

        thirdM.multiply((new THREE.Matrix4()).makeRotationZ(Math.PI));
        fourthM.multiply((new THREE.Matrix4()).makeRotationZ(Math.PI));

        let sh = new Shape();
        sh.addMesh(this.base.clone());
        sh.subMesh(this.hole.clone());
        let assembledPart = sh.assembleFullShape();
        let first = assembledPart.clone();
        first.applyMatrix(firstM);
        let second = assembledPart.clone();
        second.applyMatrix(secondM);
        let third = assembledPart.clone();
        third.applyMatrix(thirdM);
        let fourth = assembledPart.clone();
        fourth.applyMatrix(fourthM);

        this.finalMeshes.push(first);
        this.finalMeshes.push(second);
        this.finalMeshes.push(third);
        this.finalMeshes.push(fourth);
    }

    private inverseGeometry(needInversion: boolean, geom: THREE.Geometry) {
        if (needInversion) {
            for (var i = 0; i < geom.faces.length; i++) {
                var face = geom.faces[i];
                var temp = face.a;
                face.a = face.c;
                face.c = temp;
            }

            geom.computeFaceNormals();
            geom.computeVertexNormals();
        }
    }

    assembleForPreview(m: THREE.Matrix4, needInversion: boolean, size: Vector, part: number,
            assembly: AssemblyLinePreviewI) {
        if (part != CaseModel.BOTTOM) return;

        this.finalMeshes.forEach((mesh) => {
            mesh.applyMatrix(m);
            assembly.addShape(mesh);
        });

        assembly.assemblyWithLastPositiveShape();
    }

    assemblyModel(m: THREE.Matrix4, needInversion: boolean, size: Vector, part: number,
            assembly: AssemblyLineModelI) {
        if (part != CaseModel.BOTTOM) return;

        this.finalMeshes.forEach((mesh) => {
            mesh.applyMatrix(m);
            assembly.addShape(mesh);
        });
    }

    getCategory(): ENUM.CaseOptionCategory {
        throw new Error("Method not implemented.");
    }

    getCaseOptionUI(onUpdate: Function) {
        return (<MountingScrewOption.ui
            option={this}
            updateScrewDiameter={this.updateScrewDiameter}
            updateScrewSpacing={this.updateScrewSpacing}
            onUpdate={onUpdate} />);
    }

    toString() {
        return "MountingScrewOption";
    }

    getName() {
        return "Side screws"
    }

    private static ui(props) {
        let maxSpacing = props.option.caseModel.getOutterCaseLength(props.option.pcbModel) - props.option.width;
        return (<div>
            <h5>{props.option.getName()}</h5>
            <COMP.NumValue
                max={maxSpacing}
                min={MountingScrewOption.SPACING_MIN}
                default={props.option.spacing}
                onUpdate={(val) => {props.option.updateScrewSpacing(val); props.onUpdate();}}
                label="Spacing"/>
            <COMP.NumValue
                max={MountingScrewOption.SCREW_DIAM_MAX}
                min={MountingScrewOption.SCREW_DIAM_MIN}
                default={props.option.screwDiameter}
                onUpdate={(val) => {props.option.updateScrewDiameter(val); props.onUpdate();}}
                label="Screw diameter"/>
            <br/>
        </div>);
    }

    private updateScrewDiameter(diam: number) {
        this.screwDiameter = diam;
        this.generateScreHole();
    }

    private updateScrewSpacing(spacing: number) {
        this.spacing = spacing;
    }
}
