import * as THREE from './../lib/three';

//class that is responsible for finding small walls that will apear
//    after a boolean difference operation between a positive(add) Shape
//    and a negative(sub) Shape (the hole that will be made in the + shape)
//This class is simple with feve dependencies therefore this is a util class
export class ThinWallDetector {

    constructor() {

    }

    //projection of min and max on one of the 3 axis x, y, z (axis: 0, 1, 2)
    //RETURN an array of two number [min, max]
    public projection(bbox: THREE.Box3, axis: number) {
        return [bbox.min.getComponent(axis), bbox.max.getComponent(axis)];
    }

    //RETURN true if the boxes interset in the given axis
    //    they not necesserely intersect in 3d if the coordinates of the given
    //    axis intersects
    public intersectInAxis(aMinMax: Array<number>, bMinMax: Array<number>) {
        const min = 0, max = 1;
        return !(aMinMax[min] > bMinMax[max] || aMinMax[max] < bMinMax[min]);
    }

    //RETURN the smallest wall thicknes after the boolean operation in one axis
    public getSmallestWallForAxis(posMinMax: Array<number>, negMinMax: Array<number>) {
        const min = 0, max = 1;

        let widthA = posMinMax[max] - negMinMax[max];
        let widthB = negMinMax[min] - posMinMax[min];


        if (widthA*widthB >= 0) {
            //case where the positive shape is fulle inside the nagative
            //not relevant for this test, ignored (return +Infinit)
            if (widthA <= 0 && widthB <= 0) return Number.POSITIVE_INFINITY;

            //case where the negative shape is full inside the positive
            //return the smalles value
            if (widthA > 0 && widthB > 0) {
                return widthA < widthB ? widthA : widthB;
            }
        } else {
            //default case where the negative shape only pass throu one side of the
            //    positive shape (une positive and one negative)
            return widthA > 0 ? widthA : widthB;
        }

        //TODO find better solution
        return Number.POSITIVE_INFINITY;
    }

    //NOT TESTED
    public getSmallestWall(posBox: THREE.Box3, negBox: THREE.Box3) {
        let xPMinMax = this.projection(posBox, 0);
        let yPMinMax = this.projection(posBox, 1);
        let zPMinMax = this.projection(posBox, 2);

        let xNMinMax = this.projection(negBox, 0);
        let yNMinMax = this.projection(negBox, 1);
        let zNMinMax = this.projection(negBox, 2);

        let xAxis = this.getSmallestWallForAxis(xPMinMax, xNMinMax);
        let yAxis = this.getSmallestWallForAxis(yPMinMax, yNMinMax);
        let zAxis = this.getSmallestWallForAxis(zPMinMax, zNMinMax);

        //find the smallest of the 3 values
        let wallThickness = xAxis < yAxis ? xAxis : yAxis;
        wallThickness = wallThickness < zAxis ? wallThickness : zAxis;
/*
        console.log("Smalles in X : " + xAxis);
        console.log("Smalles in Y : " + yAxis);
        console.log("Samlles in Z : " + zAxis);
*/
        return wallThickness;
    }
}
