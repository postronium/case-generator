import * as THREE from './../lib/three';
const ThreeBSP = require('./../lib/three-js-csg.js')(THREE);

import * as data from '../data/static/BSPMeshes.json';


export default class StaticBSPMeshBuilder  {

    public static getMesh(name: string) {
        const filtered = (<Array<any>>data["meshes"]).filter((item) => {return item.name == name});
        if (filtered.length < 1) {
            console.error("mesh with the name : " + name + " not found!");
        } else {
            return StaticBSPMeshBuilder.generateThreeBSP(filtered[0]);
        }
    }

    private static generateThreeBSP(json: any) {
        let polygons = [];


        for (let i = 0; i < json["faces"].length; i++) {
            let vertices = [];
            for (let j = 0; j < 3; j++) {
                let v = json["vertices"][json["faces"][i][j]-1];
                vertices.push(new ThreeBSP.Vertex(v[0], v[1], v[2]));
            }
            let polygon = new ThreeBSP.Polygon(vertices);
            polygon.calculateProperties();
            polygons.push(polygon);
        }

        let planeNode = new ThreeBSP.Node(polygons);
        return new ThreeBSP(planeNode);
    }

}
