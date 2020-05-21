import { game_engine } from "../core/game_engine.mjs";
import { EntityProcessorSystem } from "../ecs/entity_processor_system.mjs";
import { Entity } from "../ecs/entity.mjs";
import { mouse } from "../core/game_engine.mjs";

class SceneSwitch {
  constructor(sceneName, onMouseClick, atTimestamp) {
    this.sceneName = sceneName;
    this.onMouseClick = onMouseClick;
    this.atTimestamp = atTimestamp;
  }

  conditionSatisfied() {
    if (this.onMouseClick && mouse.pressed) {
      console.log('SceneSwitch mouse pressed');
      return true;
    }
    if (game_engine.now >= this.atTimestamp) {
      console.log('SceneSwitch reached timestamp');
      return true;
    }
    return false;
  }
}

export class SceneSwitchSystem extends EntityProcessorSystem {
  constructor() {
    super(SceneSwitch);
  }

  static switchToSceneOnCondition(sceneName, onMouseClick, inSeconds = Infinity) {
    new Entity().addComponent(new SceneSwitch(sceneName, onMouseClick, game_engine.now + inSeconds));
  }

  processEntity(_dTime, entity, sceneSwitch) {
    if (sceneSwitch.conditionSatisfied()) {
      game_engine.startScene(sceneSwitch.sceneName);
      entity.scheduleDestruction();
    }
  }
}
