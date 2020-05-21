export class System {
  constructor() {
    this.active = true;
  }

  activate() {
    this.active = true;
  }

  deactivate() {
    this.active = false;
  }

  init() {
  }

  // // Called every frame - to be overridden by subclass.
  // update(deltaTime) {
  //   console.warn('Default System.update function not overridden by:', this);
  // }
}
