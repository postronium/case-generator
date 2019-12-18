//librairie classes
import * as THREE from './../lib/three';

import Vector from '../mesh-simplificator/Vector';
import AssemblyLinePreviewI from './AssemblyLinePreviewI';
import AssemblyLineModelI from './AssemblyLineModelI';

export default interface CaseTreeNode {

    getStartPosition(): Vector;

    getEndPositions(): Vector;

    getSize(): Vector;

    addToScene(scene);

    assembleForPreview(assembly: AssemblyLinePreviewI);

    assemblyModel(assembly: AssemblyLineModelI);


    /*
     * Transformations
     */

    updateWithParentMatrix(m: THREE.Matrix4);

    setInnerNode(node: CaseTreeNode)


    /*
     * Debugging
     */

    toString(): string;

}
