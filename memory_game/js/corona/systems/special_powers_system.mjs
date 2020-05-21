import { game_engine } from "../core/game_engine.mjs";
import { SpriteRenderer } from "./sprite_renderer.mjs";
import { Entity } from "../ecs/entity.mjs";
import { ParticleSystemsSystem } from "./particle_systems_system.mjs";
import { EntityProcessorSystem } from "../ecs/entity_processor_system.mjs";
import { FadeSystem } from "./fade_system.mjs";

const SPECIAL_POWERS = {
  DISINFECTANT: "DISINFECTANT",
  QUARANTINE: 'QUARANTINE',
  MASK: 'MASK',
  SYRINGE: 'SYRINGE',
  TEST_KIT: 'TEST_KIT',
};

class SpecialPowerComponentSchedule {
  constructor(type, image, createAtTimestamp) {
    this.type = type;
    this.image = image;
    this.createAtTimestamp = createAtTimestamp;
    this.alreadyCreatedParticleSystem = false;
  }
};

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
  }

  init() {
    for (let i = 0; i < 5; ++i) {
      SpriteRenderer.addComponents(new Entity(), this.frameImage, { x: SpecialPowersSystem.FRAME_SIZE / 2, y: SpecialPowersSystem.FRAME_SIZE / 2 + (SpecialPowersSystem.FRAME_SIZE + SpecialPowersSystem.FRAME_VERTICAL_PADDING) * i, layer: 0, width: SpecialPowersSystem.FRAME_SIZE, height: SpecialPowersSystem.FRAME_SIZE });
    }
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
        this.glowImages, { particleLifetime: 1, renderingLayer: 0 }),
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
  }

  processEntity(_, entity, specialPowerComponentSchedule) {
    if (game_engine.now >= specialPowerComponentSchedule.createAtTimestamp) {
      if (!specialPowerComponentSchedule.alreadyCreatedParticleSystem) {
        this._addSpecialPowerParticleSystem(specialPowerComponentSchedule.type);
        this._addSpecialPowerButton(specialPowerComponentSchedule.type, specialPowerComponentSchedule.image)
        entity.scheduleDestruction();
      }
    }
    // if (mouse.pressed) {
    //   this.index.forEach(button => {
    //     let pos = button.getComponent(Position);
    //     let box = button.getComponent(Box);
    //     if (pointInCenteredBox(mouse.pos, pos, box)) {
    //       //
    //     }
    //   });
    // }
  }
}

const POWERUP_TYPE_TO_POS = {
  DISINFECTANT: { x: SpecialPowersSystem.BUTTON_SIZE / 2 + 20, y: SpecialPowersSystem.BUTTON_SIZE / 2 + 20 + (SpecialPowersSystem.BUTTON_SIZE + 50) * 0 },
  QUARANTINE: { x: SpecialPowersSystem.BUTTON_SIZE / 2 + 20, y: SpecialPowersSystem.BUTTON_SIZE / 2 + 20 + (SpecialPowersSystem.BUTTON_SIZE + 50) * 1 },
  MASK: { x: SpecialPowersSystem.BUTTON_SIZE / 2 + 20, y: SpecialPowersSystem.BUTTON_SIZE / 2 + 20 + (SpecialPowersSystem.BUTTON_SIZE + 50) * 2 },
  SYRINGE: { x: SpecialPowersSystem.BUTTON_SIZE / 2 + 20, y: SpecialPowersSystem.BUTTON_SIZE / 2 + 20 + (SpecialPowersSystem.BUTTON_SIZE + 50) * 3 },
  TEST_KIT: { x: SpecialPowersSystem.BUTTON_SIZE / 2 + 20, y: SpecialPowersSystem.BUTTON_SIZE / 2 + 20 + (SpecialPowersSystem.BUTTON_SIZE + 50) * 4 },
};

