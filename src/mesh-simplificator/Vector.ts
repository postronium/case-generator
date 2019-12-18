export default class Vector {

     public x: number;
     public y: number;
     public z: number;

     constructor(x: number, y: number, z: number) {
         this.x = x;
         this.y = y;
         this.z = z;
     }

     public getPositive() {
         return new Vector(
             this.x < 0 ? -this.x : this.x,
             this.y < 0 ? -this.y : this.y,
             this.z < 0 ? -this.z : this.z
         );
     }

     public static diff(a: Vector, b: Vector) {
         return new Vector(
             a.x - b.x,
             a.y - b.y,
             a.z - b.z
         );
     }

     public static crossProduct(a: Vector, b: Vector) {
         return new Vector(
             a.y*b.z - a.z*b.y,
             a.z*b.x - a.x*b.z,
             a.x*b.y - a.y*b.x
         );
     }

     public sub(v: Vector) {
         return new Vector(
             this.x - v.x,
             this.y - v.y,
             this.z - v.z
         );
     }

     public add(v: Vector) {
         return new Vector(
             this.x + v.x,
             this.y + v.y,
             this.z + v.z
         );
     }

     public scale(s: Vector) {
         return new Vector(
             this.x*s.x,
             this.y*s.y,
             this.z*s.z
         );
     }

     public getNorm() : number {
         return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
     }

     public normaliseVector() {
         let mag = Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
         return new Vector(
             this.x/mag,
             this.y/mag,
             this.z/mag
         );
     }

}
