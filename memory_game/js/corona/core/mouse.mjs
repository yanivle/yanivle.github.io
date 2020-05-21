import { Vec2 } from "./vec2.mjs";
import { canvas } from "./canvas.mjs";

export class Mouse {
  constructor() {
    this.pos = new Vec2();
    this.down = false;
    this.pressed = false;
    this.cursorImage = null;
    this.registerMouseEvents();
  }

  setCursorImage(image) {
    canvas.style.cursor = 'none';
    this.cursorImage = image;
  }
  setStandardCursor(cursor) {
    canvas.style.cursor = cursor;
    this.cursorImage = null;
  }

  draw(context) {
    if (!this.cursorImage) return;
    context.drawImage(this.cursorImage, this.pos.x, this.pos.y);
  }

  postUpdate() {
    this.pressed = false;
  }

  registerMouseEvents() {
    let onMouseDown = (event) => {
      event.preventDefault();
      this.pos = Mouse.getCursorPosition(canvas, event);
      this.down = true;
      this.pressed = true;
    };
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('touchstart', onMouseDown);

    let onMouseMove = (event) => {
      event.preventDefault();
      this.pos = Mouse.getCursorPosition(canvas, event);
    };
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('touchmove', onMouseMove);

    function onMouseUp(event) {
      event.preventDefault();
      this.down = false;
    }
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('touchend', onMouseUp);
  }

  static getCursorPosition(canvas, event) {
    if (event.type == 'touchstart' || event.type == 'touchmove') {
      event = event.touches[0];
    }

    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let scaleY = canvas.height / rect.height;

    return new Vec2(
      (event.clientX - rect.left) * scaleX,
      (event.clientY - rect.top) * scaleY);
  }
};
