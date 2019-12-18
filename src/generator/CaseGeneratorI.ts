import * as CASE from '../model/CaseModels';
import GeneratableComponentInterface from '../generator/GeneratableComponentInterface';
import GeneratableCaseOptionI from '../case-options/GeneratableCaseOptionI';


export default interface CaseGeneratorI {

    rebuild(caseM?: CASE.CaseModel, pcbModel?: GeneratableComponentInterface, options?: GeneratableCaseOptionI[], part?: string);

    addToScene(scene, onError?: Function);

    getFullMesh();

    getBaseMesh();

    getTopMesh();
}
