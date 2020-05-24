import { Fade, Alpha } from "../components/base_components.mjs";
import { EntityProcessorSystem } from "../ecs/entity_processor_system.mjs";
import { event_manager } from "../core/EventManager.mjs";

class FadeEvent {
  constructor(entity, fadedOut) {
    this.entity = entity;
    this.fadedOut = fadedOut;
  }
}

export class FadeSystem extends EntityProcessorSystem {
  constructor() {
    super(Fade, Alpha);
    this.eventQueue = event_manager.getEventQueue('fade');
  }

  static fadeOut(entity, time) {
    entity.addComponent(new Alpha(1));
    entity.addComponent(new Fade(-1 / time));
  }

  static fadeIn(entity, time) {
    entity.addComponent(new Alpha(0));
    entity.addComponent(new Fade(1 / time));
  }

  processEntity(deltaTime, entity, fade, alpha) {
    alpha.opacity += fade.dOpacity * deltaTime;
    if (fade.dOpacity < 0 && alpha.opacity <= 0) {
      alpha.opacity = 0;
      entity.scheduleDestruction();
      this.eventQueue.publish(new FadeEvent(entity, true));
    } else if (fade.dOpacity > 0 && alpha.opacity >= 1) {
      alpha.opacity = 1;
      entity.scheduleRemoveComponent(Fade);
      this.eventQueue.publish(new FadeEvent(entity, false));
    }
  }
}
