import { TagComponent } from '../ecs/component.mjs';

export class Position {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  clone() {
    return new Position(this.x, this.y);
  }
}

export class Anchor {
  constructor(positionComponent, dx, dy) {
    this.positionComponent = positionComponent;
    this.dx = dx;
    this.dy = dy;
  }
}

export class PhysicsBody {
  constructor(vx = 0, vy = 0, ax = 0, ay = 0, friction = 0, damp = 0) {
    this.vx = vx;
    this.vy = vy;
    this.ax = ax;
    this.ay = ay;
    this.friction = friction;
    this.damp = damp;
  }

  clone() {
    return new PhysicsBody(this.vx, this.vy, this.ax, this.ay, this.friction);
  }
}

export class Attractor {
  constructor(targetX, targetY, velocityAmp, accelerationAmp, velocityDamp = 0, accelerationDamp = 0) {
    this.targetX = targetX;
    this.targetY = targetY;
    this.velocityAmp = velocityAmp;
    this.accelerationAmp = accelerationAmp;
    this.velocityDamp = velocityDamp;
    this.accelerationDamp = accelerationDamp;
  }

  clone() {
    return new Attractor(this.targetX, this.targetY, this.velocityAmp, this.accelerationAmp, this.velocityDamp, this.accelerationDamp);
  }
}

export class Rotation {
  constructor(angleInRadians) {
    this.angleInRadians = angleInRadians;
  }

  clone() {
    return new Rotation(this.angleInRadians);
  }
}

export class AngularVelocity {
  constructor(dAngleInRadians) {
    this.dAngleInRadians = dAngleInRadians;
  }

  clone() {
    return new AngularVelocity(this.dAngleInRadians);
  }
}

export class Box {
  constructor(width = 0, height = 0, centered = true) {
    this.width = width;
    this.height = height;
    this.centered = centered;
  }

  clone() {
    return new Box(this.width, this.height, this.centered);
  }

  left(pos) { return pos.x + (this.centered ? -this.width / 2 : 0); }
  right(pos) { return this.left(pos) + this.width; }
  top(pos) { return pos.y + (this.centered ? -this.height / 2 : 0); }
  bottom(pos) { return this.top(pos) + this.height; }

  contains(pos, x, y) {
    return x > this.left(pos) && x < this.right(pos) && y > this.top(pos) && y < this.bottom(pos);
  }
}

export class Resizing {
  constructor(dWidthPerSecond, dHeightPerSecond, endTimestamp) {
    this.dWidthPerSecond = dWidthPerSecond;
    this.dHeightPerSecond = dHeightPerSecond;
    this.endTimestamp = endTimestamp;
  }
}

export class BoxCollider {
  constructor(affectPhysics = true) {
    this.affectPhysics = affectPhysics;
  }

  clone() {
    return new BoxCollider(this.affectPhysics);
  }
}

export class BoxColliderMovable extends TagComponent {
}

export class Alpha {
  constructor(opacity = 1) {
    this.opacity = opacity;
  }

  clone() {
    return new Alpha(this.opacity);
  }
}

export class Sprite {
  constructor(image) {
    this.image = image;
  }

  clone() {
    return new Sprite(this.image);
  }
}

export class RenderedText {
  constructor(text, font, stroke, fill, centered) {
    this.text = text;
    this.font = font;
    this.stroke = stroke;
    this.fill = fill;
    this.centered = centered;
  }

  clone() {
    return new RenderedText(this.text, this.font, this.stroke, this.fill, this.centered);
  }
}

// Larger is farther.
export class Layer {
  constructor(layer = 3) {
    this.layer = layer;
  }

  clone() {
    return new Layer(this.layer);
  }
}

export class Expiration {
  constructor(timestamp) {
    this.timestamp = timestamp;
  }

  clone() {
    return new Expiration(this.timestamp);
  }
}

export class RenderedPath {
  constructor(width, color) {
    this.width = width;
    this.color = color;
    this.points = [];
  }

  clone() {
    return new RenderedPath(this.width, this.color);
  }
}

export class Trail {
  constructor(numParts = 10, springStrength = 0.2, updateDist = 0) {
    this.numParts = numParts;
    this.springStrength = springStrength;
    this.updateDist = updateDist;
    this.updateDist2 = updateDist * updateDist;
  }

  clone() {
    return new Trail(this.numParts, this.springStrength, this.updateDist);
  }
}

export class Fade {
  constructor(dOpacity) {
    this.dOpacity = dOpacity;
  }

  clone() {
    return new Fade(this.dOpacity);
  }
}
window.Fade = Fade;

export class RotationWiggle {
  constructor(amplitude, frequency, phase = 0) {
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.phase = phase;
  }

  clone() {
    return new RotationWiggle(this.amplitude, this.frequency, this.phase);
  }
}

export class PositionWiggle {
  constructor(xAmplitude, yAmplitude, xFrequency, yFrequency, xPhase = 0, yPhase = 0) {
    this.xAmplitude = xAmplitude;
    this.yAmplitude = yAmplitude;
    this.xFrequency = xFrequency;
    this.yFrequency = yFrequency;
    this.xPhase = xPhase;
    this.yPhase = yPhase;
    this.deltaX = 0;
    this.deltaY = 0;
  }

  clone() {
    return new PositionWiggle(this.xAmplitude, this.yAmplitude, this.xFrequency, this.yFrequency, this.xPhase, this.yPhase);
  }
}

export class RenderedRect {
  constructor(color) {
    this.color = color;
  }

  clone() {
    return new RenderedRect(this.color);
  }
}
