import { PositionWiggle, Position } from "../components/base_components.mjs";
import { game_engine } from "../core/game_engine.mjs";
import { EntityProcessorSystem } from "../ecs/entity_processor_system.mjs";

export class PositionWiggleSystem extends EntityProcessorSystem {
  constructor() {
    super(PositionWiggle, Position);
  }

  processEntity(_dTime, _entity, wiggle, pos) {
    let xUpdate = Math.sin(wiggle.xPhase + game_engine.now * wiggle.xFrequency) * wiggle.xAmplitude;
    pos.x += xUpdate - wiggle.deltaX;
    wiggle.deltaX = xUpdate;

    let yUpdate = Math.sin(wiggle.yPhase + game_engine.now * wiggle.yFrequency) * wiggle.yAmplitude;
    pos.y += yUpdate - wiggle.deltaY;
    wiggle.deltaY = yUpdate;
  }
}
