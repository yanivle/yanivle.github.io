import Vec3 from './Vec3.js';
import UIValue from './UIValue.js';
export default class Particle {
    constructor(pos, initial_vel = null) {
        this.pos = pos;
        if (initial_vel) {
            this.prev_pos = pos.sub(initial_vel);
        }
        else {
            this.prev_pos = pos.copy();
        }
        this.lock = false;
        this.force = new Vec3();
        this.springs = [];
    }
    get vel() {
        return this.pos.sub(this.prev_pos);
    }
    dampen(factor = 0.9) {
        this.prev_pos.iadd(this.vel.mul(factor));
    }
    verlet(delta_time) {
        // implement locking in constraint solving instead of here
        if (this.lock) {
            return;
        }
        let t = this.pos.copy();
        let a = this.force.mul(delta_time * delta_time);
        let v = this.vel;
        v.imul(UIValue('damp', 0.999, 0.990, 1, 0.001));
        this.pos.iadd(v.add(a));
        this.prev_pos = t;
    }
    draw(context, color) {
        context.fillStyle = color;
        context.fillRect(this.pos.x - 2, this.pos.y - 2, 5, 5);
    }
}
