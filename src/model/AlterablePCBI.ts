import { CaseModel } from './CaseModels';
import PCBConnector from './PCBConnector';
import GeneratableComponentInterface from '../generator/GeneratableComponentInterface';

//UMLC interface AlterablePCBI {
export default interface AlterablePCBI extends GeneratableComponentInterface {

    updateConnectors(connectors: PCBConnector[]): void;

    //Used to check if this instance of 'GeneratableComponentInterface' is a 'AlterablePCBI'
    isEditable(): boolean;

    setScrewPositions(screwPos: any): void;

    setDimX(x: number): void;

    setDimY(y: number): void;

    setDimZ(z: number): void;

}
//UMLC}
