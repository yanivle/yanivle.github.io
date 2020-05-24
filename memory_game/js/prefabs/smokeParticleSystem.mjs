import { Prefab } from '../corona/core/prefab.mjs';
import { Entity } from '../corona/ecs/entity.mjs';
import { ParticleSystemsSystem } from '../corona/standard_systems/particle_systems_system.mjs';

const smokeImageUrls = ['smoke1.png', 'smoke2.png', 'smoke3.png'];

export function preloadResources() {
  resource_manager.loadImages(smokeImageUrls)
}

let prefabs = {};

export function getPrefab({ numParticles = 100, vertical = false } = {}) {
  let key = JSON.stringify(arguments);
  if (!(key in prefabs)) {
    let smokeImages = resource_manager.loadImages(smokeImageUrls);

    let initialRotation = vertical ? 3.14 / 2 : null;

    let prefab = new Prefab(ParticleSystemsSystem.addComponents(new Entity('smokeParticleSystemPrefab', false),
      0,
      0,
      ParticleSystemsSystem.createParticlePrefabs(
        smokeImages, { particleLifetime: 1, initialRotation: initialRotation, }),
      {
        particlesPerSecond: Infinity,
        emitterExpirationTime: Infinity,
        maxParticles: numParticles,
        particleMaxVelocity: 1,
        g: -0.01,
      }));
    prefabs[key] = prefab;
  }
  return prefabs[key];
}
