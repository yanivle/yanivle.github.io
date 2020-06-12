import { Rotation } from "../components/base_components.mjs";
import { EntityProcessorSystem } from "../ecs/entity_processor_system.mjs";
import { PhysicsBody } from "../components/base_components.mjs";

export class AutoOrientation {
}

export class AutoOrientationSystem extends EntityProcessorSystem {
  constructor() {
    super(AutoOrientation, PhysicsBody, Rotation);
  }

  static autoOrient(entity) {
    entity.addComponent(new AutoOrientation());
  }

  processEntity(_1, _2, _3, phys, rotation) {
    rotation.angleInRadians = Math.atan2(phys.vy, phys.vx);
  }
}
