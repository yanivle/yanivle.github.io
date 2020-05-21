import { System } from "../ecs/system.mjs";
import { context, canvas } from "../core/canvas.mjs";
import { game_engine } from "../core/game_engine.mjs";

export class ClearScreen extends System {
  constructor(color = 'black') {
    super();
    this.color = color;
  }

  update() {
    let c = Math.floor((Math.sin(game_engine.now) + 1) * (255 / 2));
    context.fillStyle = this.color;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
}
