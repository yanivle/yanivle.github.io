class Keyboard {
  constructor() {
    this.keysDown = {};
    this.keyDownHandlers = [];
    this.registerKeyboardEvents();
  }

  addKeyDownkHandler(keyDownkHandler) {
    this.keyDownHandlers.push(keyDownkHandler);
  }


  registerKeyboardEvents() {
    // console.log('Registering Keyboard events...');
    let self = this;
    function onKeyDown(event) {
      event.preventDefault();
      self.keysDown[event.keyCode] = true;
      self.keyDownHandlers.forEach(handler => handler.keyDown());
    }
    window.addEventListener('keydown', onKeyDown);

    function onKeyUp(event) {
      event.preventDefault();
      delete self.keysDown[event.keyCode];
    }
    window.addEventListener('keyup', onKeyUp);

  };
}
