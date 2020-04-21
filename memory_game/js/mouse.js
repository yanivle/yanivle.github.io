const Directions = {
  N: 'N',
  NW: 'NW',
  W: 'W',
  SW: 'SW',
  S: 'S',
  SE: 'SE',
  E: 'E',
  NE: 'NE',
}

class Mouse {
  constructor() {
    this.pos = new Vec2();
    this.down = false;
    this.clickHandlers = [];
    this.moveCb = null;
    this.borderCb = null;
    this.cursorImage = null;
    this.ax = 0;
    this.ay = 0;
    this.bx = 0;
    this.by = 0;
    this.registerMouseEvents();
    this.registerResizeHandler();
  }

  setCursorToImage(image) {
    // canvas.style.cursor = 'grab';
    canvas.style.cursor = 'none';
    this.cursorImage = image;
  }
  setStandardCursor(cursor) {
    canvas.style.cursor = cursor;
    this.cursorImage = null;
  }
  setClickHandler(clickHandler) {
    this.clickHandlers = [clickHandler];
  }
  addClickHandler(clickHandler) {
    this.clickHandlers.push(clickHandler);
  }
  removeClickHandler(clickHandler) {
    removeByValueInplace(this.clickHandlers, clickHandler);
  }
  setMoveHandler(moveCb) {
    this.moveCb = moveCb;
  }
  setBorderHandler(borderCb) {
    this.borderCb = borderCb;
  }

  draw(context) {
    if (!this.cursorImage) return;
    // context.globalAlpha = 0.5;
    context.drawImage(this.cursorImage, this.pos.x, this.pos.y);
    // camera.drawImageScreenPosCentered(context, this.cursorImage, mouse.pos);
    // context.globalAlpha = 1;
  }

  onTop() { return this.pos.y < 1; }
  onBottom() { return this.pos.y > canvas.height - 1; }
  onLeft() { return this.pos.x < 1; }
  onRight() { return this.pos.x > canvas.width - 1; }

  registerMouseEvents() {
    // console.log('Registering mouse events...');
    let self = this;
    function onMouseDown(event) {
      event.preventDefault();
      self.pos = self.getCursorPosition(canvas, event);
      self.down = true;
      self.clickHandlers.forEach(handler => handler.click());
    }

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('touchstart', onMouseDown);

    function onMouseMove(event) {
      event.preventDefault();
      self.pos = self.getCursorPosition(canvas, event);
      if (self.moveCb) {
        self.moveCb();
      }
      if (self.borderCb) {
        if (self.onTop()) {
          if (self.onLeft()) self.borderCb(Directions.NW);
          else if (self.onRight()) self.borderCb(Directions.NE);
          else self.borderCb(Directions.N);
        } else if (self.onBottom()) {
          if (self.onLeft()) self.borderCb(Directions.SW);
          else if (self.onRight()) self.borderCb(Directions.SE);
          else self.borderCb(Directions.S);
        } else if (self.onLeft()) {
          self.borderCb(Directions.W);
        } else if (self.onRight()) {
          self.borderCb(Directions.E);
        } else {
          self.borderCb(null);
        }
      }
      // self.debug.log('Mouse pos:', self.pos.x, self.pos.y);
    }

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('touchmove', onMouseMove);

    function onMouseUp(event) {
      self.down = false;
      event.preventDefault();
    }

    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('touchend', onMouseUp);
  }

  // TODO: instead of doing this, actually resize the canvas (and update the camera).
  registerResizeHandler() {
    let self = this;
    const resizeObserver = new ResizeObserver(() => {
      const rect = canvas.getBoundingClientRect();
      const screenWidthCanvasHeight = rect.width * canvas.height;
      const canvasWidthScreenHeight = canvas.width * rect.height;
      let xMargin = 0;
      let yMargin = 0;
      if (screenWidthCanvasHeight > canvasWidthScreenHeight) {  // This means screenW/screenH > canvasW/canvasH
        xMargin = (rect.width - canvasWidthScreenHeight / canvas.height) / 2;
      } else {
        yMargin = (rect.height - screenWidthCanvasHeight / canvas.width) / 2;
      }
      console.log('Mouse margins:', xMargin, yMargin);
      // mouse.debug.log('Margins', xMargin, yMargin);
      // mouse.debug.log('Bounding client rect', rect.left, rect.top, rect.width, rect.height);
      self.ax = canvas.width / (rect.width - xMargin * 2);
      self.ay = canvas.height / (rect.height - yMargin * 2);
      self.bx = - canvas.width * (rect.left + xMargin) / (rect.width - xMargin * 2);
      self.by = - canvas.height * (rect.top + yMargin) / (rect.height - yMargin * 2)
      console.log('Canvas resized:', self.ax, self.bx, self.ay, self.by);
    });
    resizeObserver.observe(canvas);
  }

  getCursorPosition(canvas, event) {
    let e = event;
    if (event.type == 'touchstart' || event.type == 'touchmove') {
      e = event.touches[0];
    }
    const x = clamp(this.ax * e.clientX + this.bx, 0, canvas.width);
    const y = clamp(this.ay * e.clientY + this.by, 0, canvas.height);
    return new Vec2(x, y);
  }

  // static getCursorPositionOld(canvas, event) {
  //   const rect = canvas.getBoundingClientRect();
  //   const screenWidthCanvasHeight = rect.width * canvas.height;
  //   const canvasWidthScreenHeight = canvas.width * rect.height;
  //   let xMargin = 0;
  //   let yMargin = 0;
  //   if (screenWidthCanvasHeight > canvasWidthScreenHeight) {  // This means screenW/screenH > canvasW/canvasH
  //     xMargin = (rect.width - canvasWidthScreenHeight / canvas.height) / 2;
  //   } else {
  //     yMargin = (rect.height - screenWidthCanvasHeight / canvas.width) / 2;
  //   }
  //   // mouse.debug.log('Margins', xMargin, yMargin);
  //   // mouse.debug.log('Bounding client rect', rect.left, rect.top, rect.width, rect.height);
  //   let e = event;
  //   if (event.type == 'touchstart' || event.type == 'touchmove') {
  //     e = event.touches[0];
  //   }
  //   const x = clamp(canvas.width * (e.clientX - rect.left - xMargin) / (rect.width - xMargin * 2), 0, canvas.width);
  //   const y = clamp(canvas.height * (e.clientY - rect.top - yMargin) / (rect.height - yMargin * 2), 0, canvas.height);
  //   return new Vec2(x, y);
  // }
};
