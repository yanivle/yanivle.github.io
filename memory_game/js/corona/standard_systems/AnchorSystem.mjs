import { EntityProcessorSystem } from "../ecs/entity_processor_system.mjs";
import { Position, Anchor } from "../components/base_components.mjs";

export class AnchorSystem extends EntityProcessorSystem {
  constructor() {
    super(Position, Anchor);
  }

  processEntity(_dt, _entity, pos, anchor) {
    pos.x = anchor.positionComponent.x + anchor.dx;
    pos.y = anchor.positionComponent.y + anchor.dy;
  }

  static anchorFixed(followingEntity, anchorEntity) {
    followingEntity.addComponent(anchorEntity.getComponent(Position));
  }

  static anchor(followingEntity, anchorEntity, dx, dy) {
    followingEntity.addComponent(new Anchor(anchorEntity.getComponent(Position), dx, dy));
  }
}
