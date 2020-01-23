import Particle from './Particle.js'

export default interface Constraint {
  constrain(particle:Particle);
}
