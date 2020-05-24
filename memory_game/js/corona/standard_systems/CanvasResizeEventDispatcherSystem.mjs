import { System } from "../ecs/system.mjs";
import { canvas } from "../core/canvas.mjs";
import { resizeHandler } from "../core/canvas.mjs";
import { event_manager } from "../core/EventManager.mjs";

class CanvasResizeEvent {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
}

export class CanvasResizeEventDispatcherSystem extends System {
  constructor() {
    super();
    this.eventQueue = event_manager.getEventQueue('canvas_resized');
  }

  update() {
    if (resizeHandler.resized) {
      let event = new CanvasResizeEvent(canvas.width, canvas.height);
      console.log('Dispatching resize event', event);
      this.eventQueue.publish(event);
    }
  }
}
