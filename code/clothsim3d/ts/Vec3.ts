import Vec2 from './Vec2';

export default class Vec3 {
  x: number;
  y: number;
  z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  toVec2() {
    return <Vec2><any>this;
  }

  icopy(other:Vec3) {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
  }

  copy() {
    return new Vec3(this.x, this.y, this.z);
  }

  izero() {
    this.x = this.y = this.z = 0;
    return this;
  }

  get len() {
    return Math.sqrt(this.len2);
  }

  get len2() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  set len(new_len) {
    let frac = new_len / this.len;
    this.imul(frac);
  }

  imul(a) {
    this.x *= a;
    this.y *= a;
    this.z *= a;
    return this;
  }

  mul(a) {
    return new Vec3(this.x * a, this.y * a, this.z * a);
  }

  idiv(a) {
    let b = 1 / a;
    this.imul(b);
    return this;
  }

  div(a) {
    let b = 1 / a;
    return this.mul(b);
  }

  iadd(other) {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
    return this;
  }

  add(other) {
    return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  isub(other) {
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
    return this;
  }

  sub(other) {
    return new Vec3(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  inegate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }

  negate() {
    return new Vec3(-this.x, -this.y, -this.z);
  }

  dot(other:Vec3) {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  cross(other:Vec3) {
    return new Vec3(this.y * other.z - this.z * other.y,
                    this.z * other.x - this.x * other.z,
                    this.x * other.y - this.y * other.x);
  }

  compare(other) {
    if (this.x < other.x) {
      return -1;
    } else if (this.x > other.x) {
      return 1;
    }
    if (this.y < other.y) {
      return -1;
    } else if (this.y > other.y) {
      return 1;
    }
    if (this.z < other.z) {
      return -1;
    } else if (this.z > other.z) {
      return 1;
    }
    return 0;
  }

  normalize() {
    this.idiv(this.len);
  }

  mid_point(other) {
    return this.add(other).mul(0.5);
  }

  toString() {
    return '(' + this.x + ',' + this.y + ',' + this.z + ')';
  }
}
