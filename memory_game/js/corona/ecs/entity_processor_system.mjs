import { System } from "./system.mjs";

export class EntityProcessorSystem extends System {
  constructor(...componentTypes) {
    super();
    this.componentTypes = componentTypes;
    this.index = entity_db.index(...componentTypes);
  }

  update(deltaTime) {
    this.index.forEach(entity => {
      let args = [deltaTime, entity];
      this.componentTypes.forEach(componentType => {
        args.push(entity.getComponent(componentType));
      });
      this.processEntity(...args);
    });

    // // Called every frame - to be overridden by subclass.
    // processEntity(deltaTime, entity, component1, component2, ...) {
    //   console.warn('Default EntityProcessorSystem.processEntity function not overridden by:', this);
    // }
  }
}
