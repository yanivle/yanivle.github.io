export class Keyboard {
  constructor() {
    this.keysDown = {};
    this.keysPressed = {};
    this.registerKeyboardEvents();
  }

  postUpdate() {
    this.keysPressed = {};
  }

  registerKeyboardEvents() {
    let onKeyDown = (event) => {
      event.preventDefault();
      this.keysDown[event.keyCode] = true;
      this.keysPressed[event.keyCode] = true;
    };
    window.addEventListener('keydown', onKeyDown);

    let onKeyUp = (event) => {
      event.preventDefault();
      delete this.keysDown[event.keyCode];
    }
    window.addEventListener('keyup', onKeyUp);
  };
}
