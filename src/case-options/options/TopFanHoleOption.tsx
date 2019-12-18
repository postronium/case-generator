import * as THREE from '../../lib/three';

import CaseOptionI from '../CaseOptionI';
import * as ENUM from '../CaseOptionEnums';
import AssemblyLinePreviewI from '../../generator/AssemblyLinePreviewI';
import AssemblyLineModelI from '../../generator/AssemblyLineModelI';
import CaseTreeNode from '../../generator/CaseTreeNode';
import { CaseModel } from '../../model/CaseModels';
import Vector from '../../utils/Vector';
import GeneratableComponentInterface from '../../generator/GeneratableComponentInterface';
import Area2D from '../../utils/Area2D';
import * as COMP from '../../ui/UIutils';
import React = require('react');
import Position2D from '../../ui/UIPosition';

export default class TopFanHoleOption implements CaseOptionI {

    private static CYLINDER_RESOLUTION = 32;
    private static FAN_SCREW_DISTANCE = 40;         //distance between the outer fan border to the scre center

    private screwDiameter: number = 40;     //diameter of the screw hole
    private fanDiameter: number = 300;      //diameter of the hole for the fan (rotating part)

    private fanHoleMesh: THREE.Mesh;
    private fanScrewMesh: THREE.Mesh[];

    private positionCenterX: number;
    private positionCenterY: number;

    private possiblePositions: Area2D;

    private pcbModel: GeneratableComponentInterface;
    private caseModel: CaseModel;

    constructor() {
        this.generateFanHole();
        this.generateScrewHoles();

        this.onPositionUpdate = this.onPositionUpdate.bind(this);
        this.updateScrewDiameter = this.updateScrewDiameter.bind(this);
    }

    private screwHoleCenterOffset() {
        return (this.fanDiameter/2 + TopFanHoleOption.FAN_SCREW_DISTANCE)*Math.sin(Math.PI/4);
    }

    private generateFanHole() {
        let geom = new THREE.CylinderGeometry(
            this.fanDiameter/2, this.fanDiameter/2, 1000, TopFanHoleOption.CYLINDER_RESOLUTION);
        geom.rotateX(Math.PI/2);
        geom.translate(this.positionCenterX, this.positionCenterY, 0);
        this.fanHoleMesh = new THREE.Mesh(geom);
    }

    private generateScrewHoles() {
        let geom = new THREE.CylinderGeometry(
            this.screwDiameter/2, this.screwDiameter/2, 1000, TopFanHoleOption.CYLINDER_RESOLUTION);
        geom.rotateX(Math.PI/2);
        let fanRadius = this.fanDiameter/2;
        let screws = [];
        for (let i = 0; i < 4; i++) screws.push(geom.clone());
        let dFromCenter = this.screwHoleCenterOffset();
        screws[0].translate(dFromCenter, dFromCenter, 0);
        screws[1].translate(dFromCenter, -dFromCenter, 0);
        screws[2].translate(-dFromCenter, -dFromCenter, 0);
        screws[3].translate(-dFromCenter, dFromCenter, 0);

        screws.forEach(s => s.translate(this.positionCenterX, this.positionCenterY, 0));

        this.fanScrewMesh = screws.map((screw) => new THREE.Mesh(screw));
    }

    rebuild(pcbModel: GeneratableComponentInterface, caseModel: CaseModel) {
        this.pcbModel = pcbModel;
        this.caseModel = caseModel;

        this.calculatePossibleArea(pcbModel);

        if (!this.possiblePositions.isInside(this.positionCenterX, this.positionCenterY)) {
            this.positionCenterX = this.possiblePositions.getMinX();
            this.positionCenterY = this.possiblePositions.getMinY();
        }

        this.generateFanHole();
        this.generateScrewHoles();
    }

    private calculatePossibleArea(pcbModel: GeneratableComponentInterface) {
        this.possiblePositions = new Area2D(
            pcbModel.getDimensionX() - this.fanDiameter/2 - this.screwDiameter,
            pcbModel.getDimensionY() - this.fanDiameter/2 - this.screwDiameter
        );
        this.possiblePositions = this.possiblePositions.changeMin(
            this.fanDiameter/2 + this.screwDiameter,
            this.fanDiameter/2 + this.screwDiameter
        );
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
        if (part != CaseModel.TOP) return;

        this.fanScrewMesh.forEach((mesh) => {
            let clone = mesh.clone();
            clone.applyMatrix(m);
            assembly.subShape(clone);
        });

        let clone = this.fanHoleMesh.clone();
        clone.applyMatrix(m);
        assembly.subShape(clone);

        assembly.assemblyWithLastPositiveShape();
    }

    assemblyModel(m: THREE.Matrix4, needInversion: boolean, size: Vector, part: number,
            assembly: AssemblyLineModelI) {
        if (part != CaseModel.TOP) return;

        this.fanScrewMesh.forEach((mesh) => {
            let clone = mesh.clone();
            clone.applyMatrix(m);
            assembly.subShape(clone);
        });

        let clone = this.fanHoleMesh.clone();
        clone.applyMatrix(m);
        assembly.subShape(clone);
    }

    getCategory(): ENUM.CaseOptionCategory {
        throw new Error("Method not implemented.");
    }

    getCaseOptionUI(onUpdate: Function) {
        return <TopFanHoleOption.ui option={this} onUpdate={onUpdate}/>;
    }

    toString() {
        return "Pi Fan 30mm";
    }

    getName() {
        return "Pi Fan 30mm"
    }

    private onPositionUpdate(x: number, y: number, id: number) {
        this.positionCenterX = x;
        this.positionCenterY = y;

        this.generateFanHole();
        this.generateScrewHoles();
    }

    private updateScrewDiameter(diam) {
        this.screwDiameter = diam;
        this.generateScrewHoles();
    }

    private static ui(props) {
        return (<div>
            <h5>{props.option.getName()}</h5>
            <Position2D
                validArea={props.option.possiblePositions}
                id={-1}
                onUpdate={(x, y, id) => {props.option.onPositionUpdate(x, y, id); props.onUpdate();}}
                initialPos={{x: props.option.positionCenterX, y: props.option.positionCenterY, z: 0}}/>
            <br/>
        </div>);
    }
}
