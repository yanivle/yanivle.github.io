import { EntityProcessorSystem } from "../ecs/entity_processor_system.mjs";
import { game_engine } from "../core/game_engine.mjs";
import { Entity } from "../ecs/entity.mjs";

export class ScheduledEvent {
  constructor(callback, timestamp) {
    this.callback = callback;
    this.timestamp = timestamp;
  }
}

export class SchedulingSystem extends EntityProcessorSystem {
  constructor() {
    super(ScheduledEvent);
  }

  processEntity(deltaTime, entity, scheduledEvent) {
    if (game_engine.now >= scheduledEvent.timestamp) {
      scheduledEvent.callback(deltaTime);
      entity.scheduleDestruction();
    }
  }

  scheduleIn(callback, timeout) {
    new Entity().addComponent(new ScheduledEvent(callback, game_engine.now + timeout));
  }
}
