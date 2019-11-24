var canvas = document.getElementById('zlata');
var context = canvas.getContext('2d');

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

class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  get len() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  set len(new_len) {
    let frac = new_len / this.len;
    this.x *= frac;
    this.y *= frac;
  }
}

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


class Particle {
  collide() {
    if (this.box.left < 0) {
      this.vel.x = Math.abs(this.vel.x);
    }
    if (this.box.right > canvas.width) {
      this.vel.x = -Math.abs(this.vel.x);
    }
    if (this.box.top < 0) {
      this.vel.y = Math.abs(this.vel.y);
    }
    if (this.box.bottom > canvas.height) {
      this.vel.y = -Math.abs(this.vel.y);
    }
  }

  set attractor(attractor) {
    this._attractor = attractor;
    this.vel.len = 500; // xxx
    // this.color = COLORS[Math.floor(COLORS.length * (Math.random() * 100 + attractor.x) / 800)];
  }

  attractToward(point) {
    var org_len = this.vel.len;
    var accel = new Vec2(point.x - this.box.pos.x,
                         point.y - this.box.pos.y);
    this.vel.x += accel.x;
    this.vel.y += accel.y;
    this.vel.len = org_len;
    this.vel.len = Math.min(org_len, accel.len * 20); // xxx
  }

    constructor() {
      this.box = new Rect(WIDTH, HEIGHT);
      this.box.pos.x = Math.random() * canvas.width;
      this.box.pos.y = Math.random() * canvas.height;
      this.vel = new Vec2(Math.random() - 0.5, Math.random() - 0.5);
      this.vel.len = 100;
      // this.vel.len = 300;xxx
      this._attractor = null;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      // this.color = toColorString([255,
      //                             255,
      //                             Math.floor(Math.random() * 128 + 128)]);
    }

    draw(context) {
      context.fillStyle = this.color;
      context.fillRect(this.box.left, this.box.top,
        this.box.width, this.box.height);
    }

    update(delta_time) {
      this.box.pos.x += this.vel.x * delta_time;
      this.box.pos.y += this.vel.y * delta_time;
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
  const strs = ['ZLATA','YANIV','ZLATANIV'];
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
    particle.attractor = new Vec2(letter_center_x + row * 15 + Math.random()*15,
                                  letter_center_y + col * 15 + Math.random()*15);
  });
}

function Zlata() {
  initParticles(5000);
  let lasttime;

  function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return new Vec2(x, y);
  }

  var mouse_is_down = false;
  function onMouseDown(event) {
    mouse_is_down = true;
    particles.forEach(particle => {
      particle.attractor = getCursorPosition(canvas, event);
    });
  }

  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('touchstart', onMouseDown);

  function onMouseMove(event) {
    if (mouse_is_down) {
        particles.forEach(particle => {
          particle.attractor = getCursorPosition(canvas, event);
        });
    }
  }

  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('touchmove', onMouseMove);

  function onMouseUp(event) {
    mouse_is_down = false;
    particles.forEach(particle => {
      particle.attractor = null;
    });
  }

  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('touchend', onMouseUp);

  document.addEventListener('keydown', function(event) {
    if (event.code == 'Space') {
      createAttractors();
    }
    if (event.code == 'Enter') {
      resetAttractors();
    }
  });

  window.addEventListener('keydown', function(e) {
    if(e.keyCode == 32 && e.target == document.body) {
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
