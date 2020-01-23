import Vec3 from './Vec3.js'
import Particle from './Particle.js'
import FixedForce from './FixedForce.js'
import Rect from './Rect.js'
import Cloth from './Cloth.js'
import Cloth2 from './Cloth2.js'
import World from './World.js'
import * as rand from './rand.js'
import UIValue from './UIValue.js'
import Mouse from './Mouse.js'
import Spring from './Spring.js'
import Renderer from './Renderer.js'

const canvas = <HTMLCanvasElement> <any> document.getElementById('canvas');
const context = <CanvasRenderingContext2D> <any> canvas.getContext('2d');
const mouse = new Mouse(canvas);

const world = new World();
const renderer = new Renderer();
const cloth = new Cloth('top', new Vec3(100, 100, 0), 25, 15, 'red', mouse, 'y');

// document.addEventListener('keydown', e => {
//   old = !old;
//   console.log(old);
// }, false);
//
function init_old() {
  cloth.init(25, 15, 'y');
}

function init_new() {
  const cloth = new Cloth2();
  cloth.init(new Vec3(100, 100, 0), 25, 15, 'y');
  mouse.reset();
  world.init(cloth, mouse);
}

let old = true;

function draw_old() {
  context.fillStyle = 'rgb(0,0,0)';
  context.fillRect(0, 0, canvas.width, canvas.height);
  cloth.draw(context);
}

function draw_new() {
  context.fillStyle = 'rgb(0,0,0)';
  context.fillRect(0, 0, canvas.width, canvas.height);

  world.sphere.draw(context);
  let w = canvas.width;
  let h = canvas.height;
  renderer.light_source.x = w / 2 + Math.cos(world.elapsed_time / 5) * 200;
  renderer.light_source.y = h / 2 + Math.sin(world.elapsed_time / 5) * 200;

  // this.triangles.sort((t1, t2) => {
  //   let max_z1 = Math.max(t1.p1.pos.z, t1.p2.pos.z, t1.p3.pos.z);
  //   let max_z2 = Math.max(t2.p1.pos.z, t2.p2.pos.z, t2.p3.pos.z);
  //   if(max_z1 < max_z2) return -1;
  //   if(max_z1 > max_z2) return 1;
  //   return 0;
  // });

  // Draw springs
  world.cloth.springs.forEach(spring => {
    spring.draw(context, '#888', 1);
  });


  world.cloth.triangles.forEach(triangle => {
    renderer.draw(triangle, context);
  });

  // Draw light source
  context.fillStyle = 'red';
  context.fillRect(renderer.light_source.x - 1,
                   renderer.light_source.y - 1,
                   10, 10);

  // Draw joints
  // world.cloth.joints.forEach(joint => {
  //   joint.draw(context, 'blue');
  // });
}

function init() {
  if (old) {
    init_old();
  } else {
    init_new();
  }
}

function draw() {
  if (old) {
    draw_old();
  } else {
    draw_new();
  }
}

function simulate(delta_time) {
  if (old) {
    cloth.simulate(delta_time);
  } else {
    world.simulate(delta_time);
  }
}

let updateCounter = 0;
let updateInterval = 1 / 180;
// let prev_times = [];
// for (let i = 0; i < 100; i++) {
//   prev_times.push(0);
// }
let prev_times_pos = 0;
const MAX_SIMULATIONS_PER_FRAME = 30;
function update(delta_time) {
  const speed = UIValue('speed', 10, 1, 200, 1);
  delta_time *= speed;
  updateCounter += delta_time;
  let simulations = 0;
  while (updateCounter >= updateInterval) {
    if (simulations == MAX_SIMULATIONS_PER_FRAME) {
      // console.log('Too much time to simulate, skipping:', updateCounter);
      updateCounter = 0;
      break;
    }
    simulations++;
    simulate(updateInterval);
    updateCounter -= updateInterval;
  }
  // prev_times[prev_times_pos] = delta_time;
  // prev_times_pos++;
  // if (prev_times_pos == prev_times.length) {
  //   prev_times_pos = 0;
  // }
  // console.log(prev_times.reduce((x,y) => x + y, 0) / prev_times.length);
}

function Main() {
  init();
  (<any>window).init = init;

  let lasttime;
  function callback(millis) {
    if (lasttime) {
      let delta_time = (millis - lasttime) / 1000;
      update(delta_time);
      draw();
    }
    lasttime = millis;
    requestAnimationFrame(callback);
  }
  callback(0);
}

Main();
