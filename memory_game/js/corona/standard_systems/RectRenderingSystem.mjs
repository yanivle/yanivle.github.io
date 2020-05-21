import { EntityProcessorSystem } from "../ecs/entity_processor_system.mjs";
import { RenderedRect } from "../components/base_components.mjs";
import { context } from "../core/canvas.mjs";
import { Position } from "../components/base_components.mjs";
import { Box } from "../components/base_components.mjs";
import { Alpha } from "../components/base_components.mjs";

export class RectRenderingSystem extends EntityProcessorSystem {
  constructor() {
    super(Position, Box, RenderedRect);
  }

  // TODO: support rotations
  processEntity(_dTime, entity, pos, box, rect) {
    context.fillStyle = rect.color;
    context.globalAlpha = entity.getComponent(Alpha)?.opacity ?? 1;
    context.fillRect(box.left(pos), box.top(pos), box.width, box.height);
  }
}
