import { Fade, Sprite } from "../components/base_components.mjs";
import { EntityProcessorSystem } from "../ecs/entity_processor_system.mjs";

export class FadeSystem extends EntityProcessorSystem {
  constructor() {
    super(Fade, Sprite);
  }

  static fadeOut(entity, time) {
    entity.addComponent(new Fade(-1 / time));
  }

  static fadeIn(entity, time) {
    entity.getComponent(Sprite).opacity = 0;
    entity.addComponent(new Fade(1 / time));
  }

  processEntity(deltaTime, entity, fade, sprite) {
    sprite.opacity += fade.dOpacity * deltaTime;
    if (fade.dOpacity < 0 && sprite.opacity <= 0) {
      sprite.opacity = 0;
      entity.scheduleDestruction();
    } else if (fade.dOpacity > 0 && sprite.opacity >= 1) {
      sprite.opacity = 1;
      entity.scheduleRemoveComponent(Fade);
    }
  }
}
