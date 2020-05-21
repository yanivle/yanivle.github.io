import { System } from "../ecs/system.mjs";
import { Position, RenderedText } from "../components/base_components.mjs";
import { context } from "../core/canvas.mjs";
import { entity_db } from "../ecs/entity_database.mjs";
import { Entity } from "../ecs/entity.mjs";

export class TextRenderer extends System {
  constructor() {
    super();
    this.index = entity_db.index(Position, RenderedText);
  }

  update() {
    this.index.forEach(entity => {
      let pos = entity.getComponent(Position);
      let renderedText = entity.getComponent(RenderedText);
      context.font = renderedText.font;
      context.fillStyle = renderedText.fill;
      context.strokeStyle = renderedText.stroke;
      context.lineWidth = 8; // TODO: make this a parameter.
      let lines = renderedText.text.split('\n');
      for (let i = 0; i < lines.length; ++i) {
        var textMetrics = context.measureText(lines[i]);
        const PADDING = 5;
        let textHeight = PADDING + textMetrics.actualBoundingBoxAscent - textMetrics.actualBoundingBoxDescent;
        let y = pos.y + i * textHeight;
        let x = pos.x;
        if (renderedText.centered) {
          x -= Math.round(textMetrics.width / 2);
          y -= Math.round(textHeight * lines.length / 2);
        }
        if (renderedText.fill) context.fillText(lines[i], x, y);
        if (renderedText.stroke) context.strokeText(lines[i], x, y);
      }
    });
  }

  static createRenderedText(text, font, x, y, stroke, fill, centered) {
    return new Entity()
      .addComponent(new Position(x, y))
      .addComponent(new RenderedText(text, font, stroke, fill, centered));
  }
}
