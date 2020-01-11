var canvas = document.getElementById('zlata');
var context = canvas.getContext('2d');

// var max_accel = 50;
// var min_accel = 1;

const CHARS = new Map([
  ['Z', '*****   *   *   *   *****'],
  ['L', '*    *    *    *    *****'],
  ['A', '  *   * * *   *******   *'],
  ['T', '*****  *    *    *    *  '],
  ['Y', '*   * * *   *    *    *  '],
  ['N', '*   ***  ** * **  ***   *'],
  ['I', '  *    *    *    *    *  '],
  ['V', '*   * * *  * *   *    *  ']
]);

// const RAINBOW = [
//   [0x94, 0x00, 0xD3],
//   [0x4b, 0x00, 0x82],
//   [0, 0, 0xff],
//   [0, 0xff, 0],
//   [0xff, 0xff, 0],
//   [0xff, 0x7f, 0],
//   [0xff, 0, 0]];

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

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
    let frac = new_len / this.len;
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
}

class Circle {
  constructor(x = 0, y = 0, r = 1, color = 'red') {
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color;
  }

  draw(context) {
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    context.fill();
  }

  contains(x, y) {
    if (new Vec2(x - this.x, y - this.y).len <= this.r) {
      return true;
    }
    return false;
  }
}

var top_circle = new Circle(CANVAS_WIDTH / 2, 0, 50);
// var bottom_circle = new Circle(CANVAS_WIDTH / 2, CANVAS_HEIGHT, 50);

class Rect {
  constructor(width, height) {
    this.pos = new Vec2();
    this.width = width;
    this.height = height;
  }

  get left() {
    return this.pos.x - this.width / 2;
  }
  get right() {
    return this.pos.x + this.width / 2;
  }
  get top() {
    return this.pos.y - this.height / 2;
  }
  get bottom() {
    return this.pos.y + this.height / 2;
  }
}

const WIDTH = 1;
const HEIGHT = 1;

function toColorString(rgb) {
  return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
}
const COLORS = ['red', 'blue', 'yellow', 'green', 'orange',
  'purple', 'pink', 'white', 'cyan', 'magenta'];

const prototypes = [
  { 'color': 'rgb(255, 150, 150)', 'min_accel': 1, 'max_accel': 50, 'verlet': false, 'max_idle_vel': 500 },
  { 'color': 'rgb(150, 255, 150)', 'min_accel': 1, 'max_accel': 50, 'verlet': false, 'max_idle_vel': 500 },
  { 'color': 'rgb(255, 255, 150)', 'min_accel': 0, 'max_accel': 50, 'verlet': false, 'max_idle_vel': 500 },
  { 'color': 'rgb(150, 150, 255)', 'min_accel': 10, 'max_accel': 30, 'verlet': false, 'max_idle_vel': 50 },
  { 'color': 'rgb(255, 150, 255)', 'min_accel': 2, 'max_accel': 20, 'verlet': false, 'max_idle_vel': 500 },
];

class Particle {
  collide() {
    if (this.box.left < 0) {
      this.vel.x = Math.abs(this.vel.x);
      if (this.prev_pos.x > this.box.pos.x) {
        this.prev_pos.x = this.box.pos.x + (this.box.pos.x - this.prev_pos.x);
      }
    }
    if (this.box.right > canvas.width) {
      this.vel.x = -Math.abs(this.vel.x);
      if (this.prev_pos.x < this.box.pos.x) {
        this.prev_pos.x = this.box.pos.x + (this.box.pos.x - this.prev_pos.x);
      }
    }
    if (this.box.top < 0) {
      this.vel.y = Math.abs(this.vel.y);
      if (this.prev_pos.y > this.box.pos.y) {
        this.prev_pos.y = this.box.pos.y + (this.box.pos.y - this.prev_pos.y);
      }
    }
    if (this.box.bottom > canvas.height) {
      this.vel.y = -Math.abs(this.vel.y);
      if (this.prev_pos.y < this.box.pos.y) {
        this.prev_pos.y = this.box.pos.y + (this.box.pos.y - this.prev_pos.y);
      }
    }
  }

  set attractor(attractor) {
    this._attractor = attractor;
    if (attractor == null) {
      this.vel.len = this.max_idle_vel; // xxx
      let v = this.box.pos.sub(this.prev_pos);
      v.len = this.max_idle_vel;
      this.prev_pos = this.box.pos.sub(v.mul(1 / 60));
    }
    // // this.color = COLORS[Math.floor(COLORS.length * (Math.random() * 100 + attractor.x) / 800)];
  }

  attractToward(point) {
    // var org_len = this.vel.len;
    this.force = point.sub(this.box.pos);
    this.force.len = Math.max(Math.min(this.force.len, this.max_accel), this.min_accel);
    // accel.len = Math.min(accel.len, max_accel);
    // accel.len = max_accel / (accel.len2 + 1);

    // this.vel = this.vel.add(accel);
    // // this.vel.len = Math.min(this.vel.len, max_vel);
    // this.vel.len = Math.min(org_len, accel.len * 20); // xxx
    // // this.vel.len = Math.min(100, accel.len * 20); // xxx
    // // this.vel.len = org_len; // xxx
    // // this.vel.len = 100;

    // let v = this.box.pos.sub(this.prev_pos).mul(60);
    // org_len = v.len;
    // v = v.add(accel);
    // v.len = Math.min(org_len, accel.len * 20); // xxx
    // // v.len = Math.min(v.len, max_vel / 60);
    // // v.len = org_len; // xxx
    // // v.len = 100;
    // this.prev_pos = this.box.pos.sub(v.mul(1 / 60));
  }

  constructor() {
    this.box = new Rect(WIDTH, HEIGHT);
    this.box.pos.x = Math.random() * canvas.width;
    this.box.pos.y = Math.random() * canvas.height;
    this.vel = new Vec2(Math.random() - 0.5, Math.random() - 0.5);
    this.vel.len = 100;
    this.force = new Vec2(0, 0);
    this.prev_pos = this.box.pos.sub(this.vel.mul(1 / 60));
    // this.prev_delta_time = 1;
    this._attractor = null;

    let prototype = prototypes[Math.floor(Math.random() * prototypes.length)];
    this.color = prototype['color'];
    this.min_accel = prototype['min_accel'];
    this.max_accel = prototype['max_accel'];
    this.use_verlet = prototype['verlet'];
    this.max_idle_vel = prototype['max_idle_vel'];

    // if (Math.random() < 0.5) {
    //   this.color = 'rgb(255, 100, 100)';
    //   this.use_verlet = true;
    // } else {
    //   this.color = 'rgb(100,100,255)';
    //   this.use_verlet = false;
    // }
    // this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    // this.color = toColorString([255,
    //                             255,
    //                             Math.floor(Math.random() * 128 + 128)]);
  }

  draw(context) {
    let px = Math.floor(this.prev_pos.x);
    let py = Math.floor(this.prev_pos.y);
    let x = Math.floor(this.box.pos.x);
    let y = Math.floor(this.box.pos.y);
    if (px == x && y == py) {
      context.fillStyle = this.color;
      context.fillRect(x, y, 2, 2);
    } else {
      context.strokeStyle = this.color;
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(px, py);
      context.lineTo(x, y);
      context.stroke();
    }
  }

  update(delta_time) {
    this.prev_pos = this.box.pos;
    if (!this.use_verlet) {
      this.vel = this.vel.mul(0.95).add(this.force);
      // this.vel = this.force;
      this.box.pos = this.box.pos.add(this.vel.mul(delta_time));
    } else {
      let new_prev_pos = this.box.pos;
      let v = this.box.pos.sub(this.prev_pos).mul(60).mul(0.95).add(this.force);
      this.box.pos = this.box.pos.add(v.mul(1 / 60));
      // this.box.pos = this.box.pos.add(v);
      this.prev_pos = new_prev_pos;
      // this.prev_delta_time = delta_time;
    }
    if (this._attractor) {
      this.attractToward(this._attractor);
    }
    this.collide();
  }
}

var particles = [];
function initParticles(num_particles) {
  for (var i = 0; i < num_particles; i++) {
    particles[i] = new Particle();
  }
}

function draw() {
  context.fillStyle = 'rgba(0, 0, 0, 0.1)';
  context.fillRect(0, 0, canvas.width, canvas.height);

  top_circle.draw(context);
  // bottom_circle.draw(context);

  particles.forEach(particle => {
    particle.draw(context);
  });
}

function update(delta_time) {
  particles.forEach(particle => {
    particle.update(delta_time);
  });
}

function resetAttractors() {
  particles.forEach(particle => {
    particle.attractor = null;
  });
}

function createAttractors() {
  const strs = ['ZLATA', 'YANIV', 'ZLATANIV'];
  var str = strs[Math.floor(Math.random() * strs.length)];
  particles.forEach(particle => {
    var letter_idx = Math.floor(Math.random() * str.length);
    var row = Math.floor(Math.random() * 5);
    var col = Math.floor(Math.random() * 5);
    while (CHARS.get(str[letter_idx])[col * 5 + row] == ' ') {
      row = Math.floor(Math.random() * 5);
      col = Math.floor(Math.random() * 5);
    }
    var letter_center_x = (letter_idx + 1) * canvas.width /
      (str.length + 2);
    var letter_center_y = canvas.height / 2;
    particle.attractor = new Vec2(letter_center_x + row * 15 + Math.random() * 15,
      letter_center_y + col * 15 + Math.random() * 15);
  });
}

function Zlata() {
  initParticles(5000);
  let lasttime;

  function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    let e = event;
    if (event.type == 'touchstart' || event.type == 'touchmove') {
      e = event.touches[0];
    }
    const x = canvas.getAttribute('width') * (e.clientX - rect.left) / rect.width;
    const y = canvas.getAttribute('height') * (e.clientY - rect.top) / rect.height;
    return new Vec2(x, y);
  }

  var mouse_is_down = false;
  function onMouseDown(event) {
    let pos = getCursorPosition(canvas, event);
    mouse_is_down = true;
    if (top_circle.contains(pos.x, pos.y)) {
      createAttractors();
      // } else if (bottom_circle.contains(pos.x, pos.y)) {
      //   resetAttractors();
    } else {
      particles.forEach(particle => {
        particle.attractor = pos;
      });
    }
    event.preventDefault();
  }

  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('touchstart', onMouseDown);

  function onMouseMove(event) {
    if (mouse_is_down) {
      let pos = getCursorPosition(canvas, event);
      if (top_circle.contains(pos.x, pos.y)) {
      } else {
        particles.forEach(particle => {
          particle.attractor = pos;
        });
      }
    }
    event.preventDefault();
  }

  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('touchmove', onMouseMove);

  function onMouseUp(event) {
    mouse_is_down = false;
    particles.forEach(particle => {
      particle.attractor = null;
    });
    event.preventDefault();
  }

  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('touchend', onMouseUp);

  document.addEventListener('keydown', function (event) {
    if (event.code == 'Space') {
      createAttractors();
    }
    if (event.code == 'Enter') {
      resetAttractors();
    }
  });

  window.addEventListener('keydown', function (e) {
    if (e.keyCode == 32 && e.target == document.body) {
      e.preventDefault();
    }
  });

  function callback(millis) {
    if (lasttime) {
      update((millis - lasttime) / 1000);
      draw();
    }
    lasttime = millis;
    requestAnimationFrame(callback);
  }
  callback();
}

context.fillStyle = 'rgb(0,0,0)';
context.fillRect(0, 0, canvas.width, canvas.height);

Zlata();
