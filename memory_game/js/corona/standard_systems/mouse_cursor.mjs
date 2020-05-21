import { System } from "../ecs/system.mjs";
import { SpriteRenderer } from "./sprite_renderer.mjs";
import { Position, Trail } from "../components/base_components.mjs";
import { mouse } from "../core/game_engine.mjs";
import { RenderedPath } from "../components/base_components.mjs";
import { Entity } from "../ecs/entity.mjs";
import { ParticleSystemsSystem } from "./particle_systems_system.mjs";
import { anchor } from "../core/anchor.mjs";

export class MouseCursor extends System {
  constructor(cursorImage, trailImages) {
    super();
    this.cursorImage = cursorImage;
    this.trailImages = trailImages;
  }

  init() {
    mouse.setCursorImage(this.cursorImage);
    this.cursor = SpriteRenderer.addComponents(new Entity(), this.cursorImage, { x: mouse.pos.x, y: mouse.pos.y, layer: -1, centered: false });
    this.cursor
      .addComponent(new RenderedPath(10, 'rgba(0, 255, 0, 0.2)'))
      .addComponent(new Trail(10, 0, 0));
    this.cursor.name = 'mouse_cursor';

    let mouseParticleSystem = ParticleSystemsSystem.addComponents(new Entity(),
      0,
      0,
      ParticleSystemsSystem.createParticlePrefabs(
        this.trailImages, { particleLifetime: 1, }),
      {
        particlesPerSecond: 4,
        emitterExpirationTime: Infinity,
        maxParticles: Infinity,
        particleMaxVelocity: 1,
        g: 0
      });
    anchor(mouseParticleSystem, this.cursor);
  }

  update() {
    Object.assign(this.cursor.getComponent(Position), mouse.pos);
  }
}
