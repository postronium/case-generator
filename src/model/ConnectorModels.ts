import * as THREE from './../lib/three';
import STLModelLoader from '../utils/STLModelLoader';

import StaticConnectorBuilder from '../data/StaticConnectorBuilder';

export class ConnectorModel {
    static connectorType: ConnectorModel[] = [];

    static MALE_SHAPE_DEEPNES = 100; // = 1cm

    //UMLL ConnectorModel --o ConnectorModel

    bbox: THREE.Mesh;
    box: THREE.Geometry;
    maleShape: THREE.Mesh;
    maleShapeBox: THREE.Geometry;
    name: string;
    private file3DModel: string;
    connector3DModel: THREE.Mesh;
    topConnector: boolean;
    startX: number;
    startY: number;
    maxWallThickness: number = 10;
    zOffset: number;

    public dimX;       //is always x
    public dimY;
    public dimZ;

    constructor(name: string, file3DModel?: string) {
        this.bbox = undefined;
        this.file3DModel = file3DModel ? file3DModel : undefined;
        this.on3DModelLoaded = this.on3DModelLoaded.bind(this);

        this.name = name;
    }

    public async loadModel() {
        if (this.file3DModel) {
            return STLModelLoader.loadModelPromise(this.file3DModel).then((mesh: any) => {
                this.connector3DModel = mesh;
            }).catch((err) => {
                console.warn("Model not loaded : " + err);
            });
        }
    }

    private on3DModelLoaded(mesh: THREE.Mesh) {
        this.connector3DModel = mesh;
    }

    //create a Box Mesh and put the origin in the corner
    protected creatBox(dimX: number, dimY: number, dimZ: number) {
        let box = new THREE.BoxGeometry(dimX, dimY, dimZ);
        box.translate(dimX/2, 0, 0);
        return new THREE.Mesh(box);
    }

    protected creatCylinder(diam: number, height: number) {
        let r = diam/2;
        let cylinder = new THREE.CylinderGeometry(r, r, height, 32);
        cylinder.rotateZ(Math.PI/2);
        cylinder.translate(height/2, 0, 0);
        return cylinder;
    }

    protected createBoxCenter(dimX: number, dimY: number, dimZ: number) {
        let box = new THREE.BoxGeometry(dimX, dimY, dimZ);
        box.translate(0, 0, dimZ/2);
        return new THREE.Mesh(box);
    }

    public get3DModel() {
        if (!this.connector3DModel) {
            console.warn("3DModel notloaded!");
            return undefined;
        }
        return this.connector3DModel.clone();
    }

    public static async fromJSON(json: any) {
        let conn = new ConnectorModel(json["name"], json["3dModel"]);
        await conn.loadModel();

        if (json.shape === "box") {

            let c = json.center;
            conn.dimX = json.box["x"];
            conn.dimY = json.box["y"];
            conn.dimZ = json.box["z"];

            conn.box = new THREE.BoxGeometry(conn.dimX, conn.dimY, conn.dimZ);
            conn.box.translate(conn.dimX/2, conn.dimY/2, conn.dimZ/2);
            conn.startX = conn.dimX/2;

            conn.startY = 0;


            conn.bbox = new THREE.Mesh(conn.box);

            if (json["maleShape"]) {
                let ms = json["maleShape"];
                let dimZ = conn.dimZ + 2*ms["vertext"];
                let dimY = conn.dimY + 2*ms["horext"];
                let dimX = ConnectorModel.MALE_SHAPE_DEEPNES;
                let msBox = new THREE.BoxGeometry(dimX, dimY, dimZ);

                msBox.translate(dimX/2, dimY/2, dimZ/2 -ms["vertext"]);


                conn.maxWallThickness = json["maleShape"]["outset"];

                conn.maleShape = new THREE.Mesh(msBox);
            }
        } else if (json.shape === "cylinder") {
            conn.dimX = json.d;
            conn.dimY = json.h;
            conn.dimZ = json.d;
            conn.startX = 0;
            conn.startY = 0;
            conn.box = conn.creatCylinder(json.d, json.h);
            conn.box.rotateZ(Math.PI/2);
            conn.bbox = new THREE.Mesh(conn.box);
        } else {
            console.error("Only the value : 'box' and 'cylinder' are supported for the parameter 'shape'.");
        }

        conn.topConnector = json["topConnector"];

        conn.zOffset = json["boxOffset"] ? json["boxOffset"] : 0;
        conn.bbox.translateZ(conn.zOffset);
        conn.box.translate(0, 0, conn.zOffset);

        return conn;
    }

    public static async loadModels() {
        if (ConnectorModel.connectorType.length == 0) {
            let builder = new StaticConnectorBuilder();
            ConnectorModel.connectorType = await <any>builder.getConnectors();
        }
    }

    public static getConnectorType(name: string) {
        for (let i = 0; i < ConnectorModel.connectorType.length; i++) {
            if (ConnectorModel.connectorType[i].name === name)
                return ConnectorModel.connectorType[i];
        }
    }
}

//UMLC}
