import UIValue from './UIValue.js'
import Particle from './Particle.js'
import {PerspectiveProjection} from './Renderer.js'

export default class Spring {
  e1: Particle;
  e2: Particle;
  resting_len: number;
  active: boolean;

  constructor(e1, e2) {
    this.e1 = e1;
    this.e2 = e2;
    this.resting_len = this.len;
    this.active = true;

    this.e1.springs.push(this);
    this.e2.springs.push(this);
  }

  
  public get len() : number {
    return this.e2.pos.sub(this.e1.pos).len;
  }

  public get tension() : number {
    let len_diff = this.len - this.resting_len;
    if (len_diff < 0) {
      return 0;
    }
    return len_diff * len_diff;
  }

  draw(context, color:string='purple', width=3) {
    if (this.active === false) {
      return;
    }
    context.beginPath();

    // let e1 = PerspectiveProjection(this.e1.pos);
    // let e2 = PerspectiveProjection(this.e2.pos);
    let e1 = this.e1.pos;
    let e2 = this.e2.pos;
    context.moveTo(e1.x,e1.y);
    context.lineTo(e2.x,e2.y);

    // let c = Math.abs(this.e1.pos.z - this.e2.pos.z) * 100;
    let t = this.tension * 10000;
    let r, g, b;
    r = g = b = 150;
    if (t < 0.5) {
      r = t * 255;
    } else if (t < 0.75) {
      r = 255;
      g = (t - 0.5) * 4 * 255;
    } else {
      r = g = 255;
      b = (t - 0.75) * 4 * 255;
    }
    if (r > 255) r = 255;
    if (g > 255) g = 255;
    if (b > 255) b = 255;
    context.strokeStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
    // context.strokeStyle = color;
    context.lineWidth = width;
    context.stroke();
  }

  satisfy() {
    if (this.active === false) {
      return;
    }
    let ent1ToEnt2 = this.e2.pos.sub(this.e1.pos);
    let dist = ent1ToEnt2.len;
    if (dist < this.resting_len) {
      return;
    }
    // if (dist > this.resting_len * UIValue('max_stretch', 10, 1, 100, 0.1)) {
    if (dist > this.resting_len * 10) {
      this.active = false;
      return;
    }
    let mag = (dist - this.resting_len) / dist;
    let correction = ent1ToEnt2.imul(0.5).imul(mag);
    if (this.e1.lock == false) {
      this.e1.pos.iadd(correction);
    }
    if (this.e2.lock == false) {
      this.e2.pos.isub(correction);
    }
  }
}
