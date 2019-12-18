import Shape from '../utils/Shape';
import PCBModel from '../model/PCBModel';
import PCBModelCluster from '../model/PCBModelCluster';
import GeneratableComponentInterface from './GeneratableComponentInterface';
import { CaseModel } from '../model/CaseModels';

export default abstract class CaseOption {

    public static CASE_OPTIONS: CaseOption[] = [];

    private caseModel: CaseModel;
    private pcbModelCluster: GeneratableComponentInterface;

    public isActivated;

    constructor(caseModel?: CaseModel, pcbModelCluster?: PCBModelCluster) {
        this.setPCBAndCaseModel(caseModel, pcbModelCluster);
        this.isActivated = false;
    }

    public getPcbModelCluster() {
        return this.pcbModelCluster;
    }

    public getCaseModel() {
        return this.caseModel;
    }

    public setPCBAndCaseModel(caseModel?: CaseModel, pcbModelCluster?: GeneratableComponentInterface) {
        this.caseModel = (caseModel !== undefined) ? caseModel : this.caseModel;
        this.pcbModelCluster = (pcbModelCluster !== undefined) ? pcbModelCluster : this.pcbModelCluster;
    }

    protected areModelsSet() {
        return this.caseModel != undefined && this.pcbModelCluster != undefined;
    }

    public abstract rebuild(caseModel?: CaseModel, pcbModelCluster?: PCBModelCluster, part?: string);

    public abstract getOptionName();

    public abstract getBaseplateOption(shape: Shape);

    public abstract getTopplateOption(shape: Shape);

    public abstract getWallOption(shape: Shape, side: number);

    public abstract getSettingUI(update: Function);
}
