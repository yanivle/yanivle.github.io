import Vec2 from './Vec2.js'

class CollisionResult {
  left: number;
  right: number;
  top: number;
  bottom: number;

  constructor(left, right, top, bottom) {
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
  }

  has_collision() {
    return (this.left || this.right) && (this.top || this.bottom);
  }
}

export default class Rect {
  pos: Vec2;
  width: number;
  height: number;

  constructor(width:number, height:number, pos=new Vec2()) {
    this.pos = pos.copy();
    this.width = width;
    this.height = height;
  }

  get left() {
    return this.pos.x - this.width / 2;
  }
  get right() {
    return this.pos.x + this.width / 2;
  }
  get top() {
    return this.pos.y - this.height / 2;
  }
  get bottom() {
    return this.pos.y + this.height / 2;
  }

  set left(x) {
    this.pos.x = x + this.width / 2;
  }
  set right(x) {
    this.pos.x = x - this.width / 2;
  }
  set top(y) {
    this.pos.y = y + this.height / 2;
  }
  set bottom(y) {
    this.pos.y = y - this.height / 2;
  }

  contains(point) {
    if (this.left < point.x && this.right > point.x &&
        this.top < point.y && this.bottom > point.y) {
          return true;
    }
    return false;
  }

  collide(other) {
    // This doesn't take into account cases where one rect is contained in the
    // other.
    var left = (this.left <= other.right &&
                this.left >= other.left);
    var right = (this.right <= other.right &&
                 this.right >= other.left);
    var top = (this.top <= other.bottom &&
               this.top >= other.top);
    var bottom = (this.bottom <= other.bottom &&
                  this.bottom >= other.top);
    return new CollisionResult(left, right, top, bottom);
  }
}
