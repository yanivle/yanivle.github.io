import { System } from "../ecs/system.mjs";
import * as base_components from "../components/base_components.mjs";
import { context } from "../core/canvas.mjs";
import { entity_db } from "../ecs/entity_database.mjs";

export class SpriteRenderer extends System {
  constructor() {
    super();
    // this.debug = new Debug();
    this.index = entity_db.index(base_components.Position, base_components.Box, base_components.Sprite, base_components.Layer);
  }

  update() {
    // Instead of always sorting, use a dirty bit.
    // let entities = this.index.copyEntities();
    let entities = this.index.entitiesUnsafe();
    entities.sort((e1, e2) => {
      let layer1 = e1.getComponent(base_components.Layer).layer;
      let layer2 = e2.getComponent(base_components.Layer).layer;
      return layer2 - layer1;  // sort in descending order.
    });
    entities.forEach(entity => {
      let pos = entity.getComponent(base_components.Position);
      let box = entity.getComponent(base_components.Box);
      let sprite = entity.getComponent(base_components.Sprite);
      let rotation = entity.getComponent(base_components.Rotation);
      context.globalAlpha = sprite.opacity;
      let dx = 0;
      let dy = 0;
      if (sprite.centered) {
        dx = -box.width / 2;
        dy = -box.height / 2;
      }
      if (!rotation || rotation.angleInRadians == 0) {
        context.drawImage(sprite.image, pos.x + dx, pos.y + dx, box.width, box.height);
      } else {
        context.save();
        context.translate(pos.x + box.width / 2 + dx, pos.y + box.height / 2 + dy);
        context.rotate(rotation.angleInRadians);
        context.drawImage(sprite.image, -box.width / 2, -box.height / 2, box.width, box.height);
        context.restore();
      }
    });
    // this.debug.log("Total " + entities.length + ' sprites ');
  }

  static addComponents(entity, image, { x = 0, y = 0, layer = 5, width = null, height = null, opacity = 1, centered = true }) {
    width = width ?? image.width;
    height = height ?? image.height;
    return entity
      .addComponent(new base_components.Position(x, y))
      .addComponent(new base_components.Sprite(image, opacity, centered))
      .addComponent(new base_components.Box(width, height))
      .addComponent(new base_components.Layer(layer));
  }
}
