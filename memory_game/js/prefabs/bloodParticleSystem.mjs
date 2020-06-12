import { Prefab } from '../corona/core/prefab.mjs';
import { Entity } from '../corona/ecs/entity.mjs';
import { ParticleSystemsSystem } from '../corona/standard_systems/particle_systems_system.mjs';

const bloodImageUrls = ['blood1.png', 'blood2.png', 'blood3.png'];

export function preloadResources() {
  resource_manager.loadImages(bloodImageUrls)
}

let prefabs = {};

export function getPrefab({ numParticles = 16 } = {}) {
  let key = JSON.stringify(arguments);
  if (!(key in prefabs)) {
    // let bloodImages = resource_manager.loadImages(bloodImageUrls);

    let prefab = new Prefab(ParticleSystemsSystem.addComponents(new Entity('bloodParticleSystemPrefab', false),
      0,
      0,
      ParticleSystemsSystem.createParticlePrefabs(
        {
          colors: ['red'],
          minSize: 16,
          maxSize: 16,
          particleLifetime: 10,
          trailColor: 'rgba(255, 50, 50, 0.5)',
          trailLength: 10,
          trailWidth: 8,
          trailSpringStrength: 0.2,
          trailUpdateDist: 10,
          // rotationsPerSecond: 2
        }),
      {
        particlesPerSecond: Infinity,
        emitterExpirationTime: 1,
        maxParticles: numParticles,
        particleMaxVelocity: 3,
        g: 0.01
      }));
    prefabs[key] = prefab;
  }
  return prefabs[key];
}
