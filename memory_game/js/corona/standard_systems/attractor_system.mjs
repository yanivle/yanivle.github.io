import { System } from "../ecs/system.mjs";
import { Position, PhysicsBody, Attractor } from "../components/base_components.mjs";
import { entity_db } from "../ecs/entity_database.mjs";

export class AttractorSystem extends System {
  constructor() {
    super();
    this.index = entity_db.index(Position, PhysicsBody, Attractor);
  }

  update() {
    this.index.forEach(entity => {
      let pos = entity.getComponent(Position);
      let phys = entity.getComponent(PhysicsBody);
      let attractor = entity.getComponent(Attractor);
      let dx = attractor.targetX - pos.x;
      let dy = attractor.targetY - pos.y;
      phys.vx += dx * attractor.velocityAmp;
      phys.vy += dy * attractor.velocityAmp;
      phys.ax += dx * attractor.accelerationAmp;
      phys.ay += dy * attractor.accelerationAmp;
    });
  }
}
