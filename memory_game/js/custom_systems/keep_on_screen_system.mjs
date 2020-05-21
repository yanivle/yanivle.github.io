import { Position, Box } from "../corona/components/base_components.mjs";
import { PhysicsBody } from "../corona/components/base_components.mjs";
import { BoardFrameSystem } from "./board_frame_system.mjs";
import { EntityProcessorSystem } from "../corona/ecs/entity_processor_system.mjs";
import { TagComponent } from "../corona/ecs/component.mjs";

export class KeepOnScreen extends TagComponent {
}

export class KeepOnScreenSystem extends EntityProcessorSystem {
  constructor() {
    super(KeepOnScreen, Position, Box, PhysicsBody);
  }

  processEntity(_deltaTime, _entity, _keepOnScreen, pos, box, phys) {
    if (pos.x < BoardFrameSystem.LEFT + box.width / 2) phys.ax = 1;
    else if (pos.x >= BoardFrameSystem.RIGHT - box.width / 2) phys.ax = -1;
    if (pos.y < BoardFrameSystem.TOP + box.height / 2) phys.ay = 1;
    else if (pos.y >= BoardFrameSystem.BOTTOM - box.height / 2) phys.ay = -1;
  }
}
