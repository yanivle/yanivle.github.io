import { System } from "../ecs/system.mjs";
import { RenderedPath } from "../components/base_components.mjs";
import { context } from "../core/canvas.mjs";
import { entity_db } from "../ecs/entity_database.mjs";

export class RenderedPathSystem extends System {
  constructor() {
    super();
    this.index = entity_db.index(RenderedPath);
  }

  update() {
    this.index.forEach(entity => {
      let renderedPath = entity.getComponent(RenderedPath);
      if (renderedPath.points.length > 1) {
        context.beginPath();
        for (let i = 0; i < renderedPath.points.length; ++i) {
          let point = renderedPath.points[i];
          if (i == 0) {
            context.moveTo(point.x, point.y);
          } else {
            context.lineTo(point.x, point.y);
          }
        }
        context.lineWidth = renderedPath.width;
        context.strokeStyle = renderedPath.color;
        context.stroke();
      }
    });
  }
}
