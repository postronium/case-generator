//librairie classes
import * as THREE from './../lib/three';

import Vector from '../mesh-simplificator/Vector';
import ComponentZone from './ComponentZone';
import CaseTreeNode from './CaseTreeNode';
import GeneratableComponentInterface from '../generator/GeneratableComponentInterface';
import { CaseModel } from '../model/CaseModels';
import AssemblyLinePreviewI from './AssemblyLinePreviewI';
import AssemblyLineModelI from './AssemblyLineModelI';
import Screw from './Screw';

export default class ScrewsZone implements CaseTreeNode {

    private parent: ComponentZone;
    private dimension: Vector;
    private invertNormals: boolean;
    private screwZones: ComponentZone[];
    private screwHeadRadius: number;

    constructor(parentComponent: ComponentZone, pcbModel: GeneratableComponentInterface, caseM: CaseModel) {
        this.dimension = parentComponent.getSize();
        this.invertNormals = parentComponent.invertNormals;
        this.parent = parentComponent;
        this.screwHeadRadius = pcbModel.getScrewheadRadius();

        this.initScrewZones(caseM, pcbModel.getScrewPositions());

        this.updateWithParentMatrix(parentComponent.originInWorld);
    }

    private initScrewZones(caseM: CaseModel, connectors: any[]) { //screwPositions number[][]
        let dim = new Vector(this.screwHeadRadius*2, this.screwHeadRadius*2, this.dimension.z);

        this.screwZones = [];

        for (let i = 0; i < connectors.length; i++) {
            let m = new THREE.Matrix4().makeTranslation(
                connectors[i][0], connectors[i][1], 0
            );

            this.screwZones[i] = new ComponentZone(m, dim);
            this.screwZones[i].setInnerNode(new Screw(this.screwZones[i], caseM, this.screwHeadRadius));
        }
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

    }

    public assembleForPreview(assembly: AssemblyLinePreviewI) {
        //assembly.addShape(this.parent.getWireFrame());
        this.screwZones.forEach((z) => z.assembleForPreview(assembly));
    }

    public assemblyModel(assembly: AssemblyLineModelI) {
        this.screwZones.forEach((z) => z.assemblyModel(assembly));
    }

    public updateWithParentMatrix(m: THREE.Matrix4) {
        this.screwZones.forEach((z) => z.updateWithParentMatrix(m));
    }

    public setInnerNode(node: CaseTreeNode) {
        throw new Error("Method not implemented.");
    }

    public toString(): string {
        return "ScrewsZone";
    }
}
