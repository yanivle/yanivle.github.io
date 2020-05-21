import { System } from "../ecs/system.mjs";
import { TextRenderer } from "./text_renderer.mjs";
import { RenderedText } from "../components/base_components.mjs";
import { canvas } from "../core/canvas.mjs";
import { game_engine } from "../core/game_engine.mjs";

export class TimeCounterSystem extends System {
  constructor(font) {
    super();
    this.font = font;
  }

  init() {
    this.startTime = game_engine.now;
    this.textEntity = TextRenderer.createRenderedText('', this.font, canvas.width / 2, 200, 'rgba(0, 255, 0, 0.2)', 'black', true);
    this.textComponent = this.textEntity.getComponent(RenderedText);
  }

  get elapsed() {
    return game_engine.now - this.startTime;
  }

  update() {
    let absoluteTime = Math.floor(this.elapsed * 100);
    let centiSeconds = absoluteTime % 100;
    absoluteTime = Math.floor((absoluteTime - centiSeconds) / 100);
    let seconds = absoluteTime % 60;
    absoluteTime = Math.floor((absoluteTime - seconds) / 60);
    let minutes = absoluteTime;
    this.textComponent.text = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${centiSeconds.toString().padStart(2, '0')}`;
  }
}
