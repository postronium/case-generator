import * as THREE from './../lib/three';

import ConnectorBuilder from './ConnectorBuilder';
import { ConnectorModel } from '../model/ConnectorModels';
import ComponentModel from '../model/ComponentModel';
import Box from '../model/Box';
import Vector from '../utils/Vector';
import * as data from './static/connectors.json';

export default class StaticConnectorBuilder extends ConnectorBuilder  {

    constructor() {
        super();
    }

    public loadConnectors() {
        // Nothing to load
    }

    public getComponents() : ComponentModel[] {
        return (<Array<any>>data["connectors"]).map(StaticConnectorBuilder.parseJson);
    }

    private static parseJson(json: any) : ComponentModel {
        let component = new ComponentModel(json["name"], json["3dModel"]);
        let topBoxes = (<Array<any>>json["topBoxes"]).map((item) => {
            if (item["shape"] == "box") return StaticConnectorBuilder.parseTopBox(item, json["originTo"] == "side");
            else return StaticConnectorBuilder.parseTopCylinder(item, json["originTo"] == "side");
        });
        let bottomBoxes = (<Array<any>>json["bottomBoxes"]).map((item) => {
            if (item["shape"] == "box") return StaticConnectorBuilder.parseTopBox(item, json["originTo"] == "side");
            else return StaticConnectorBuilder.parseCylinder(item, json["originTo"] == "side");
        });
        let sideBoxes = (<Array<any>>json["sideBoxes"]).map((item) => {
            if (item["shape"] == "box") return StaticConnectorBuilder.parseTopBox(item, json["originTo"] == "side");
            else return StaticConnectorBuilder.parseCylinder(item, json["originTo"] == "side");
        });
        let sideBoxesMaleShape = (<Array<any>>json["sideBoxesMaleShape"]).map((item) => {
            if (item["shape"] == "box") return StaticConnectorBuilder.parseTopBox(item, json["originTo"] == "side");
            else return StaticConnectorBuilder.parseCylinder(item, json["originTo"] == "side");
        });
        component.setBoxes(topBoxes, bottomBoxes, sideBoxes, sideBoxesMaleShape);

        let topBoxesHole = (<Array<any>>json["topBoxesHole"]).map((item) => {
            if (item["shape"] == "box") return StaticConnectorBuilder.parseTopBox(item, json["originTo"] == "side");
            else return StaticConnectorBuilder.parseTopCylinder(item, json["originTo"] == "side");
        });
        let bottomBoxesHole = (<Array<any>>json["bottomBoxesHole"]).map((item) => {
            if (item["shape"] == "box") return StaticConnectorBuilder.parseTopBox(item, json["originTo"] == "side");
            else return StaticConnectorBuilder.parseCylinder(item, json["originTo"] == "side");
        });
        let sideBoxesHole = (<Array<any>>json["sideBoxesHole"]).map((item) => {
            if (item["shape"] == "box") return StaticConnectorBuilder.parseTopBox(item, json["originTo"] == "side");
            else return StaticConnectorBuilder.parseCylinder(item, json["originTo"] == "side");
        });
        component.setHoleBoxes(topBoxesHole, bottomBoxesHole, sideBoxesHole);

        return component;
    }

    private static parseCylinder(json: any, isOriginToSide) : Box {
        let connectorBox;
        let offset = StaticConnectorBuilder.getVector(json["offset"]);
        if (isOriginToSide) connectorBox = Box.creatCylinder(json["d"], json["h"], offset);
        return connectorBox;
    }

    private static parseTopCylinder(json: any, isOriginToSide) : Box {
        let connectorBox;
        let offset = StaticConnectorBuilder.getVector(json["offset"]);
        connectorBox = Box.creatTopCylinder(json["d"], json["h"], offset);
        return connectorBox;
    }

    private static parseTopBox(json: any, isOriginToSide) : Box {
        let connectorBox;
        let offset = StaticConnectorBuilder.getVector(json["offset"]);
        let box = json["box"];
        connectorBox = Box.creatBox(box["x"], box["y"], box["z"], offset);
        return connectorBox;
    }

    private static getVector(json: any) {
        return new Vector(json["x"], json["y"], json["z"]);
    }

    public async getConnector(name: string) {
        const filtered = (<Array<any>>data["connectors"]).filter((item) => {item.name == name});
        if (filtered.length < 1) {
            console.error("connector with the name : " + name + " not found!");
        } else {
            return await ConnectorModel.fromJSON(filtered[0]);
        }
    }

    public async getConnectors() {
        return await Promise.all(
            (<Array<any>>data["connectors"]).map(ConnectorModel.fromJSON)
        );
    }

}
