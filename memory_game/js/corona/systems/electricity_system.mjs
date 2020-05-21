import { System } from "../ecs/system.mjs";
import { RenderedPath } from "../components/base_components.mjs";
import { entity_db } from "../ecs/entity_database.mjs";
import { Position } from "../components/base_components.mjs";
import { randRange } from "../core/math.mjs";

export class Electricity {
  constructor(entity1, entity2, numInteriorPoints = 10, noiseMag = 5, updateFreq = 0.05) {
    this.entity1 = entity1;
    this.entity2 = entity2;
    this.numInteriorPoints = numInteriorPoints;
    this.noiseMag = noiseMag;
    this.updateFreq = updateFreq;
    this.lastUpdated = 0;
  }
}

export class ElectricitySystem extends System {
  constructor() {
    super();
    this.index = entity_db.index(Electricity, RenderedPath);
  }

  static interpolatePointsWithNoise(p1, p2, alpha, noiseMag) {
    return {
      x: Math.round(p1.x * alpha + p2.x * (1 - alpha) + randRange(-noiseMag, noiseMag)),
      y: Math.round(p1.y * alpha + p2.y * (1 - alpha) + randRange(-noiseMag, noiseMag)),
    }
  }

  update() {
    this.index.forEach(entity => {
      let electricity = entity.getComponent(Electricity);
      let now = performance.now();
      if (now - electricity.lastUpdated >= electricity.updateFreq) {
        electricity.lastUpdated = now;
        let path = entity.getComponent(RenderedPath);
        let p1 = electricity.entity1.getComponent(Position);
        let p2 = electricity.entity2.getComponent(Position);
        path.points.length = electricity.numInteriorPoints + 2;
        path.points[0] = p2;
        for (let k = 1; k <= electricity.numInteriorPoints; ++k) {
          path.points[k] = ElectricitySystem.interpolatePointsWithNoise(p1, p2, k / (electricity.numInteriorPoints + 1), electricity.noiseMag);
        }
        path.points[electricity.numInteriorPoints + 1] = p1;
      }
    });
  }
}
