import Vec3 from './Vec3.js'
import Color from './Color.js'

export default class Triangle {
  p1: Vec3;
  p2: Vec3;
  p3: Vec3;
  color: Color;

  constructor(p1:Vec3, p2:Vec3, p3:Vec3, color:Color=null) {
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    if (color) {
      this.color = color;
    } else {
      this.color = Color.RandomColor();
    }
  }

  get center() {
    return (this.p1.add(this.p2).add(this.p3)).mul(1/3);
  }

  translate(offset:Vec3) {
    this.p1.iadd(offset);
    this.p2.iadd(offset);
    this.p3.iadd(offset);
  }

  scale(factor:number) {
    this.p1.imul(factor);
    this.p2.imul(factor);
    this.p3.imul(factor);
  }

  toString() {
    return 'Triangle(' + this.p1.toString() + ',\n' +
                         this.p2.toString() + ',\n' +
                         this.p3.toString() + ')\n';
  }
}
