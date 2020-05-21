import { System } from "../corona/ecs/system.mjs";
import { SpriteRenderer } from "../corona/standard_systems/sprite_renderer.mjs";
import { randRange } from "../corona/core/math.mjs";
import { Position, Box } from "../corona/components/base_components.mjs";
import { Rotation } from "../corona/components/base_components.mjs";
import { BoxCollider } from "../corona/components/base_components.mjs";
import { canvas } from "../corona/core/canvas.mjs";
import { randChoice } from "../corona/core/math.mjs";
import { lerp } from "../corona/core/math.mjs";
import { RotationWiggle } from "../corona/components/base_components.mjs";
import { PhysicsBody } from "../corona/components/base_components.mjs";
import { PhysicsSystem } from "../corona/standard_systems/physics_system.mjs";
import { AngularVelocity, Sprite } from "../corona/components/base_components.mjs";
import { Entity } from "../corona/ecs/entity.mjs";
import { game_engine } from "../corona/core/game_engine.mjs";
import { AutoOrientationSystem } from "../corona/standard_systems/auto_orientation_system.mjs";
import { Alpha } from "../corona/components/base_components.mjs";
import { RenderedPath } from "../corona/components/base_components.mjs";
import { Trail } from "../corona/components/base_components.mjs";

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
    entity.addComponent(new Alpha(0));
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
    // .addComponent(new RenderedPath(size / 2, 'rgba(150, 255, 150, 0.2)'))
    // .addComponent(new Trail(5, 0.03, velSize * velSize * velSize));
    AutoOrientationSystem.autoOrient(virus);
    this.viruses.push(virus);
  }

  update(deltaTime) {
    let timeSinceInit = (game_engine.now - this.initTime) / 100;
    let virusProgress = Math.min(1, timeSinceInit);
    this.cloud.getComponent(Alpha).opacity = virusProgress;
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
