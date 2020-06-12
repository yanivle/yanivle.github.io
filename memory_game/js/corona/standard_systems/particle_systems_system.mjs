import { Entity } from "../ecs/entity.mjs";
import { EntityProcessorSystem } from "../ecs/entity_processor_system.mjs";
import { Expiration } from "../components/base_components.mjs";
import { Position } from "../components/base_components.mjs";
import { SpriteRenderer } from "./sprite_renderer.mjs";
import { PhysicsSystem } from "./physics_system.mjs";
import { randChoice, randRange } from "../core/math.mjs";
import { ExpirationSystem } from "./expiration_system.mjs";
import { Rotation } from "../components/base_components.mjs";
import { RenderedPath } from "../components/base_components.mjs";
import { Trail } from "../components/base_components.mjs";
import { AngularVelocity } from "../components/base_components.mjs";
import { Prefab } from "../core/prefab.mjs";
import { game_engine } from "../core/game_engine.mjs";
import { FadeSystem } from "./fade_system.mjs";
import { Alpha } from "../components/base_components.mjs";
import { RectRenderingSystem } from "./RectRenderingSystem.mjs";

class Emitter {
  constructor(particlePrefabs, particlesPerSecond, maxParticles, particleMaxVelocity, g, now, maxParticlesPerUpdate) {
    this.particlePrefabs = particlePrefabs;
    this.particlesPerSecond = particlesPerSecond;
    this.maxParticles = maxParticles;
    this.particleMaxVelocity = particleMaxVelocity;
    this.g = g;
    this.lastParticleTimestamp = now;
    this.maxParticlesPerUpdate = maxParticlesPerUpdate;
  }

  clone() {
    return new Emitter(this.particlePrefabs, this.particlesPerSecond, this.maxParticles, this.particleMaxVelocity, this.g, this.lastParticleTimestamp, this.maxParticlesPerUpdate);
  }
}
window.Emitter = Emitter;

class Particle {
  // Safe to return this as this is just a tag.
  clone() {
    return this;
  }
}
window.Particle = Particle;

export class ParticleSystemsSystem extends EntityProcessorSystem {
  constructor() {
    super(Position, Emitter);
  }

  static createParticlePrefabs({ images = null, colors = null, particleLifetime = 0.5, trailColor = null, trailLength = null, trailWidth = 5, trailSpringStrength = 0.2, trailUpdateDist = 0, rotationsPerSecond = null, renderingLayer = 1, initialOpacity = 1, initialRotation = null, minSize = null, maxSize = null }) {
    let prefabs = [];
    console.assert(images || colors);
    console.assert(!(images && colors));
    let items = images ? images : colors;
    items.forEach(item => {
      let templateEntity = null;
      if (images) {
        // TODO: handle size restrictions for images too.
        templateEntity = SpriteRenderer.addComponents(new Entity('particle_system_prefab', false), item, { layer: renderingLayer })
      } else {
        if (!minSize) minSize = 1;
        if (!maxSize) maxSize = 5;
        templateEntity = RectRenderingSystem.addComponents(new Entity('particle_system_prefab', false), 0, 0, randRange(minSize, maxSize), randRange(minSize, maxSize), item);
      }
      templateEntity.addComponent(new Particle());
      if (particleLifetime != null) {
        FadeSystem.fadeOut(templateEntity, particleLifetime);
      }
      if (initialOpacity != 1) {
        templateEntity.addComponent(new Alpha(initialOpacity));
      }
      if (rotationsPerSecond != null) {
        templateEntity.addComponent(new Rotation(randRange(0, 3.14)))
          .addComponent(new AngularVelocity(2 * 3.14 * rotationsPerSecond));
      }
      if (initialRotation != null) {
        templateEntity.addComponent(new Rotation(initialRotation));
      }
      if (trailLength != null || trailColor != null) {
        console.assert(trailColor != null && trailColor != null);
        templateEntity.addComponent(new RenderedPath(trailWidth, trailColor))
          .addComponent(new Trail(trailLength, trailSpringStrength, trailUpdateDist));
      }
      prefabs.push(new Prefab(templateEntity));
    });
    return prefabs;
  }

  static addComponents(entity, x, y, particlePrefabs, { particlesPerSecond = Infinity, emitterExpirationTime = Infinity, maxParticles = 64, particleMaxVelocity = 10, g = 0.1, maxParticlesPerUpdate = 10 }) {
    entity
      .addComponent(new Position(x, y))
      .addComponent(new Emitter(particlePrefabs, particlesPerSecond, maxParticles, particleMaxVelocity, g, game_engine.now, maxParticlesPerUpdate));
    if (emitterExpirationTime != Infinity) {
      entity.addComponent(new Expiration(emitterExpirationTime));
    }
    return entity;
  }

  processEntity(_, entity, pos, emitter) {
    let particlesToSpawn = (game_engine.now - emitter.lastParticleTimestamp) * emitter.particlesPerSecond;
    particlesToSpawn = Math.min(particlesToSpawn, emitter.maxParticlesPerUpdate, emitter.maxParticles);
    while (particlesToSpawn > 1) {
      particlesToSpawn--;
      emitter.maxParticles--;
      emitter.lastParticleTimestamp = game_engine.now;
      let particle = new Entity();
      let particlePrefab = randChoice(emitter.particlePrefabs);
      particlePrefab.updateEntity(particle);
      PhysicsSystem.addComponents(particle, pos.x, pos.y, randRange(-emitter.particleMaxVelocity, emitter.particleMaxVelocity), randRange(-emitter.particleMaxVelocity, emitter.particleMaxVelocity), 0, emitter.g);
      ExpirationSystem.expireIn(particle, emitter.particleLifetime);
    }
    if (emitter.maxParticles == 0) {
      entity.scheduleDestruction();
    }
  }
}
