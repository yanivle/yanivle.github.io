import { System } from "../corona/ecs/system.mjs";
import { canvas } from "../corona/core/canvas.mjs";
import { resizeHandler } from "../corona/core/canvas.mjs";
import { Box } from "../corona/components/base_components.mjs";
import { SpriteRenderer } from "../corona/standard_systems/sprite_renderer.mjs";
import { Entity } from "../corona/ecs/entity.mjs";
import { SpecialPowersSystem } from "./special_powers_system.mjs";

export class BoardFrameSystem extends System {
  static THICKNESS = 80;
  static LEFT = SpecialPowersSystem.FRAME_SIZE + BoardFrameSystem.THICKNESS;
  static TOP = BoardFrameSystem.THICKNESS;
  static RIGHT = null;
  static BOTTOM = null;
  static WIDTH = null;

  constructor(boardFrameImage) {
    super();
    this.boardFrameImage = boardFrameImage;
  }

  static _updateDimensions() {
    BoardFrameSystem.WIDTH = canvas.width - SpecialPowersSystem.FRAME_SIZE;
    BoardFrameSystem.RIGHT = canvas.width - BoardFrameSystem.THICKNESS;
    BoardFrameSystem.BOTTOM = canvas.height - BoardFrameSystem.THICKNESS;
  }

  init() {
    BoardFrameSystem._updateDimensions();
    this.frame = SpriteRenderer.addComponents(new Entity(), this.boardFrameImage, { x: SpecialPowersSystem.FRAME_SIZE, y: 0, width: BoardFrameSystem.WIDTH, height: canvas.height, layer: 8, centered: false });
  }

  update() {
    if (resizeHandler.resized) {
      console.log('resized', canvas.width, canvas.height);
      let box = this.frame.getComponent(Box);
      box.width = canvas.width - SpecialPowersSystem.FRAME_SIZE;
      box.height = canvas.height;
      BoardFrameSystem._updateDimensions();
    }
  }
}
