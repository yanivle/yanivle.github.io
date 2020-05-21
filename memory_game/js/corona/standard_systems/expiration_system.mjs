import { System } from "../ecs/system.mjs";
import * as base_components from "../components/base_components.mjs";
import { entity_db } from "../ecs/entity_database.mjs";
import { game_engine } from "../core/game_engine.mjs";

export class ExpirationSystem extends System {
  constructor() {
    super();
    this.index = entity_db.index(base_components.Expiration);
  }

  update() {
    this.index.forEach(entity => {
      let timestamp = entity.getComponent(base_components.Expiration).timestamp;
      if (game_engine.now >= timestamp) {
        entity.scheduleDestruction();
      }
    });
  }

  static expireIn(entity, seconds) {
    entity.addComponent(new base_components.Expiration(performance.now() / 1000 + seconds));
  }
}
