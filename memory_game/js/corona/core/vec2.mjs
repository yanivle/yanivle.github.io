import { randRange } from './math.mjs'

export class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  // Len squared.
  get len2() {
    return this.x * this.x + this.y * this.y;
  }

  get len() {
    return Math.sqrt(this.len2);
  }

  set len(new_len) {
    let frac = new_len / (Number.EPSILON + this.len);
    this.x *= frac;
    this.y *= frac;
  }

  add(v) {
    return new Vec2(this.x + v.x, this.y + v.y);
  }

  sub(v) {
    return new Vec2(this.x - v.x, this.y - v.y);
  }

  mul(a) {
    return new Vec2(this.x * a, this.y * a);
  }

  div(a) {
    return new Vec2(this.x / a, this.y / a);
  }

  negate() {
    return new Vec2(-this.x, -this.y);
  }

  floor() {
    return new Vec2(Math.floor(this.x), Math.floor(this.y));
  }

  static randomSquare(amplitude) {
    return new Vec2(randRange(-amplitude, amplitude), randRange(-amplitude, amplitude));
  }

  static randomUnit() {
    let res = new Vec2(Math.random() - 0.5, Math.random() - 0.5);
    res.len = 1;
    return res;
  }
}
