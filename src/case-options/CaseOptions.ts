import CaseOptionI from "./CaseOptionI";
import MountingScrewOption from "./options/MountingScrewOption";
import TopFanHoleOption from "./options/TopFanHoleOption";


export default class CaseOptions {

    public caseOptions: CaseOptionI[];
    public isActivated: boolean[];

    public constructor() {
        this.caseOptions = [];

        //this.caseOptions.push(new MountingScrewOption());
        //this.caseOptions.push(new TopFanHoleOption());

        this.isActivated = [];

        for (let i = 0; i < this.caseOptions.length; i++) {
            this.isActivated[i] = true;
        }
    }

    public getActivatedOptions() {
        let activated = [];
        for (let i = 0; i < this.caseOptions.length; i++)
            if (this.isActivated[i]) activated.push(this.caseOptions[i]);
        return activated;
    }

}
