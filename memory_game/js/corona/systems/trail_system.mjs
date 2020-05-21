import { System } from "../ecs/system.mjs";
import { Position, Trail, RenderedPath } from "../components/base_components.mjs";
import { entity_db } from "../ecs/entity_database.mjs";
import { game_engine } from "../core/game_engine.mjs";

export class TrailSystem extends System {
  constructor() {
    super();
    this.index = entity_db.index(Position, Trail, RenderedPath);
  }

  update() {
    this.index.forEach(entity => {
      let pos = entity.getComponent(Position);
      let renderedPath = entity.getComponent(RenderedPath);
      let trail = entity.getComponent(Trail);
      if (game_engine.now - trail.prevUpdateTime > trail.updateFrequency) {
        trail.prevUpdateTime = game_engine.now;
        renderedPath.points.unshift(Object.assign({}, pos));
        if (renderedPath.points.length > trail.length) {
          renderedPath.points.length = trail.length;
        }
      }
    });
  }
}
