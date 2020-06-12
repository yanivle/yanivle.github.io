import { game_engine } from "../corona/core/game_engine.mjs";
import { SpriteRenderer } from "../corona/standard_systems/sprite_renderer.mjs";
import { Entity } from "../corona/ecs/entity.mjs";
import { ParticleSystemsSystem } from "../corona/standard_systems/particle_systems_system.mjs";
import { EntityProcessorSystem } from "../corona/ecs/entity_processor_system.mjs";
import { FadeSystem } from "../corona/standard_systems/fade_system.mjs";
import { Box, BoxCollider, PositionWiggle, Position, PhysicsBody } from "../corona/components/base_components.mjs";
import { AudioArray } from "../corona/core/AudioArray.mjs";
import * as smokeParticleSystem from "../prefabs/smokeParticleSystem.mjs";
import { event_manager } from "../corona/core/EventManager.mjs";
import { sequencer } from "../corona/core/Sequencer.mjs";
import { BoxColliderMovable } from "../corona/components/base_components.mjs";
import { VirusSystem } from "./virus_system.mjs";
import { mouse } from "../corona/core/game_engine.mjs";

const SPECIAL_POWERS = {
  DISINFECTANT: "DISINFECTANT",
  QUARANTINE: 'QUARANTINE',
  MASK: 'MASK',
  SYRINGE: 'SYRINGE',
  TEST_KIT: 'TEST_KIT',
};

class SpecialPowerButton {
  constructor(type) {
    this.type = type;
  }
}

class SpecialPowerComponentSchedule {
  constructor(type, image, createAtTimestamp) {
    this.type = type;
    this.image = image;
    this.createAtTimestamp = createAtTimestamp;
    this.alreadyCreatedParticleSystem = false;
  }
};

const maxFrameBounces = 1;

export class SpecialPowersSystem extends EntityProcessorSystem {
  static BUTTON_SIZE = 128;
  static FRAME_SIZE = SpecialPowersSystem.BUTTON_SIZE + 40;
  static FRAME_VERTICAL_PADDING = 10;

  constructor(disinfectantImage, quarantineImage, maskImage, syringeImage, testKitImage, frameImage, glowImages) {
    super(SpecialPowerComponentSchedule);
    this.disinfectantImage = disinfectantImage;
    this.quarantineImage = quarantineImage;
    this.maskImage = maskImage;
    this.syringeImage = syringeImage;
    this.testKitImage = testKitImage;
    this.frameImage = frameImage;
    this.glowImages = glowImages;
    this.buttons = [];
  }

  init() {
    this.frames = [];
    for (let i = 0; i < 5; ++i) {
      // SpriteRenderer.addComponents(new Entity(), this.frameImage, { x: SpecialPowersSystem.FRAME_SIZE / 2, y: SpecialPowersSystem.FRAME_SIZE / 2 + (SpecialPowersSystem.FRAME_SIZE + SpecialPowersSystem.FRAME_VERTICAL_PADDING) * i, layer: 0, width: SpecialPowersSystem.FRAME_SIZE, height: SpecialPowersSystem.FRAME_SIZE });
      let frame = new Entity('specialPowerFrame' + i);
      this.frames.push(frame);
      SpriteRenderer.addComponents(frame, this.frameImage, { x: -SpecialPowersSystem.FRAME_SIZE / 2 - 100, y: SpecialPowersSystem.FRAME_SIZE / 2 + (SpecialPowersSystem.FRAME_SIZE + SpecialPowersSystem.FRAME_VERTICAL_PADDING) * i, layer: 0, width: SpecialPowersSystem.FRAME_SIZE, height: SpecialPowersSystem.FRAME_SIZE });
    }
    this.anvilSoundArray = new AudioArray('anvil', maxFrameBounces * 5);
    this.smokeParticleSystemPrefab = smokeParticleSystem.getPrefab({ numParticles: 32, vertical: true });
    this.bounceEventQueue = event_manager.getEventQueue('collision');
  }

  attractFrames(bigFrame) {
    let frame = this.frames[0];
    frame
      .addComponent(new BoxCollider())
      .addComponent(new BoxColliderMovable())
      .addComponent(new PhysicsBody(0, 0, 1.5, 0, 0.05));
    let bounces = 0;
    let pos = frame.getComponent(Position);
    let originalY = pos.y;

    let bounceHandler = event => {
      if (event.entity1 != frame && event.entity2 != frame) return;
      bounces++;
      let smokePS = this.smokeParticleSystemPrefab.instantiate().addComponent(new Position(SpecialPowersSystem.FRAME_SIZE, originalY));
      smokePS.addComponent(new PositionWiggle(0, SpecialPowersSystem.FRAME_SIZE, 0, 100));

      this.anvilSoundArray.play();
      pos.y = originalY;
      pos.x = SpecialPowersSystem.FRAME_SIZE / 2;

      if (bounces == maxFrameBounces) {
        // console.log(pos.x);
        // console.log(pos);
        frame.scheduleRemoveComponent(BoxCollider);
        frame.scheduleRemoveComponent(BoxColliderMovable);
        frame.scheduleRemoveComponent(PhysicsBody);
        this.frames.shift();
        if (this.frames.length > 0) {
          this.attractFrames(bigFrame);
        } else {
          this.bounceEventQueue.scheduleUnsubscribe(bounceHandler);
          bigFrame.scheduleRemoveComponent(BoxCollider);
          bigFrame.scheduleRemoveComponent(PhysicsBody);
          sequencer.notifyEnded('attract_special_frames');
        }
      }
    };
    this.bounceEventQueue.subscribe(bounceHandler);
  }

  getPowerupTypeFromImage(image) {
    if (image == this.disinfectantImage) {
      return SPECIAL_POWERS.DISINFECTANT;
    } else if (image == this.quarantineImage) {
      return SPECIAL_POWERS.QUARANTINE;
    } else if (image == this.maskImage) {
      return SPECIAL_POWERS.MASK;
    } else if (image == this.syringeImage) {
      return SPECIAL_POWERS.SYRINGE;
    } else if (image == this.testKitImage) {
      return SPECIAL_POWERS.TEST_KIT;
    } else {
      console.error('Invalid special power image:', image);
    }
  }

  getPowerupPosition(type) {
    return POWERUP_TYPE_TO_POS[type];
  }

  createSpecialPowerButton(image) {
    let type = this.getPowerupTypeFromImage(image);
    new Entity().addComponent(new SpecialPowerComponentSchedule(type, image, game_engine.now + 1));
  }

  _addSpecialPowerParticleSystem(type) {
    let pos = this.getPowerupPosition(type);
    ParticleSystemsSystem.addComponents(new Entity(),
      pos.x,
      pos.y,
      ParticleSystemsSystem.createParticlePrefabs(
        { images: this.glowImages, particleLifetime: 1, renderingLayer: 0 }),
      {
        particlesPerSecond: Infinity,
        emitterExpirationTime: Infinity,
        maxParticles: 32,
        particleMaxVelocity: 3,
        g: 0
      });
  }

  _addSpecialPowerButton(type, image) {
    let pos = this.getPowerupPosition(type);
    let button = SpriteRenderer.addComponents(new Entity(), image, { x: pos.x, y: pos.y, layer: 0, width: SpecialPowersSystem.BUTTON_SIZE, height: SpecialPowersSystem.BUTTON_SIZE });
    FadeSystem.fadeIn(button, 1);
    button.addComponent(new SpecialPowerButton(type));
    this.buttons.push(button);
  }

  update(deltaTime) {
    super.update(deltaTime);
    if (mouse.pressed) {
      this.buttons.forEach(button => {
        let pos = button.getComponent(Position);
        let box = button.getComponent(Box);
        let buttonComponent = button.getComponent(SpecialPowerButton);
        if (box.contains(pos, mouse.pos.x, mouse.pos.y)) {
          switch (buttonComponent.type) {
            case SPECIAL_POWERS.DISINFECTANT:
              game_engine.getSystemByType(VirusSystem).explodeViruses();
              break;
            case SPECIAL_POWERS.MASK:
              break;
            case SPECIAL_POWERS.QUARANTINE:
              break;
            case SPECIAL_POWERS.SYRINGE:
              break;
            case SPECIAL_POWERS.TEST_KIT:
              break;
          }
        }
      });
    }
  }

  processEntity(_, entity, specialPowerComponentSchedule) {
    if (game_engine.now >= specialPowerComponentSchedule.createAtTimestamp) {
      if (!specialPowerComponentSchedule.alreadyCreatedParticleSystem) {
        this._addSpecialPowerParticleSystem(specialPowerComponentSchedule.type);
        this._addSpecialPowerButton(specialPowerComponentSchedule.type, specialPowerComponentSchedule.image)
        entity.scheduleDestruction();
      }
    }
  }
}

const POWERUP_TYPE_TO_POS = {
  DISINFECTANT: { x: SpecialPowersSystem.BUTTON_SIZE / 2 + 20, y: SpecialPowersSystem.BUTTON_SIZE / 2 + 20 + (SpecialPowersSystem.BUTTON_SIZE + 50) * 0 },
  QUARANTINE: { x: SpecialPowersSystem.BUTTON_SIZE / 2 + 20, y: SpecialPowersSystem.BUTTON_SIZE / 2 + 20 + (SpecialPowersSystem.BUTTON_SIZE + 50) * 1 },
  MASK: { x: SpecialPowersSystem.BUTTON_SIZE / 2 + 20, y: SpecialPowersSystem.BUTTON_SIZE / 2 + 20 + (SpecialPowersSystem.BUTTON_SIZE + 50) * 2 },
  SYRINGE: { x: SpecialPowersSystem.BUTTON_SIZE / 2 + 20, y: SpecialPowersSystem.BUTTON_SIZE / 2 + 20 + (SpecialPowersSystem.BUTTON_SIZE + 50) * 3 },
  TEST_KIT: { x: SpecialPowersSystem.BUTTON_SIZE / 2 + 20, y: SpecialPowersSystem.BUTTON_SIZE / 2 + 20 + (SpecialPowersSystem.BUTTON_SIZE + 50) * 4 },
};

