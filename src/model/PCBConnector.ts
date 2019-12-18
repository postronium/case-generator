import ComponentModel from './ComponentModel';
import Vector from '../utils/Vector';
import PCBConnectorI from './PCBConnectorI';
import AlterablePCBConnectorI from './AlterablePCBConnectorI';

export default class PCBConnector implements AlterablePCBConnectorI{

    private name: string
    private model: ComponentModel;
    private side: number;     // wich case wall
    //posX: number;     // relatif to wall origin
    //posY: number;
    //posZ: number;     // relatif from top of PCB
    private pos: Vector;    //like X, Y an Z
    private outset: number;
    private hole: boolean;
    private orientation: number;    //angle in degree
    private dontSplit: boolean;

    constructor(name: string, typeName: string, side: number, pos: Vector, outset?: number, hole?: boolean) {
        this.name = name;
        this.model = ComponentModel.getComponentByType(typeName);
        //this.posX = posX;
        //this.posY = posY;
        //this.posZ = (side == 4) ? 0 : posY;         //if top connector posZ is actually posY
        this.pos = pos;
        this.side = side;
        this.outset = outset;
        this.hole = (hole == undefined)? false : hole;
        this.orientation = 0;
        this.dontSplit = false;
    }

    //this function returns a new instance
    public getOffsetConnector(offset: Vector) : PCBConnectorI {
        let offsetConn;
        if (this.side == 4) {
            offsetConn = new PCBConnector(
                this.name, this.model.getName(), this.side,
                this.pos.add(offset),
                this.outset, this.hole
            );
        } else {
            let newPosX = this.pos.add(new Vector(offset.x, 0, offset.z));
            if (this.side%2 == 1)
                newPosX = this.pos.add(new Vector(offset.y, 0, offset.z));
            offsetConn = new PCBConnector(
                this.name, this.model.getName(), this.side,
                newPosX, this.outset, this.hole
            );
        }
        offsetConn.orientation = this.orientation;
        offsetConn.dontSplit = this.dontSplit;

        return offsetConn;
    }


    public toJson(): any {
        var json = {};

        json["name"] = this.name;
        json["typename"] = this.model.getName();
        json["side"] = this.side == undefined ? "4" : this.side;
        json["pos"] = {};
        json["pos"]["x"] = this.pos.x;
        json["pos"]["y"] = this.pos.y;
        json["pos"]["z"] = this.pos.z;
        json["outset"] = this.outset;
        json["en"] = this.hole;

        json["orientation"] = this.orientation;

        return json;
    }

    public static fromJSON(json: any) {
        let conn = new PCBConnector(
            json["name"],
            json["typename"],
            json["side"],
            new Vector(json["pos"]["x"], json["pos"]["y"], json["pos"]["z"]),
            json["outset"],
            json["en"]);

        if (conn.side == undefined) conn.side = 4;

        conn.dontSplit = json["dontSplit"] ? json["dontSplit"] : false;
        conn.orientation = (json["orientation"] == undefined || json["side"] != 4) ? 0 : json["orientation"];
        return conn;
    }

    public getDontSplit() {
        return this.dontSplit;
    }

    public getName() {
        return this.name;
    }

    public getPositionX() {
        return this.pos.x;
    }

    public getPositionY() {
        return this.pos.y;
    }

    public getPositionZ() {
        return this.pos.z;
    }

    public getBoxPosZ() {
        if (this.model.getSideBoxesHole().length == 0) return this.getPositionZ();
            //throw new Error("invalide state : the connector must be a side connector to have a minZ or maxZ");
        else
            return this.model.getSideBoxesHole()[0].getOffset().z + this.getPositionZ();
    }

    public getMinZ() {
        return this.getBoxPosZ() - this.model.dimZ/2;
    }

    public getMaxZ() {
        return this.getBoxPosZ() + this.model.dimZ/2;
    }

    public isSideConnector() {
        return true;    //TODO implement this
    }

    public getSide() {
        return this.side;
    }

    public getOutset() {
        return this.outset;
    }

    public isHoleOpen() {
        return this.hole;
    }

    public getOrientation() {
        return this.orientation;
    }

    public getModel() {
        return this.model;
    }

    public setName(name: string) {
        this.name = name;
    }

    public setPositionX(x: number) {
        this.pos.x = x;
    }

    public setPositionY(y: number) {
        this.pos.y = y;
    }

    public setPositionZ(z: number){
        this.pos.z = z;
    }

    public setSideConnector(isSide: boolean) {
        //TODO implement this
    }

    public setSide(side: number) {
        this.side = side;
    }

    public setOutset(outset: number) {
        this.outset = outset;
    }

    public setIsHoleOpen(isOpen: boolean) {
        this.hole = isOpen;
    }

    public setOrientation(orientation: number) {
        this.orientation = orientation;
    }

    public getSideBoxes() {
        if (this.isHoleOpen()) {
            return this.model.getSideBoxes().concat(this.model.getSideBoxesHole());
        } else {
            return this.model.getSideBoxes();
        }
    }
    public getTopBoxes() {
        if (this.isHoleOpen()) {
            return this.model.getTopBoxes().concat(this.model.getTopBoxesHole());
        } else {
            return this.model.getTopBoxes();
        }
    }
    public getBottomBoxes() {
        if (this.isHoleOpen()) {
            return this.model.getBottomBoxes().concat(this.model.getBottomBoxesHole());
        } else {
            return this.model.getBottomBoxes();
        }
    }
}
