//librairie classes
import * as THREE from './../lib/three';

import Vector from '../mesh-simplificator/Vector';
import ComponentZone from './ComponentZone';
import CaseTreeNode from './CaseTreeNode';
import GeneratableComponentInterface from '../generator/GeneratableComponentInterface';
import PCBConnector from '../model/PCBConnector';
import PCBConnectorI from '../model/PCBConnectorI';
import { CaseModel } from '../model/CaseModels';
import ConnectorsZone from './ConnectorsZone';
import * as CONNECTOR from '../model/ConnectorModels';
import AssemblyLinePreviewI from './AssemblyLinePreviewI';
import AssemblyLineModelI from './AssemblyLineModelI';
import GeneratableCaseOptionI from '../case-options/GeneratableCaseOptionI';
import ScrewAssembly from './ScrewAssembly';

/*
 * The wall is a box that fills the entire parent zone
 */
export default class WallComponent implements CaseTreeNode {

    private static RANDOM_DIM = 100;
    private static CORNER_SPLIT_HEIGHT = 40;        //=4mm

    private mesh: THREE.Mesh;
    private dimension: Vector;

    private connectorsZone: ComponentZone;
    private invertNormals: boolean = false;
    private connectorZone: ConnectorsZone;

    private screwAssembly: ComponentZone[];

    private isTop: boolean;
    private side: number;
    private useScrews = true;

    private caseOptions: Array<GeneratableCaseOptionI>;

    private originInWorld: THREE.Matrix4;

    //connectors must be filtered
    constructor(isTop: boolean, parentComponent: ComponentZone, pcbModel: GeneratableComponentInterface,
            caseM: CaseModel, options: GeneratableCaseOptionI[], side: number) {
        this.isTop = isTop;
        this.side = side;
        this.dimension = parentComponent.getSize();
        this.caseOptions = options;
        this.invertNormals = parentComponent.invertNormals;
        this.originInWorld = parentComponent.originInWorld;
        this.screwAssembly = [];

        if (side%2 == 0 && this.useScrews) {
            let m1 = new THREE.Matrix4().makeTranslation(ScrewAssembly.SCREW_HEAD_RADIUS, this.getSize().y, 0);
            let m2 = new THREE.Matrix4().makeTranslation(this.getSize().x - ScrewAssembly.SCREW_HEAD_RADIUS, this.getSize().y, 0);
            m1.multiply(new THREE.Matrix4().makeRotationZ(-Math.PI/2));
            m2.multiply(new THREE.Matrix4().makeRotationZ(-Math.PI/2));

            this.screwAssembly[0] = new ComponentZone(m1, new Vector(1, 1, 1), parentComponent);
            this.screwAssembly[1] = new ComponentZone(m2, new Vector(1, 1, 1), parentComponent);
            this.screwAssembly[0].setInnerNode(new ScrewAssembly(parentComponent,
                caseM.getBottomOffset(pcbModel) + pcbModel.getPCBThickness() + WallComponent.CORNER_SPLIT_HEIGHT, isTop));
            this.screwAssembly[1].setInnerNode(new ScrewAssembly(parentComponent,
                caseM.getBottomOffset(pcbModel) + pcbModel.getPCBThickness() + WallComponent.CORNER_SPLIT_HEIGHT, isTop));
            this.screwAssembly.forEach(s => s.updateWithParentMatrix(parentComponent.originInWorld));
        }

        let dim = this.dimension.sub(new Vector(
            2 * (caseM.getThickness() + caseM.getHTol()),         //borders + tholerances
            -2*caseM.getHTol(),
            caseM.getBottomOffset(pcbModel)                       //remove space on bottom of the PCB
        ));

        let matrix = new THREE.Matrix4();
        matrix.multiply(new THREE.Matrix4().makeTranslation(
            caseM.getThickness() + caseM.getHTol(),                             //outter wall border <-> pcb border
            -caseM.getHTol(),                                                   //wallborder <-> pcb border
            caseM.getBottomOffset(pcbModel) + pcbModel.getPCBThickness()        //wallbottom <-> Z connector origin
        ));

        this.connectorsZone = new ComponentZone(matrix, dim, parentComponent, "Wall " + side + " connectors zone");
        this.connectorZone = new ConnectorsZone(
                this.connectorsZone,
                pcbModel.getConnectors().filter((conn) => conn.getSide() == side),
                caseM.getHTol(),
                side,
                isTop,
                WallComponent.CORNER_SPLIT_HEIGHT,
                this.useScrews
        )
        this.connectorsZone.setInnerNode(this.connectorZone);
    }

    public getConnectorZone() {
        return this.connectorZone;
    }

    private getGeometry() {
        let geometry = new THREE.BoxGeometry(
            this.dimension.x, this.dimension.y, this.dimension.z);
        geometry.translate(
            this.dimension.x/2, this.dimension.y/2, this.dimension.z/2);

        if (this.invertNormals) {
            for (var i = 0; i < geometry.faces.length; i++) {
                var face = geometry.faces[i];
                var temp = face.a;
                face.a = face.c;
                face.c = temp;
            }

            geometry.computeFaceNormals();
            geometry.computeVertexNormals();
        }

        return geometry;
    }

    //relative from parent
    public getStartPosition(): Vector {
        return new Vector(0, 0, 0);
    }

    public getEndPositions(): Vector {
        return this.dimension;
    }

    public getSize(): Vector {
        return this.dimension;
    }

    public getMesh() {
        if (!this.mesh)
            this.mesh = new THREE.Mesh(this.getGeometry());
        this.mesh.name = "wall side : " + this.side;
        return this.mesh;
    }

    public addToScene(scene) {
        //scene.add(this.getMesh());
        this.connectorsZone.addToScene(scene);
    }

    public assembleForPreview(assembly: AssemblyLinePreviewI) {
        assembly.addShape(this.getMesh());                          //add wall
        this.connectorZone.assembleSideForPreview(assembly);
        assembly.assemblyWithLastPositiveShape();
        this.caseOptions.forEach(o => o.assembleForPreview(
            this.originInWorld, this.invertNormals, this.dimension, this.side, assembly));
        if (this.screwAssembly)
            this.screwAssembly.forEach(s => s.assembleForPreview(assembly));
    }

    public assemblyModel(assembly: AssemblyLineModelI) {
        assembly.addShape(this.getMesh());                          //add wall
        this.connectorZone.assemblySideModel(assembly);
        this.caseOptions.forEach(o => o.assemblyModel(
            this.originInWorld, this.invertNormals, this.dimension, this.side, assembly));
        if (this.screwAssembly)
            this.screwAssembly.forEach(s => s.assemblyModel(assembly));
    }

    public setInnerNode(node: CaseTreeNode) {
        throw new Error("Method not implemented.");
    }

    public updateWithParentMatrix(m: THREE.Matrix4) {
        let geometry = this.getGeometry();
        geometry.applyMatrix(m);
        this.connectorsZone.updateWithParentMatrix(m);
        this.mesh = new THREE.Mesh(geometry);
    }

    public toString(): string {
        return "WallComponenet";
    }

    public getConnectors() {
        return this.connectorsZone;
    }

}
