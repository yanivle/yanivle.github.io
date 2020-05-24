import { System } from "./system.mjs";

export class EntityPairProcessorSystem extends System {
  constructor(...componentTypes) {
    super();
    this.componentTypes = componentTypes;
    this.index = entity_db.index(...componentTypes);
  }

  update(deltaTime) {
    for (let i = 0; i < this.index.length; ++i) {
      let entity1 = this.index.at(i);
      for (let j = i + 1; j < this.index.length; ++j) {
        let entity2 = this.index.at(j);
        let args = [deltaTime, entity1, entity2];
        this.componentTypes.forEach(componentType => {
          args.push(entity1.getComponent(componentType));
          args.push(entity2.getComponent(componentType));
        });
        this.processEntityPair(...args);
      }
    }
  }
  // // Called every frame - to be overridden by subclass.
  // processEntity(deltaTime, entity1, entity2, e1_component1, e2_component1, e1_component2, ...) {
  //   console.warn('Default EntityProcessorSystem.processEntity function not overridden by:', this);
  // }
}
