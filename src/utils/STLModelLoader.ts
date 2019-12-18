//import * as THREE from "../lib/three";
declare var THREE: any;

const path = './src/models/';
const ext = 'stl';
const scaleFactor = 10;

export default class STLModelLoader {

    public static loadModel(fileName: string, callback: Function) {
        let loader = new THREE.STLLoader();
        loader.load(path + fileName + "." + ext, function(geometry) {
        	let mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: 0xffffff, overdraw: 0.5}));
            mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
            callback(mesh);
        } );
    }

    public static async loadModelPromise(fileName: string) {
        return new Promise((resolve, reject) => {
            let loader = new THREE.STLLoader();
            loader.load(path + fileName + "." + ext, function(geometry) {
            	let mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: 0xffffff, overdraw: 0.5}));
                mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
                resolve(mesh);
            });
        });
    }

    public static loadModelGeometry(fileName: string, callback: Function) {
        let loader = new THREE.STLLoader();
        loader.load(path + fileName + "." + ext, function(geometry) {
            callback(geometry);
        } );
    }
}
