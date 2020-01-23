import Rect from './Rect.js'
import Vec3 from './Vec3.js'
import UIValue from './UIValue.js'
import Spring from './Spring.js'

export default class Particle {
  pos: Vec3;
  prev_pos: Vec3;
  lock: boolean;
  force: Vec3;
  springs: Spring[];

  constructor(pos:Vec3, initial_vel:Vec3=null) {
    this.pos = pos;
    if (initial_vel) {
      this.prev_pos = pos.sub(initial_vel);
    } else {
      this.prev_pos = pos.copy();
    }
    this.lock = false;
    this.force = new Vec3();
    this.springs = [];
  }

  get vel():Vec3 {
    return this.pos.sub(this.prev_pos);
  }

  dampen(factor:number=0.9):void {
    this.prev_pos.iadd(this.vel.mul(factor));
  }

  verlet(delta_time:number) {
    // implement locking in constraint solving instead of here
    if (this.lock) {
      return;
    }
    let t = this.pos.copy();
    let a = this.force.mul(delta_time*delta_time);
    let v = this.vel;
    v.imul(UIValue('damp', 0.999, 0.990, 1, 0.001));
    this.pos.iadd(v.add(a));
    this.prev_pos = t;
  }

  draw(context, color):void {
    context.fillStyle = color;
    context.fillRect(this.pos.x - 2, this.pos.y - 2, 5, 5);
  }
}
