import { System } from "../ecs/system.mjs";
import { entity_db } from "../ecs/entity_database.mjs";
import { Position, Box, BoxCollider } from "../components/base_components.mjs";

export class BoxCollisionSystem extends System {
  constructor() {
    super();
    this.index = entity_db.index(BoxCollider, Position, Box);
    // this.debug = new Debug();
  }

  // init() {
  //   new Entity()
  //     .addComponent(new BoxCollider(true))
  //     .addComponent(new Position(-1024, -1024))
  //     .addComponent(new Box(canvas.width + 1024 * 2, 1024));
  //   new Entity()
  //     .addComponent(new BoxCollider(true))
  //     .addComponent(new Position(-1024, canvas.height))
  //     .addComponent(new Box(canvas.width + 1024 * 2, 1024));
  //   new Entity()
  //     .addComponent(new BoxCollider(true))
  //     .addComponent(new Position(-1024, -1024))
  //     .addComponent(new Box(1024, canvas.height + 1024 * 2));
  //   new Entity()
  //     .addComponent(new BoxCollider(true))
  //     .addComponent(new Position(canvas.width, -1024))
  //     .addComponent(new Box(1024, canvas.height + 1024 * 2));
  // }

  static boxesCollide(pos1, box1, pos2, box2) {
    return box1.left(pos1) < box2.right(pos2) &&
      box1.right(pos1) > box2.left(pos2) &&
      box1.top(pos1) < box2.bottom(pos2) &&
      box1.bottom(pos1) > box2.top(pos2);
  }

  update() {
    for (let i = 0; i < this.index.length; ++i) {
      let entity1 = this.index.at(i);
      let pos1 = entity1.getComponent(Position);
      let box1 = entity1.getComponent(Box);
      for (let j = i + 1; j < this.index.length; ++j) {
        let entity2 = this.index.at(j);
        let pos2 = entity2.getComponent(Position);
        let box2 = entity2.getComponent(Box);
        let dx = 0;
        let dy = 0;
        if (BoxCollisionSystem.boxesCollide(pos1, box1, pos2, box2)) {
          let [leftEntity, rightEntity] = pos1.x < pos2.x ? [entity1, entity2] : [entity2, entity1];
          let [topEntity, bottomEntity] = pos1.y < pos2.y ? [entity1, entity2] : [entity2, entity1];
          if (!leftEntity.getComponent(BoxCollider).fixed) leftEntity.getComponent(Position).x--;
          if (!rightEntity.getComponent(BoxCollider).fixed) rightEntity.getComponent(Position).x++;
          if (!topEntity.getComponent(BoxCollider).fixed) topEntity.getComponent(Position).y--;
          if (!bottomEntity.getComponent(BoxCollider).fixed) bottomEntity.getComponent(Position).y++;
        }
      }
    }
  }
}
