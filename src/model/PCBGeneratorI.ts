//librairies classes
import * as THREE from './../lib/three';

import PCBModel from '../model/PCBModel';

//util classes
import Shape from '../utils/Shape';

export default interface PCBGeneratorI {

    setPCBModel(pcbModel: PCBModel): any;

    setColor(color: number): any;

    setOffset(offset: {x: number, y: number, z: number}): any;

    getColor(): number;

    rebuild(part?: string): void;

    addToScene(scene: THREE.Scene): void;

    getMesh(): THREE.Mesh;
}
