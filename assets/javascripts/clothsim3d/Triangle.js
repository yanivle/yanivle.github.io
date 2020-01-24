import Color from './Color.js';
export default class Triangle {
    constructor(p1, p2, p3, color = null) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        if (color) {
            this.color = color;
        }
        else {
            this.color = Color.RandomColor();
        }
    }
    get center() {
        return (this.p1.add(this.p2).add(this.p3)).mul(1 / 3);
    }
    translate(offset) {
        this.p1.iadd(offset);
        this.p2.iadd(offset);
        this.p3.iadd(offset);
    }
    scale(factor) {
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
