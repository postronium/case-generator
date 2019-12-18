export default class Area1D {

    public min: number;
    public max: number;

    constructor(max?: number) {
        this.min = 0;
        this.max = (max == undefined) ? 0 : max;
    }

    public getWithMargin(margin: number) {
        let area = new Area1D();
        area.min = this.min + margin;
        area.max = this.max - margin;
        return area;
    }

    public copyToWith(area: Area1D, margin: number) {
        area.min = this.min + margin;
        area.max = this.max - margin;
    }
}
