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
import * as bloodParticleSystem from '../prefabs/bloodParticleSystem.mjs';
import { AnchorSystem } from "../corona/standard_systems/AnchorSystem.mjs";
import { ResizingSystem } from "../corona/standard_systems/resizing_system.mjs";
import { FadeSystem } from "../corona/standard_systems/fade_system.mjs";
import { event_manager } from "../corona/core/EventManager.mjs";

export class VirusSystem extends System {
  constructor(virusImages, cloudImage) {
    super();
    this.virusImages = virusImages;
    this.virusesPerSecond = 0;
    this.viruses = [];
    this.cloudImage = cloudImage;
    this.initTime = 0;
  }

  init() {
    // this.createClouds(this.cloudImage);
    // this.initTime = game_engine.now;
    this.bloodParticleSystemPrefab = bloodParticleSystem.getPrefab();
    this.virusesDestroyed = false;
  }

  start() {
    this.createClouds(this.cloudImage);
    this.initTime = game_engine.now;
    event_manager.getEventQueue('eradicated').subscribe(() => {
      this.explodeAllViruses();
    });
  }

  createClouds() {
    let entity = SpriteRenderer.addComponents(new Entity(), this.cloudImage, { layer: 3 });
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
    let ax = 0;
    let ay = 0;
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
    ax = randRange(-velSize / 100, velSize / 100);
    ay = randRange(-velSize / 100, velSize / 100);
    let virus = SpriteRenderer.addComponents(new Entity(), randChoice(this.virusImages), {
      x: x,
      y: y,
      layer: 1,
      width: size,
      height: size,
    });
    virus
      .addComponent(new BoxCollider())
      .addComponent(new PhysicsBody(vx, vy, ax, ay))
      .addComponent(new Rotation(0))
      .addComponent(new RotationWiggle(1 / 20, 20, randRange(0, 6.28)));
    // .addComponent(new RenderedPath(size / 2, 'rgba(150, 255, 150, 0.2)'))
    // .addComponent(new Trail(5, 0.03, velSize * velSize * velSize));
    AutoOrientationSystem.autoOrient(virus);
    this.viruses.push(virus);
  }

  explodeAllViruses() {
    this.virusesDestroyed = true;
    this.viruses.forEach(virus => {
      let bloodPS = this.bloodParticleSystemPrefab.instantiate();
      AnchorSystem.anchorFixed(bloodPS, virus);
      let box = virus.getComponent(Box);
      ResizingSystem.resize(virus, box.width, box.height, box.width * 2, box.height * 2, 0.5);
      FadeSystem.fadeOut(virus, 0.5);
      let phys = virus.getComponent(PhysicsBody);
      phys.friction = 0.8;
    });
  }

  update(deltaTime) {
    if (this.initTime == 0) return;
    let timeSinceInit = (game_engine.now - this.initTime);
    let virusProgress = Math.min(1, timeSinceInit) / 2;
    this.cloud.getComponent(Alpha).opacity = virusProgress;
    this.virusesPerSecond = virusProgress;
    if (!this.virusesDestroyed && Math.random() < this.virusesPerSecond * deltaTime) {
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

    // if (keyboard.keysPressed[32]) {
    //   this.explodeAllViruses();
    // }
  }
}
