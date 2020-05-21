import { System } from "../ecs/system.mjs";
import { AngularVelocity, Rotation } from "../components/base_components.mjs";
import { entity_db } from "../ecs/entity_database.mjs";

export class RotationSystem extends System {
  constructor() {
    super();
    this.index = entity_db.index(AngularVelocity, Rotation);
  }

  update(deltaTime) {
    this.index.forEach(entity => {
      let dAngleInRadians = entity.getComponent(AngularVelocity).dAngleInRadians;
      let rotation = entity.getComponent(Rotation);
      rotation.angleInRadians += dAngleInRadians * deltaTime;
    });
  }
}
