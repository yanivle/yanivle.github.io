export default class AirResistance {
    constructor(strength = 1) {
        this.strength = strength;
    }
    apply(entity) {
        let v = entity.vel.copy();
        v.imul(v.len);
        entity.force.iadd(v.negate().mul(this.strength));
    }
}
