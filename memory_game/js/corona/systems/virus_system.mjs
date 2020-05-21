import { System } from "../ecs/system.mjs";
import { SpriteRenderer } from "./sprite_renderer.mjs";
import { randRange } from "../core/math.mjs";
import { Position, Box } from "../components/base_components.mjs";
import { Rotation } from "../components/base_components.mjs";
import { BoxCollider } from "../components/base_components.mjs";
import { canvas } from "../core/canvas.mjs";
import { randChoice } from "../core/math.mjs";
import { lerp } from "../core/math.mjs";
import { RotationWiggle } from "../components/base_components.mjs";
import { PhysicsBody } from "../components/base_components.mjs";
import { PhysicsSystem } from "./physics_system.mjs";
import { AngularVelocity, Sprite } from "../components/base_components.mjs";
import { Entity } from "../ecs/entity.mjs";
import { game_engine } from "../core/game_engine.mjs";
import { AutoOrientationSystem } from "./auto_orientation_system.mjs";

export class VirusSystem extends System {
  constructor(virusImages, cloudImage) {
    super();
    this.virusImages = virusImages;
    this.virusesPerSecond = 0;
    this.viruses = [];
    this.cloudImage = cloudImage;
  }

  init() {
    this.createClouds(this.cloudImage);
    this.initTime = game_engine.now;
  }

  createClouds(image) {
    let entity = SpriteRenderer.addComponents(new Entity(), image, { layer: 3 });
    PhysicsSystem.addComponents(entity, canvas.width / 2, canvas.height / 2, 0, 0, 0, 0);
    entity
      .addComponent(new Rotation(0))
      .addComponent(new AngularVelocity(2 * 3.14 * 0.01));
    entity.getComponent(Sprite).opacity = 0;
    this.cloud = entity;
  }

  createVirus() {
    let size = Math.round(randRange(128, 256));
    let velSize = lerp(size, 128, 256, 10, 1);
    let x = 0;
    let y = 0;
    let vx = 0;
    let vy = 0;
    if (Math.random() < 0.5) {
      x = randChoice([-100, canvas.width + 100]);
      y = randRange(0, canvas.height);
      vx = x > 0 ? -velSize : velSize;
      vy = randRange(-velSize, velSize);
    } else {
      x = randRange(0, canvas.width);
      y = randChoice([-100, canvas.height + 100]);
      vx = randRange(-velSize, velSize);
      vy = y > 0 ? -velSize : velSize;
    }
    let virus = SpriteRenderer.addComponents(new Entity(), randChoice(this.virusImages), {
      x: x,
      y: y,
      layer: 1,
      width: size,
      height: size,
    });
    virus
      .addComponent(new BoxCollider(true))
      .addComponent(new PhysicsBody(vx, vy))
      .addComponent(new Rotation(0))
      .addComponent(new RotationWiggle(1 / 20, 20, randRange(0, 6.28)));
    AutoOrientationSystem.autoOrient(virus);
    this.viruses.push(virus);
  }

  update(deltaTime) {
    let timeSinceInit = (game_engine.now - this.initTime) / 100;
    let virusProgress = Math.min(1, timeSinceInit);
    this.cloud.getComponent(Sprite).opacity = virusProgress;
    this.virusesPerSecond = virusProgress;
    if (Math.random() < this.virusesPerSecond * deltaTime) {
      this.createVirus();
    }
    this.viruses.forEach(virus => {
      let pos = virus.getComponent(Position);
      let box = virus.getComponent(Box);
      let phys = virus.getComponent(PhysicsBody);

      if (pos.x + box.width / 2 < 0 && phys.vx < 0) virus.destroy();
      else if (pos.x - box.width / 2 > canvas.width && phys.vx > 0) virus.destroy();
      else if (pos.y + box.height / 2 < 0 && phys.vy < 0) virus.destroy();
      else if (pos.y - box.height / 2 > canvas.height && phys.vy > 0) virus.destroy();
    });
  }
}
