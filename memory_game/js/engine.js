var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

let mouse = new Mouse();
let keyboard = new Keyboard();

let objects = [];

let layers = [];

let _lastTime = 0;
let absoluteTime = 0;
function main() {
  function animate(millis) {
    absoluteTime = millis / 1000;
    let delta_time = (millis - _lastTime) / 1000;
    _lastTime = millis;

    context.fillStyle = 'rgb(0, 0, 0)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    objects.forEach(object => typeof object.update == 'function' ? object.update(delta_time) : null);
    for (let i = 0; i < layers.length; ++i) {
      layers[i].forEach(object => typeof object.draw == 'function' ? object.draw(context) : null);
    }
    requestAnimationFrame(animate);
  }
  animate(0);
}

function setNumLayers(n) {
  layers = new Array(n);
  for (let i = 0; i < n; ++i) {
    layers[i] = [];
  }
}

function addObject(object, { layer = 2, duration = Infinity } = {}) {
  objects.push(object);
  object._layer = layer;
  layers[layer].push(object);
  if (typeof object.start == 'function') object.start();
  if (duration != Infinity) {
    setTimeout(() => { destroyObject(object) }, duration * 1000);
  }
}

function destroyObject(object) {
  if (typeof object.end == 'function') object.end();
  removeByValueInplace(objects, object);
  removeByValueInplace(layers[object._layer], object);
}

function destroyObjects(objects) {
  objects.forEach(object => destroyObject(object));
}

function destroyAllObjects() {
  destroyObjects(objects);
}

setNumLayers(5);
