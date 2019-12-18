//librairie classes
import * as THREE from './../lib/three';

import CaseTreeNode from './CaseTreeNode';
import PCBConnectorI from '../model/PCBConnectorI';
import Vector from '../mesh-simplificator/Vector';

import ConnectorComp from './ConnectorComp';

import ConnectorsZone from './ConnectorsZone';
import ComponentZone from './ComponentZone';
import { CaseModel } from '../model/CaseModels';
import * as CONNECTOR from '../model/ConnectorModels';
import AssemblyLinePreviewI from './AssemblyLinePreviewI';
import AssemblyLineModelI from './AssemblyLineModelI';
import { Side } from './Side';

export default class TopConnectorsZone implements CaseTreeNode {

    private connectorZones: ComponentZone[];
    private connectorComps: ConnectorComp[];
    private parent: ComponentZone;
    private wallConnectorZones: ConnectorsZone[];

    constructor(parentComponent: ComponentZone, connectors: PCBConnectorI[], hTol: number, side: number, isTop: boolean, wallConnectorZones: ConnectorsZone[]) {
        this.generateConnectorZones(connectors);

        this.parent = parentComponent;
        this.wallConnectorZones = wallConnectorZones;

        //this.connectorZones.forEach((zone) => zone.updateWithParentMatrix(parentComponent.originInWorld));
    }

    private generateConnectorZones(connectors: PCBConnectorI[]) {
        this.connectorZones = [];
        this.connectorComps = [];
        connectors.forEach((conn) => {
            let model = conn.getModel();
            let m = new THREE.Matrix4();
            let dim = new Vector(model.dimX, 0, model.dimZ);
            m.multiply(new THREE.Matrix4().makeTranslation(conn.getPositionX(), conn.getPositionY(), 0));
            m.multiply(new THREE.Matrix4().makeRotationZ(conn.getOrientation()));
            this.connectorZones.push(new ComponentZone(m, dim));
            let conComp = new ConnectorComp(false, conn);
            this.connectorZones[this.connectorZones.length-1].setInnerNode(conComp);
            this.connectorComps.push(conComp);
        });
    }

    public getStartPosition() {
        return this.parent.getStartPosition();
    }

    public getEndPositions() {
        return this.parent.getEndPositions();
    }

    public getSize() {
        return this.parent.getSize();
    }

    public addToScene(scene: any) {
        this.connectorZones.forEach((zone) => zone.addToScene(scene));
    }

    public assembleForPreview(assembly: AssemblyLinePreviewI) {
        this.connectorComps.forEach((zone) => zone.assemblePartForPreview(assembly, Side.TOP));
        this.wallConnectorZones.forEach((zone) => zone.assembleTopForPreview(assembly));
    }

    public assemblyModel(assembly: AssemblyLineModelI) {
        this.connectorComps.forEach((zone) => zone.assemblyPartModel(assembly, Side.TOP));
        this.wallConnectorZones.forEach((zone) => zone.assembleTopModel(assembly));
    }

    public updateWithParentMatrix(m: THREE.Matrix4) {
        this.connectorZones.forEach(zone => zone.updateWithParentMatrix(m));
    }

    public setInnerNode(node: CaseTreeNode) {
        throw new Error("Method not implemented.");
    }

    public toString(): string {
        return "Connector Zone";
    }
}
