function mod(a, b) {
  return ((a % b) + b) % b;
}

function lerp(x, smin, smax, dmin = 0, dmax = 1) {
  return ((x - smin) / (smax - smin)) * (dmax - dmin) + dmin;
}

class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  get len2() {
    return this.x * this.x + this.y * this.y;
  }

  get len() {
    return Math.sqrt(this.len2);
  }

  set len(new_len) {
    let frac = new_len / (0.0001 + this.len);
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
}

function noiseVec2(amp) {
  return (new Vec2(Math.random(), Math.random())).sub(new Vec2(0.5, 0.5)).mul(2 * amp);
}

function clamp(x, min, max) {
  if (x < min) return min;
  if (x > max) return max;
  return x;
}

function scale(x, min, max) {
  return (x - min) / (max - min);
}

function to01(x, min, max) {
  return clamp(scale(x, min, max), 0, 1);
}

function encode(x, min, max, s) {
  return to01(x, min, max) / s;
}

function approxEqualAbs(v1, v2, delta = 10) {
  return Math.abs(v1 - v2) < delta;
}
function approxEqualFrac(v1, v2, delta = 0.5) {
  if (v1 == 0) return v2 == 0;
  return Math.abs((v1 - v2) / v1) < delta;
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randRange(min, max) {
  return Math.random() * (max - min) + min;
}

function randElement(array) {
  return array[Math.floor(randRange(0, array.length))];
}

// If a == b ==> 0
// If a << b or a >> b ==> ~1
// If a = b / 2 ==> 1/2
function ratio(a, b) {
  if (a == b) return 1;
  if (a > b) {
    return (a / b);
  } else {
    return (b / a);
  }
}

function sampleWithDistribution(array, probs, x = null) {
  if (x == null) {
    x = Math.random();
  }
  while (x >= probs[0]) {
    x -= probs[0];
    probs.shift();
    array.shift();
  }
  return array[0];
}

function rangesOverlap(min1, max1, min2, max2) {
  return max1 >= min2 & max2 >= min1;
}
