import { System } from "./system.mjs";

export class CartesianProductEntityProcessorSystem extends System {
  constructor(componentTypes1, componentTypes2) {
    super();
    this.componentTypes1 = componentTypes1;
    this.componentTypes2 = componentTypes2;
    this.index1 = entity_db.index(...componentTypes1);
    this.index2 = entity_db.index(...componentTypes2);
  }

  update(deltaTime) {
    for (let i = 0; i < this.index1.length; ++i) {
      let entity1 = this.index1.at(i);
      for (let j = 0; j < this.index2.length; ++j) {
        let entity2 = this.index2.at(j);
        let args = [deltaTime, entity1, entity2];
        this.componentTypes1.forEach(componentType => {
          args.push(entity1.getComponent(componentType));
        });
        this.componentTypes2.forEach(componentType => {
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
