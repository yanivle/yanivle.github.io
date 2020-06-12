import { Position, Box, BoxCollider, PhysicsBody } from "../components/base_components.mjs";
import { EntityPairProcessorSystem } from "../ecs/EntityPairProcessorSystem.mjs";
import { event_manager } from "../core/EventManager.mjs";
import { CartesianProductEntityProcessorSystem } from "../ecs/CartesianProductEntityProcessorSystem.mjs";
import { BoxColliderMovable } from "../components/base_components.mjs";

class CollisionEvent {
  constructor(entity1, entity2) {
    this.entity1 = entity1;
    this.entity2 = entity2;
  }
}

export class BoxCollisionSystem extends CartesianProductEntityProcessorSystem {
  constructor() {
    super([BoxColliderMovable, Position, Box], [BoxCollider, Position, Box]);
    this.eventQueue = event_manager.getEventQueue('collision');
  }

  static boxesCollide(pos1, box1, pos2, box2) {
    return box1.left(pos1) < box2.right(pos2) &&
      box1.right(pos1) > box2.left(pos2) &&
      box1.top(pos1) < box2.bottom(pos2) &&
      box1.bottom(pos1) > box2.top(pos2);
  }

  processEntityPair(_deltaTime, entity1, entity2, _bcm1, pos1, box1, _bc2, pos2, box2) {
    if (entity1 == entity2) return;
    if (BoxCollisionSystem.boxesCollide(pos1, box1, pos2, box2)) {
      this.eventQueue.publish(new CollisionEvent(entity1, entity2));
      let [leftEntity, rightEntity] = pos1.x < pos2.x ? [entity1, entity2] : [entity2, entity1];
      let [topEntity, bottomEntity] = pos1.y < pos2.y ? [entity1, entity2] : [entity2, entity1];
      let [leftBoxCollider, rightBoxCollider] = [leftEntity.getComponent(BoxCollider), rightEntity.getComponent(BoxCollider)];
      let [topBoxCollider, bottomBoxCollider] = [topEntity.getComponent(BoxCollider), bottomEntity.getComponent(BoxCollider)];
      let [leftPhys, rightPhys] = [leftEntity.getComponent(PhysicsBody), rightEntity.getComponent(PhysicsBody)];
      let [topPhys, bottomPhys] = [topEntity.getComponent(PhysicsBody), bottomEntity.getComponent(PhysicsBody)];
      if (leftEntity == entity1) {
        leftEntity.getComponent(Position).x--;
        if (leftPhys && leftBoxCollider.affectPhysics) leftPhys.vx = -Math.abs(leftPhys.vx);
      }
      if (rightEntity == entity1) {
        rightEntity.getComponent(Position).x++;
        if (rightPhys && rightBoxCollider.affectPhysics) rightPhys.vx = Math.abs(rightPhys.vx);
      }
      if (topEntity == entity1) {
        topEntity.getComponent(Position).y--;
        if (topPhys && topBoxCollider.affectPhysics) topPhys.vy = -Math.abs(topPhys.vy);
      }
      if (bottomEntity == entity1) {
        bottomEntity.getComponent(Position).y++;
        if (bottomPhys && bottomBoxCollider.affectPhysics) bottomPhys.vy = Math.abs(bottomPhys.vy);
      }
    }
  }
}
