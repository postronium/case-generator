//librairie classes
import * as THREE from './../lib/three';

import Vector from '../mesh-simplificator/Vector';
import ComponentZone from './ComponentZone';
import ConnectorsZone from './ConnectorsZone';
import CaseTreeNode from './CaseTreeNode';
import GeneratableComponentInterface from '../generator/GeneratableComponentInterface';
import PCBConnectorI from '../model/PCBConnectorI';
import { CaseModel } from '../model/CaseModels';
import TopConnectorsZone from './TopConnectorsZone';
import * as CONNECTOR from '../model/ConnectorModels';
import AssemblyLinePreviewI from './AssemblyLinePreviewI';
import AssemblyLineModelI from './AssemblyLineModelI';
import ScrewsZone from './ScrewsZone';
import WallComponent from './WallComponent';
import GeneratableCaseOptionI from '../case-options/GeneratableCaseOptionI';

export default class Topplate implements CaseTreeNode {

    private static Z_TOLERANCE = 4;     //=0.4mm

    private parent: ComponentZone;
    private dimension: Vector;
    private invertNormals: boolean;
    private mesh: THREE.Mesh;
    private screwsZone: ComponentZone;
    private connectorsZone: ComponentZone;
    private walls: WallComponent[];
    private wallConnectorsZones: ConnectorsZone[];

    private holdPCBInPlace: boolean = false;

    private caseOptions: Array<GeneratableCaseOptionI>;

    constructor(parentComponent: ComponentZone, walls: WallComponent[], pcbModel: GeneratableComponentInterface, caseM: CaseModel,
            wallConnectorsZones: ConnectorsZone[], options: GeneratableCaseOptionI[]) {
        this.dimension = parentComponent.getSize();
        this.invertNormals = parentComponent.invertNormals;
        this.parent = parentComponent;
        this.walls = walls;
        this.wallConnectorsZones = wallConnectorsZones;
        this.caseOptions = options;

        this.initScrewsZone(pcbModel, caseM);

        this.generateConnectors(pcbModel, caseM);

        this.updateWithParentMatrix(parentComponent.originInWorld);
    }

    private generateConnectors(pcbModel: GeneratableComponentInterface, caseM: CaseModel) {
        let m = new THREE.Matrix4().makeTranslation(
            -caseM.getHTol() + caseM.getThickness(),
            -caseM.getHTol() + caseM.getThickness(),
            -pcbModel.getDimensionZUp()
        );

        let dimension = new Vector(
            pcbModel.getDimensionX(),
            pcbModel.getDimensionY(),
            pcbModel.getDimensionZUp()
        );

        this.connectorsZone = new ComponentZone(m, dimension, this.parent);

        this.connectorsZone.setInnerNode(new TopConnectorsZone(
            this.connectorsZone,
            pcbModel.getConnectors().filter((c) => c.getSide() == 4),
            caseM.getHTol(),
            4,
            true,
            this.wallConnectorsZones
        ));
    }

    private initScrewsZone(pcbModel: GeneratableComponentInterface, caseM: CaseModel) {
        let m = new THREE.Matrix4().makeTranslation(
            caseM.getThickness() + caseM.getHTol(),
            caseM.getThickness() + caseM.getHTol(),
            - caseM.getWallHeight(pcbModel) + caseM.getBottomOffset(pcbModel) + pcbModel.getPCBThickness() + caseM.getThickness()
        );

        let dimension = this.dimension.sub(new Vector(
            (caseM.getThickness() + caseM.getHTol())*2,
            (caseM.getThickness() + caseM.getHTol())*2,
            - caseM.getWallHeight(pcbModel) + caseM.getBottomOffset(pcbModel) + pcbModel.getPCBThickness() +
                caseM.getThickness() + Topplate.Z_TOLERANCE
        ));
        this.screwsZone = new ComponentZone(m, dimension);
        this.screwsZone.setInnerNode(new ScrewsZone(this.screwsZone, pcbModel, caseM));
    }

    public getStartPosition(): Vector {
        return new Vector(0, 0, 0);
    }

    public getEndPositions(): Vector {
        return this.dimension;
    }

    public getSize(): Vector {
        return this.dimension;
    }

    public addToScene(scene: any) {
        //scene.add(this.mesh);
        this.connectorsZone.addToScene(scene);
    }

    public assembleForPreview(assembly: AssemblyLinePreviewI) {
        assembly.addShape(this.mesh);
        this.connectorsZone.assembleForPreview(assembly);
        this.walls.forEach((w) => {
            w.getConnectors().assembleForPreview(assembly);
        });
        assembly.assemblyWithLastPositiveShape();
        this.caseOptions.forEach(o => o.assembleForPreview(
            this.parent.originInWorld, this.parent.invertNormals, this.parent.dimension, CaseModel.TOP, assembly));
        if (this.holdPCBInPlace)
            this.screwsZone.assembleForPreview(assembly);

    }

    public assemblyModel(assembly: AssemblyLineModelI) {
        assembly.addShape(this.mesh);
        this.connectorsZone.assemblyModel(assembly);
        this.walls.forEach((w) => {
            w.getConnectors().assemblyModel(assembly);
        });
        this.caseOptions.forEach(o => o.assemblyModel(
            this.parent.originInWorld, this.parent.invertNormals, this.parent.dimension, CaseModel.TOP, assembly));
        if (this.holdPCBInPlace)
            this.screwsZone.assemblyModel(assembly);
    }

    public updateWithParentMatrix(m: THREE.Matrix4) {
        this.mesh = new THREE.Mesh(this.getGeometry());
        this.mesh.applyMatrix(m);
        this.mesh.name = "topplate";
        this.screwsZone.updateWithParentMatrix(m);
    }

    public setInnerNode(node: CaseTreeNode) {
        throw new Error("Method not implemented.");
    }

    public toString(): string {
        return "Topplate";
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
}
