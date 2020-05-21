export var canvas = null;
export var context = null;

export function createCanvas(width, height) {
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    context = canvas.getContext('2d');
    document.body.appendChild(canvas);
    resizeHandler = new ResizeHandler();
  }
}

export class ResizeHandler {
  constructor() {
    this.resized = false;
    this.registerObserver();
  }

  postUpdate() {
    this.resized = false;
  }

  registerObserver(verbose = false) {
    const resizeObserver = new ResizeObserver(() => {
      const rect = canvas.getBoundingClientRect();
      if (verbose) console.log('Resizing canvas: ', rect.width, rect.height);
      canvas.width = rect.width;
      canvas.height = rect.height;
      canvas.setAttribute('width', rect.width);
      canvas.setAttribute('height', rect.height);
      this.resized = true;
    });
    resizeObserver.observe(canvas);
  }
}

export let resizeHandler = null;
