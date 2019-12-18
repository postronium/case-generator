//librairie classes
import * as THREE from './../lib/three';

import CaseTreeNode from './CaseTreeNode';
import PCBConnector from '../model/PCBConnector';
import PCBConnectorI from '../model/PCBConnectorI';
import Vector from '../mesh-simplificator/Vector';

import ConnectorComp from './ConnectorComp';
import { Side } from './Side';

import ComponentZone from './ComponentZone';
import { CaseModel } from '../model/CaseModels';
import * as CONNECTOR from '../model/ConnectorModels';
import AssemblyLinePreviewI from './AssemblyLinePreviewI';
import AssemblyLineModelI from './AssemblyLineModelI';

import WallSpliter from './WallSpliter';
import WavyWallSpliter from './WavyWallSpliter';
import AdvancedWallSpliter from './AdvancedWallSpliter';
import ScrewAssembly from './ScrewAssembly';

export default class ConnectorsZone implements CaseTreeNode {

    private connectorZones: ComponentZone[];
    private connectorComps: ConnectorComp[];
    private spliter: CaseTreeNode;
    private parent: ComponentZone;

    constructor(parentComponent: ComponentZone, connectors: PCBConnectorI[], hTol: number, side: number,
            isTop: boolean, cornerSplitHeight: number, wavySplit: boolean) {

        this.generateConnectorZones(connectors, side);

        this.parent = parentComponent;

        if (wavySplit) {
            this.spliter = new WallSpliter(side == 0 || side == 3, isTop, parentComponent,
                    connectors.filter(conn => !conn.getDontSplit()), hTol, cornerSplitHeight);
        } else {
            this.spliter = new WavyWallSpliter(side == 0 || side == 3, isTop, parentComponent, connectors, hTol);
        }
    }

    private generateConnectorZones(connectors: PCBConnectorI[], side: number) {
        this.connectorZones = [];
        this.connectorComps = [];

        connectors.forEach((conn) => {
            let model = conn.getModel();
            let m = new THREE.Matrix4();
            let dim = new Vector(model.dimX, model.dimY, model.dimZ);
            m.multiply(new THREE.Matrix4().makeTranslation(conn.getPositionX(), conn.getPositionY() + conn.getOutset(), conn.getPositionZ()));
            this.connectorZones.push(new ComponentZone(m, dim));
            let connectorComp = new ConnectorComp(conn.getSide() == 0 || conn.getSide() == 3, conn);
            this.connectorZones[this.connectorZones.length-1].setInnerNode(connectorComp);
            this.connectorComps.push(connectorComp);
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
        //this.connectorZones.forEach((zone) => zone.addToScene(scene));
        this.spliter.addToScene(scene);
    }

    public assembleForPreview(assembly: AssemblyLinePreviewI) {
        this.connectorZones.forEach((zone) => zone.assembleForPreview(assembly));
        this.spliter.assembleForPreview(assembly);
    }

    public assembleSideForPreview(assembly: AssemblyLinePreviewI) {
        this.connectorComps.forEach((zone) => zone.assemblePartForPreview(assembly, Side.SIDE));
        this.spliter.assembleForPreview(assembly);
    }

    public assembleTopForPreview(assembly: AssemblyLinePreviewI) {
        this.connectorComps.forEach((zone) => zone.assemblePartForPreview(assembly, Side.TOP));
    }

    public assemblyModel(assembly: AssemblyLineModelI) {
        this.connectorZones.forEach((zone) => zone.assemblyModel(assembly));
        this.spliter.assemblyModel(assembly);
    }

    public assemblySideModel(assembly: AssemblyLineModelI) {
        this.connectorComps.forEach((zone) => zone.assemblyPartModel(assembly, Side.SIDE));
        this.spliter.assemblyModel(assembly);
    }

    public assembleTopModel(assembly: AssemblyLineModelI) {
        this.connectorComps.forEach((zone) => zone.assemblyPartModel(assembly, Side.TOP));
    }

    public updateWithParentMatrix(m: THREE.Matrix4) {
        this.connectorZones.forEach(zone => zone.updateWithParentMatrix(m));
        this.spliter.updateWithParentMatrix(m);
    }

    public setInnerNode(node: CaseTreeNode) {
        throw new Error("Method not implemented.");
    }

    public toString(): string {
        return "Connector Zone";
    }
}
