class Particle extends Sprite {
  constructor(url, pos, vel) {
    super(loadImage(url), pos);
    this.vel = vel;
  }
}

class ParticleSystem {
  constructor(particle_urls, num_particles, pos, g = new Vec2(0, 1000), speed = 1000) {
    this.particles = new Array(num_particles);
    for (let i = 0; i < num_particles; ++i) {
      this.particles[i] = new Particle(randElement(particle_urls), pos, noiseVec2(speed));
    }
    this.g = g;
  }

  update(delta_time) {
    this.particles.forEach(particle => {
      particle.pos = particle.pos.add(particle.vel.mul(delta_time));
      particle.vel = particle.vel.add(this.g.mul(delta_time));
    });
  }

  draw() {
    this.particles.forEach(particle => particle.draw());
  }
}
