export default class Color {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    static RandomColor() {
        return new Color(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
    }
    multiply(mul, min_mul = 50 / 255, transparent = false) {
        if (mul < min_mul) {
            mul = min_mul;
        }
        let r = (this.r * mul) | 0;
        let g = (this.g * mul) | 0;
        let b = (this.b * mul) | 0;
        if (r > 255)
            r = 255;
        if (g > 255)
            g = 255;
        if (b > 255)
            b = 255;
        if (!transparent) {
            return '#' + ('0' + r.toString(16)).substr(-2) +
                ('0' + g.toString(16)).substr(-2) +
                ('0' + b.toString(16)).substr(-2);
        }
        else {
            return 'rgba(' + r.toString() +
                ',' + g.toString() +
                ',' + b.toString() +
                ',0.9)';
        }
    }
    toString() {
        return '#' + ('0' + this.r.toString(16)).substr(-2) +
            ('0' + this.g.toString(16)).substr(-2) +
            ('0' + this.b.toString(16)).substr(-2);
    }
}
;
export const WHITE = new Color(255, 255, 255);
export const RED = new Color(255, 0, 0);
export const BLUE = new Color(0, 0, 255);
export const BLACK = new Color(0, 0, 0);
