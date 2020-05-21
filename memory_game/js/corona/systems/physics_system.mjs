import { System } from "../ecs/system.mjs";
import { Position, PhysicsBody } from "../components/base_components.mjs";
import { entity_db } from "../ecs/entity_database.mjs";

export class PhysicsSystem extends System {
  constructor() {
    super();
    this.index = entity_db.index(Position, PhysicsBody);
  }

  update() {
    this.index.forEach(entity => {
      let pos = entity.getComponent(Position);
      let phys = entity.getComponent(PhysicsBody);
      pos.x += phys.vx;
      pos.y += phys.vy;
      phys.vx += phys.ax;
      phys.vy += phys.ay;
      phys.vx *= (1 - phys.friction);
      phys.vy *= (1 - phys.friction);
      phys.ax *= (1 - phys.friction);
      phys.ay *= (1 - phys.friction);
    });
  }

  static addComponents(entity, x, y, vx, vy, ax, ay) {
    entity
      .addComponent(new Position(x, y))
      .addComponent(new PhysicsBody(vx, vy, ax, ay));
  }
}
