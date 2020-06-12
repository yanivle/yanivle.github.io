import { System } from "../corona/ecs/system.mjs";
import { canvas } from "../corona/core/canvas.mjs";
import { resizeHandler } from "../corona/core/canvas.mjs";
import { Box, BoxCollider, PositionWiggle, Position, PhysicsBody } from "../corona/components/base_components.mjs";
import { SpriteRenderer } from "../corona/standard_systems/sprite_renderer.mjs";
import { Entity } from "../corona/ecs/entity.mjs";
import { SpecialPowersSystem } from "./special_powers_system.mjs";
import { PhysicsSystem } from "../corona/standard_systems/physics_system.mjs";
import * as smokeParticleSystem from "../prefabs/smokeParticleSystem.mjs";
import { event_manager } from "../corona/core/EventManager.mjs";
import { AudioArray } from "../corona/core/AudioArray.mjs";
import { sequencer } from "../corona/core/Sequencer.mjs";
import { BoxColliderMovable } from "../corona/components/base_components.mjs";

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

  initFrameBounce() {
    this.frame.addComponent(new BoxCollider()).addComponent(new BoxColliderMovable());
    PhysicsSystem.addComponents(this.frame, SpecialPowersSystem.FRAME_SIZE, -canvas.height - 10, 0, 0, 0, 3, 0.05);
    this.floor = SpriteRenderer.addComponents(new Entity(), this.boardFrameImage, { x: 0, y: 0, width: canvas.width, height: canvas.height, layer: 8, centered: false });
    PhysicsSystem.addComponents(this.floor, 0, canvas.height, 0, 0, 0, 0);
    this.floor.addComponent(new BoxCollider());
    let bounces = 0;

    const maxFrameBounces = 4;

    let anvilSoundArray = new AudioArray('anvil', maxFrameBounces);
    let smokeParticleSystemPrefab = smokeParticleSystem.getPrefab();
    let bounceEventQueue = event_manager.getEventQueue('collision');

    let left = SpecialPowersSystem.FRAME_SIZE;
    let right = canvas.width;
    let width = right - left;
    let center = left + width / 2;

    let bounceHandler = event => {
      if (event.entity1 != this.frame && event.entity2 != this.frame) return;
      bounces++;
      let smokePS = smokeParticleSystemPrefab.instantiate().addComponent(new Position(center, canvas.height));
      smokePS.addComponent(new PositionWiggle(width / 2, 0, 100, 0));

      anvilSoundArray.play();
      let pos = this.frame.getComponent(Position);
      pos.x = SpecialPowersSystem.FRAME_SIZE;
      pos.y = 0;

      if (bounces == maxFrameBounces) {
        this.floor.scheduleDestruction();
        this.frame.scheduleRemoveComponent(BoxColliderMovable);
        this.frame.scheduleRemoveComponent(PhysicsBody);
        bounceEventQueue.scheduleUnsubscribe(bounceHandler);
        sequencer.notifyEnded('drop_frame');
      }
    };
    bounceEventQueue.subscribe(bounceHandler);
  }

  init() {
    BoardFrameSystem._updateDimensions();
    this.frame = SpriteRenderer.addComponents(new Entity(), this.boardFrameImage, { x: 10000, y: 10000, width: BoardFrameSystem.WIDTH, height: canvas.height, layer: 8, centered: false });
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
