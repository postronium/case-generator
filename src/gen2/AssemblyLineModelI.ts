//librairie classes
import * as THREE from './../lib/three';

export default interface AssemblyLineModelI {

    getFinalModel();

    addShape(mesh: THREE.Mesh);

    subShape(mesh: THREE.Mesh);

}
