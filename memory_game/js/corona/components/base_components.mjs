export class Position {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  clone() {
    return new Position(this.x, this.y);
  }
}

export class PhysicsBody {
  constructor(vx = 0, vy = 0, ax = 0, ay = 0, friction = 0) {
    this.vx = vx;
    this.vy = vy;
    this.ax = ax;
    this.ay = ay;
    this.friction = friction;
  }

  clone() {
    return new PhysicsBody(this.vx, this.vy, this.ax, this.ay, this.friction);
  }
}

export class Attractor {
  constructor(targetX, targetY, velocityAmp, accelerationAmp) {
    this.targetX = targetX;
    this.targetY = targetY;
    this.velocityAmp = velocityAmp;
    this.accelerationAmp = accelerationAmp;
  }

  clone() {
    return new Attractor(this.targetX, this.targetY, this.velocityAmp, this.accelerationAmp);
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
  constructor(width = 0, height = 0) {
    this.width = width;
    this.height = height;
  }

  clone() {
    return new Box(this.width, this.height);
  }

  // TODO: move this somewhere else.
  // TODO: need to call the centered/non-centered version depending on the centered property
  left(pos) { return pos.x - this.width / 2; }
  right(pos) { return pos.x + this.width / 2; }
  top(pos) { return pos.y - this.height / 2; }
  bottom(pos) { return pos.y + this.height / 2; }
}

export class Resizing {
  constructor(dWidthPerSecond, dHeightPerSecond, endTimestamp) {
    this.dWidthPerSecond = dWidthPerSecond;
    this.dHeightPerSecond = dHeightPerSecond;
    this.endTimestamp = endTimestamp;
  }
}

export class BoxCollider {
  constructor(fixed = false) {
    this.fixed = fixed;
  }

  clone() {
    return new BoxCollider(this.fixed);
  }
}

export class KeepOnScreen {
  clone() {
    return new KeepOnScreen();
  }
}

export class Sprite {
  constructor(image, opacity = 1, centered = true) {
    this.image = image;
    this.opacity = opacity;
    this.centered = centered;
  }

  clone() {
    return new Sprite(this.image, this.opacity, this.centered);
  }
}
window.Sprite = Sprite;

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
  constructor(length, updateFrequency = 0) {
    this.length = length;
    this.updateFrequency = updateFrequency;
    this.prevUpdateTime = 0;
  }

  clone() {
    return new Trail(this.length, this.updateFrequency);
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
