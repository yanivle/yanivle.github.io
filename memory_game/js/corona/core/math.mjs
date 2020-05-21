export function mod(a, b) {
  return ((a % b) + b) % b;
}

export function lerp(x, smin, smax, dmin, dmax) {
  return ((x - smin) / (smax - smin)) * (dmax - dmin) + dmin;
}

export function clamp(x, min, max) {
  if (x < min) return min;
  if (x > max) return max;
  return x;
}

export function linearStep(x, min, max) {
  return clamp(lerp(x, min, max, 0, 1), 0, 1);
}

export function randRange(min, max) {
  return Math.random() * (max - min) + min;
}

export function randChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function sampleWithDistribution(array, probs, x = null) {
  if (x == null) {
    x = Math.random();
  }
  let i = 0;
  while (x >= probs[i]) {
    x -= probs[i];
    i++;
  }
  return array[i];
}

export function rangesOverlap(min1, max1, min2, max2) {
  return max1 >= min2 & max2 >= min1;
}

export function pointInBox(point, topLeft, widthHeight) {
  return point.x >= topLeft.x &&
    point.x <= topLeft.x + widthHeight.width &&
    point.y >= topLeft.y &&
    point.y <= topLeft.y + widthHeight.height;
}

// TODO: move this to box?
export function pointInCenteredBox(point, topLeft, widthHeight) {
  return point.x >= topLeft.x - widthHeight.width / 2 &&
    point.x <= topLeft.x + widthHeight.width / 2 &&
    point.y >= topLeft.y - widthHeight.height / 2 &&
    point.y <= topLeft.y + widthHeight.height / 2;
}
