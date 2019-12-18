//librairie classes
import * as THREE from './../lib/three';

export default interface AssemblyLinePreviewI {

    assemblyWithLastPositiveShape();

    getFullMeshs();

    addShape(mesh: THREE.Mesh);

    subShape(mesh: THREE.Mesh);

}
