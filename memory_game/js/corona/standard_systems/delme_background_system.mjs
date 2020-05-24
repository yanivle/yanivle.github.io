import { System } from "../ecs/system.mjs";
import { canvas } from "../core/canvas.mjs";
import { resizeHandler } from "../core/canvas.mjs";
import { Box } from "../components/base_components.mjs";
import { SpriteRenderer } from "./sprite_renderer.mjs";
import { Entity } from "../ecs/entity.mjs";

export class BackgroundSystem extends System {
  constructor(backgroundImage) {
    super();
    this.backgroundImage = backgroundImage;
  }

  init() {
    this.entity = SpriteRenderer.addComponents(new Entity(), this.backgroundImage, { x: 0, y: 0, width: canvas.width, height: canvas.height, layer: 10, centered: false });
  }

  update() {
    if (resizeHandler.resized) {
      console.log('resized', canvas.width, canvas.height);
      let box = this.entity.getComponent(Box);
      box.width = canvas.width;
      box.height = canvas.height;
    }
  }
}
