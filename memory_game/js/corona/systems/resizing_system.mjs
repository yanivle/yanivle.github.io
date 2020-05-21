import { Resizing } from "../components/base_components.mjs";
import { EntityProcessorSystem } from "../ecs/entity_processor_system.mjs";
import { Box } from "../components/base_components.mjs";
import { game_engine } from "../core/game_engine.mjs";

export class ResizingSystem extends EntityProcessorSystem {
  constructor() {
    super(Box, Resizing);
  }

  static resize(entity, width, height, destWidth, destHeight, time) {
    let dWidthPerSecond = (destWidth - width) / time;
    let dHeightPerSecond = (destHeight - height) / time;
    let resizing = new Resizing(dWidthPerSecond, dHeightPerSecond, game_engine.now + time);
    entity.addComponent(resizing);
  }

  processEntity(deltaTime, entity, box, resizing) {
    let dWidth = resizing.dWidthPerSecond * deltaTime;
    let dHeight = resizing.dHeightPerSecond * deltaTime;
    box.width += dWidth;
    box.height += dHeight;
    if (game_engine.now >= resizing.endTimestamp) {
      entity.scheduleRemoveComponent(Resizing);
    }
  }
}
