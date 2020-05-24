import { EntityProcessorSystem } from "../ecs/entity_processor_system.mjs";
import { Position, PhysicsBody, Attractor } from "../components/base_components.mjs";

export class AttractorSystem extends EntityProcessorSystem {
  constructor() {
    super(Position, PhysicsBody, Attractor);
  }

  processEntity(_dt, _entity, pos, phys, attractor) {
    let dx = attractor.targetX - pos.x;
    let dy = attractor.targetY - pos.y;
    phys.vx += dx * attractor.velocityAmp;
    phys.vy += dy * attractor.velocityAmp;
    phys.ax += dx * attractor.accelerationAmp;
    phys.ay += dy * attractor.accelerationAmp;
    phys.vx *= (1 - attractor.velocityDamp);
    phys.vy *= (1 - attractor.velocityDamp);
    phys.ax *= (1 - attractor.accelerationDamp);
    phys.ay *= (1 - attractor.accelerationDamp);
  }
}
