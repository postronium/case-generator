
/**
 * The instances of this class are imutable
 */
export default class Area2D {

    private minX: number;
    private maxX: number;
    private minY: number;
    private maxY: number;

    public getMinX() { return this.minX }

    public getMaxX() { return this.maxX }

    public getMinY() { return this.minY }

    public getMaxY() { return this.maxY }


    constructor(maxX?: number, maxY?: number, minX?: number, minY?: number) {
        this.minX = (minX == undefined) ? 0 : minX;
        this.minY = (minY == undefined) ? 0 : minY;
        this.maxX = (maxX == undefined) ? 0 : maxX;
        this.maxY = (maxY == undefined) ? 0 : maxY;
    }

    public getScale(scaleFactor: number) {
        let area = new Area2D();
        area.minX = this.minX * scaleFactor;
        area.maxX = this.maxX * scaleFactor;
        area.minY = this.minY * scaleFactor;
        area.maxY = this.maxY * scaleFactor;
        return area;
    }

    public changeMin(minX: number, minY: number) {
        const newArea2D = new Area2D();
        newArea2D.minX = minX;
        newArea2D.minY = minY;
        newArea2D.maxX = this.maxX;
        newArea2D.maxY = this.maxY;
        return newArea2D;
    }

    public changeMax(maxX: number, maxY: number) {
        const newArea2D = new Area2D();
        newArea2D.minX = this.minX;
        newArea2D.minY = this.minY;
        newArea2D.maxX = maxX;
        newArea2D.maxY = maxY;
        return newArea2D;
    }

    public getWithMargin(margin: number) {
        let area = new Area2D();
        area.minX = this.minX + margin;
        area.maxX = this.maxX - margin;
        area.minY = this.minY + margin;
        area.maxY = this.maxY - margin;
        return area;
    }

    public isInside(x: number, y: number) {
        return x <= this.maxX && x >= this.minX && y <= this.maxY && y >= this.minY;
    }
}
