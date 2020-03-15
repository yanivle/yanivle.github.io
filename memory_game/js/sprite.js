class Sprite {
  constructor(image, pos) {
    this.image = image;
    this.pos = pos;
    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    // context.fillStyle = 'white';
    // context.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    context.drawImage(this.image, this.pos.x, this.pos.y, this.width, this.height);
  }

  get left() {
    return this.pos.x;
  }

  set left(x) {
    this.pos.x = x;
  }

  get right() {
    return this.pos.x + this.width;
  }

  get top() {
    return this.pos.y;
  }

  set top(y) {
    this.pos.y = y;
  }

  get bottom() {
    return this.pos.y + this.height;
  }

  get center() {
    return new Vec2(this.pos.x + this.width / 2, this.pos.y + this.height / 2);
  }

  set center(c) {
    this.pos = c.sub(new Vec2(this.width / 2, this.height / 2));
  }

  contains(point) {
    return (point.x >= this.pos.x && point.x < this.pos.x + this.width) && (point.y >= this.pos.y && point.y < this.pos.y + this.height);
  }

  intersects(other) {
    return rangesOverlap(this.left, this.right, other.left, other.right) && rangesOverlap(this.top, this.bottom, other.top, other.bottom);
  }

}

