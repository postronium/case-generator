//librairie classes
import * as THREE from './../lib/three';

import Vector from '../mesh-simplificator/Vector';
import ComponentZone from './ComponentZone';
import CaseTreeNode from './CaseTreeNode';
import GeneratableComponentInterface from '../generator/GeneratableComponentInterface';
import { CaseModel } from '../model/CaseModels';
import AssemblyLinePreviewI from './AssemblyLinePreviewI';
import AssemblyLineModelI from './AssemblyLineModelI';
import ScrewsZone from './ScrewsZone';
import GeneratableCaseOptionI from '../case-options/GeneratableCaseOptionI';

export default class Baseplate implements CaseTreeNode {

    private static Z_TOLERANCE = 4;     //=0.4mm

    private parent: ComponentZone;
    private dimension: Vector;
    private invertNormals: boolean;
    private mesh: THREE.Mesh;
    private screwsZone: ComponentZone;

    private caseOptions: Array<GeneratableCaseOptionI>;

    constructor(parentComponent: ComponentZone, pcbModel: GeneratableComponentInterface, caseM: CaseModel,
            options: GeneratableCaseOptionI[]) {
        this.dimension = parentComponent.getSize();
        this.invertNormals = parentComponent.invertNormals;
        this.parent = parentComponent;
        this.caseOptions = options;

        this.initScrewsZone(pcbModel, caseM);

        this.updateWithParentMatrix(parentComponent.originInWorld);
    }

    private initScrewsZone(pcbModel: GeneratableComponentInterface, caseM: CaseModel) {
        let m = new THREE.Matrix4().makeTranslation(
            caseM.getThickness() + caseM.getHTol(),
            caseM.getThickness() + caseM.getHTol(),
            0
        );

        let dimension = new Vector(
            this.dimension.x - (caseM.getThickness() + caseM.getHTol())*2,
            this.dimension.y - (caseM.getThickness() + caseM.getHTol())*2,
            caseM.getBottomOffset(pcbModel)
        );
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
        scene.add(this.mesh);
    }

    public assembleForPreview(assembly: AssemblyLinePreviewI) {
        if (this.mesh)
            assembly.addShape(this.mesh);
        this.caseOptions.forEach(o => o.assembleForPreview(
            this.parent.originInWorld, this.parent.invertNormals, this.parent.dimension, CaseModel.BOTTOM, assembly));
        this.screwsZone.assembleForPreview(assembly);
    }

    public assemblyModel(assembly: AssemblyLineModelI) {
        if (this.mesh)
            assembly.addShape(this.mesh);
        this.caseOptions.forEach(o => o.assemblyModel(
            this.parent.originInWorld, this.parent.invertNormals, this.parent.dimension, CaseModel.BOTTOM, assembly));
        this.screwsZone.assemblyModel(assembly);
    }

    public updateWithParentMatrix(m: THREE.Matrix4) {
        this.mesh = new THREE.Mesh(this.getGeometry());
        this.mesh.applyMatrix(m);
        this.mesh.name = "bottomplate";
        this.screwsZone.updateWithParentMatrix(m);
    }

    public setInnerNode(node: CaseTreeNode) {
        throw new Error("Method not implemented.");
    }

    public toString(): string {
        return "Baseplate";
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
