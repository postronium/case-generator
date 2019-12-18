import * as THREE from './../lib/three';

import AssemblyLinePreviewI from '../generator/AssemblyLinePreviewI';
import AssemblyLineModelI from '../generator/AssemblyLineModelI';

import { CaseOptionCategory } from './CaseOptionEnums';
import CaseTreeNode from './../generator/CaseTreeNode';
import Vector from '../utils/Vector';
import GeneratableComponentInterface from '../generator/GeneratableComponentInterface';
import { CaseModel } from '../model/CaseModels';

export default interface GeneratableCaseOptionI {

    rebuild(pcbModel: GeneratableComponentInterface, caseModel: CaseModel)

    assembleForPreview(m: THREE.Matrix4, needInversion: boolean, size: Vector, part: number,
        assembly: AssemblyLinePreviewI);

    assemblyModel(m: THREE.Matrix4, needInversion: boolean, size: Vector, part: number,
        assembly: AssemblyLineModelI);

    getCategory(): CaseOptionCategory

}
