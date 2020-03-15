class Wiggler {
  constructor(frequency, amplitude, base_value = 0, phase = null) {
    console.log('Starting wiggler with params', arguments);
    this.frequency = frequency;
    this.amplitude = amplitude;
    this.base_value = base_value;
    if (phase == null) phase = Math.random();
    this.phase = phase;
  }

  get value() {
    return this.base_value + Math.sin(this.phase + absoluteTime * this.frequency * (2 * Math.PI)) * this.amplitude;
  }
}

class PropertyWiggler {
  constructor(object, property, frequency, amplitude) {
    this.object = object;
    this.property = property;
    this.wiggler = new Wiggler(frequency, amplitude, object[property]);
  }

  update(delta_time) {
    this.object[this.property] = this.wiggler.value;
  }
}

// class ObjectMover {
//   constructor() {

//   }
// }