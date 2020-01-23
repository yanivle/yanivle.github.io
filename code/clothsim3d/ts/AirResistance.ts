import Particle from './Particle.js'
import Vec2 from './Vec2.js'

export default class AirResistance {
  strength: number;

  constructor(strength=1) {
    this.strength = strength;
  }

  apply(entity) {
    let v = entity.vel.copy();
    v.imul(v.len);
    entity.force.iadd(v.negate().mul(this.strength));
  }
}
