import { EntityProcessorSystem } from "../ecs/entity_processor_system.mjs";
import { Position, Trail, RenderedPath } from "../components/base_components.mjs";
import { game_engine } from "../core/game_engine.mjs";

export class TrailSystem extends EntityProcessorSystem {
  constructor() {
    super(Position, Trail, RenderedPath);
  }

  processEntity(_dTime, _entity, pos, trail, renderedPath) {
    if (renderedPath.points.length < trail.numParts) {
      renderedPath.points.push(Object.assign({}, pos));
    } else {
      let dist2 = (pos.x - renderedPath.points[0].x) ** 2 +
        (pos.y - renderedPath.points[0].y) ** 2;
      if (dist2 < trail.updateDist2) {
        renderedPath.points[0].x = pos.x;
        renderedPath.points[0].y = pos.y;
      } else {
        renderedPath.points.unshift(Object.assign({}, pos));
        if (renderedPath.points.length > trail.numParts) {
          renderedPath.points.length = trail.numParts;
        }
      }
    }
    for (let i = 1; i < renderedPath.points.length; ++i) {
      renderedPath.points[i].x = renderedPath.points[i - 1].x * trail.springStrength
        + renderedPath.points[i].x * (1 - trail.springStrength);
      renderedPath.points[i].y = renderedPath.points[i - 1].y * trail.springStrength
        + renderedPath.points[i].y * (1 - trail.springStrength);
    }
  }
}
