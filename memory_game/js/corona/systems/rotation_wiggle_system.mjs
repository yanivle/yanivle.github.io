import { RotationWiggle, Rotation } from "../components/base_components.mjs";
import { game_engine } from "../core/game_engine.mjs";
import { EntityProcessorSystem } from "../ecs/entity_processor_system.mjs";

export class RotationWiggleSystem extends EntityProcessorSystem {
  constructor() {
    super(RotationWiggle, Rotation);
  }

  static addComponents(entity, frequency, amplitude, phase) {
    return entity
      .addComponent(new Rotation(0))
      .addComponent(new RotationWiggle(frequency, amplitude, phase));
  }

  processEntity(_dTime, _entity, wiggle, rot) {
    rot.angleInRadians = Math.sin(wiggle.phase + game_engine.now * wiggle.frequency) * wiggle.amplitude;
  }
}
