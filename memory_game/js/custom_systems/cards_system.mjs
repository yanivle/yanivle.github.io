import { System } from "../corona/ecs/system.mjs";
import { SpriteRenderer } from "../corona/standard_systems/sprite_renderer.mjs";
import { randRange } from "../corona/core/math.mjs";
import { mouse } from "../corona/core/game_engine.mjs";
import { Position, Box } from "../corona/components/base_components.mjs";
import { entity_db } from "../corona/ecs/entity_database.mjs";
import * as base_components from "../corona/components/base_components.mjs";
import { Rotation } from "../corona/components/base_components.mjs";
import { BoxCollider } from "../corona/components/base_components.mjs";
import { KeepOnScreen } from "./keep_on_screen_system.mjs";
import { RotationWiggle } from "../corona/components/base_components.mjs";
import { Entity } from "../corona/ecs/entity.mjs";
import { RenderedPath } from "../corona/components/base_components.mjs";
import { Electricity } from "../corona/standard_systems/electricity_system.mjs";
import { pointInCenteredBox } from "../corona/core/math.mjs";
import { AngularVelocity } from "../corona/components/base_components.mjs";
import { keyboard } from "../corona/core/game_engine.mjs";
import { Sprite } from "../corona/components/base_components.mjs";
import { PhysicsBody } from "../corona/components/base_components.mjs";
import { ParticleSystemsSystem } from "../corona/standard_systems/particle_systems_system.mjs";
import { Attractor } from "../corona/components/base_components.mjs";
import { ResizingSystem } from "../corona/standard_systems/resizing_system.mjs";
import { SpecialPowersSystem } from "./special_powers_system.mjs";
import { FadeSystem } from "../corona/standard_systems/fade_system.mjs";
import { BoardFrameSystem } from "./board_frame_system.mjs";
import { Trail } from "../corona/components/base_components.mjs";

const CARD_SIZE = 64;

class CardComponent {
  constructor(faceup, faceupImage, backfaceImage) {
    this.faceup = faceup;
    this.faceupImage = faceupImage;
    this.backfaceImage = backfaceImage;
  }
}

export class CardsSystem extends System {
  constructor(cardImages, backfaceImage, numCardsPerType, starImages, specialPowersSystem, doctorSystem) {
    super();
    this.index = entity_db.index(CardComponent);
    this.electricity_index = entity_db.index(Electricity, RenderedPath);
    this.cardImages = cardImages;
    this.backfaceImage = backfaceImage;
    this.numCardsPerType = numCardsPerType;
    this.starImages = starImages;
    this.specialPowersSystem = specialPowersSystem;
    this.doctorSystem = doctorSystem;
    // this.debug = new Debug(true);
  }

  init() {
    this.tipsGiven = {
      firstFlip: false,
      firstMatch: false,
      firstFail: false,
      firstSpecialPower: false,
    };
    this.sounds = {
      electricity: resource_manager.loadAudio('electricity'),
      whoosh: resource_manager.loadAudio('whoosh'),
      cough: resource_manager.loadAudio('cough'),
      boom: resource_manager.loadAudio('boom'),
      cheering: resource_manager.loadAudio('cheering'),
    };
    this.sounds.electricity.loop = true;
  }

  initCards() {
    for (const cardImage of this.cardImages) {
      for (let i = 0; i < this.numCardsPerType; ++i) {
        let card = SpriteRenderer.addComponents(new Entity(), this.backfaceImage, {
          x: randRange(BoardFrameSystem.LEFT, BoardFrameSystem.RIGHT),
          y: randRange(BoardFrameSystem.TOP, BoardFrameSystem.BOTTOM),
          layer: 1,
          width: CARD_SIZE,
          height: CARD_SIZE,
        });
        card
          .addComponent(new CardComponent(false, cardImage, this.backfaceImage))
          .addComponent(new Rotation(0))
          .addComponent(new PhysicsBody(0, 0, 0, 0, 0.1, 0.1))
          .addComponent(new BoxCollider(false, false))
          .addComponent(new KeepOnScreen())
          .addComponent(new RotationWiggle(1 / 20, 20, randRange(0, 6.28)));
        ;
      }
    }
  }

  static cardCenter(card) {
    let pos = card.getComponent(Position);
    let box = card.getComponent(Box);
    return {
      x: pos.x + box.width / 2,
      y: pos.y + box.height / 2,
    }
  }

  static isFaceup(cardEntity) {
    let flipComponent = cardEntity.getComponent(FlipComponent);
    let cardComponent = cardEntity.getComponent(CardComponent);
    return flipComponent ? flipComponent.targetFaceup : cardComponent.faceup;
  }

  update() {
    if (keyboard.keysPressed[32]) {
      this.index.forEach(card => {
        card.getComponent(Sprite).image = card.getComponent(CardComponent).faceupImage;
      });
    } //else {
    //   this.index.forEach(card => {
    //     card.getComponent(Sprite).image = card.getComponent(CardComponent).backfaceImage;
    //   });
    // }

    let flippedSomething = false;
    let firstFlipped = null;
    if (mouse.pressed) {
      this.index.forEach(card => {
        let pos = card.getComponent(Position);
        let box = card.getComponent(Box);
        if (pointInCenteredBox(mouse.pos, pos, box)) {
          flippedSomething = true;
          if (!firstFlipped) firstFlipped = card;
          // createParticleSystem(64, this.starImages, pos.x, pos.y, { expirationTime: 1 });
          let flip = card.getComponent(FlipComponent);
          if (flip) {
            flip.targetFaceup = !flip.targetFaceup;
          } else {
            flip = new FlipComponent(!card.getComponent(CardComponent).faceup);
            card.addComponent(flip);
          }
        }
      });
    }
    if (flippedSomething) {
      if (!this.tipsGiven.firstFlip) {
        this.tipsGiven.firstFlip = true;
        this.doctorSystem.speak('Great! You flipped a card!\nNow find another just like it!', 3);
      }
      this.sounds.whoosh.play();
      let numElectricityConnections = 0;
      // Recalculate electricity
      this.electricity_index.forEach(entity => { entity.scheduleDestruction(); });
      // Remove spinning from cards - ok to remove the component because it's not in the index
      // TODO: add a check against this bug of destroying entities, adding entities or any way 
      // changing indices while iterating on them.
      this.index.forEach(card => card.removeComponent(AngularVelocity));

      let faceupConflict = false;
      let faceupImage = null;
      let numFaceupCards = 0;
      for (const card of this.index.entitiesUnsafe()) {
        if (!CardsSystem.isFaceup(card)) continue;
        numFaceupCards++;
        let cardComponent = card.getComponent(CardComponent);
        if (faceupImage == null) faceupImage = cardComponent.faceupImage;
        else if (faceupImage != cardComponent.faceupImage) faceupConflict = true;
      }
      if (faceupConflict) {
        if (!this.tipsGiven.firstFail) {
          this.tipsGiven.firstFail = true;
          this.doctorSystem.speak('Oh no! You flipped a non-matching card!\nStart over!', 3);
        }
        this.sounds.cough.play();
        numFaceupCards = 0;
        this.index.forEach(card => {
          if (CardsSystem.isFaceup(card)) {
            if (card != firstFlipped) card.addComponent(new FlipComponent(false));
          }
        });
      }
      for (let i = 0; i < this.index.length; ++i) {
        let card = this.index.at(i);
        if (!CardsSystem.isFaceup(card)) {
          card
            .addComponent(new RotationWiggle(1 / 20, 20, randRange(0, 6.28)))
            .removeComponent(AngularVelocity);
        } else {
          card.removeComponent(RotationWiggle);
          card.addComponent(new AngularVelocity(3.14 / 2 * numFaceupCards * numFaceupCards));
          for (let j = i + 1; j < this.index.length; ++j) {
            let card2 = this.index.at(j);
            if (CardsSystem.isFaceup(card2)) {
              new Entity()
                .addComponent(new Electricity(card, card2, 10, 5 * numFaceupCards))
                .addComponent(new RenderedPath(10, 'rgba(100, 100, 255, 0.5)'));
              numElectricityConnections++;
              if (!this.tipsGiven.firstMatch) {
                this.tipsGiven.firstMatch = true;
                this.doctorSystem.speak('Yaya! You found a pair!\nThere are 5 cards of each type\nFind them all!', 3);
              }
            }
          }
        }
      }
      if (numFaceupCards == this.numCardsPerType) {
        // Remove electricity.
        this.electricity_index.forEach(entity => { entity.scheduleDestruction(); });
        numElectricityConnections = 0;
        // Create particle system.
        for (let i = 0; i < this.index.length; ++i) {
          let card = this.index.at(i);
          if (CardsSystem.isFaceup(card)) {
            let pos = card.getComponent(Position);
            // createParticleSystem(32, this.starImages, pos.x, pos.y, { expirationTime: 1 });
            ParticleSystemsSystem.addComponents(new Entity(),
              pos.x,
              pos.y,
              ParticleSystemsSystem.createParticlePrefabs(
                this.starImages,
                {
                  particleLifetime: 1,
                  trailColor: 'rgba(0, 255, 0, 0.2)',
                  trailLength: 20,
                  rotationsPerSecond: 2
                }),
              {
                particlesPerSecond: Infinity,
                emitterExpirationTime: 1,
                maxParticles: 32,
                particleMaxVelocity: 10,
                g: 0.1
              });

            this.sounds.boom.play();
            this.sounds.cheering.play();

            if (!this.tipsGiven.firstSpecialPower) {
              this.tipsGiven.firstSpecialPower = true;
              this.doctorSystem.speak('You unlocked the first special power!\nFour more to go!', 3);
            }

            let powerupType = this.specialPowersSystem.getPowerupTypeFromImage(faceupImage);
            let powerupPos = this.specialPowersSystem.getPowerupPosition(powerupType);
            card.addComponent(new Attractor(powerupPos.x, powerupPos.y, 0.01, 0.0001));
            let box = card.getComponent(Box);
            ResizingSystem.resize(card, box.width, box.height, SpecialPowersSystem.BUTTON_SIZE, SpecialPowersSystem.BUTTON_SIZE, 1);
            FadeSystem.fadeOut(card, 1.5);
            card.removeComponent(Rotation);
            card.removeComponent(AngularVelocity);
          }
        }
        // Add special power button.
        this.specialPowersSystem.createSpecialPowerButton(faceupImage);
      }
      if (numElectricityConnections > 0) {
        if (this.sounds.electricity.paused) {
          this.sounds.electricity.play();
        }
        this.sounds.electricity.volume = 0.1 * numElectricityConnections;
      } else {
        this.sounds.electricity.pause();
      }
    }
  }
}

class FlipComponent {
  constructor(targetFaceup) {
    this.targetFaceup = targetFaceup;
  }
}

const FLIP_SPEED = 16;
const HALF_SPEED = FLIP_SPEED / 2;

export class FlipSystem extends System {
  constructor() {
    super();
    this.index = entity_db.index(base_components.Sprite, CardComponent, FlipComponent, base_components.Box, base_components.Position);
  }

  update() {
    this.index.copyEntities().forEach(entity => {
      let cardComponent = entity.getComponent(CardComponent);
      let flipComponent = entity.getComponent(FlipComponent);
      let box = entity.getComponent(base_components.Box);
      let pos = entity.getComponent(base_components.Position);
      if (cardComponent.faceup == flipComponent.targetFaceup) {  // Grow
        if (box.width >= CARD_SIZE) {
          box.width = CARD_SIZE;
          entity.removeComponent(FlipComponent);
        } else {
          box.width += FLIP_SPEED;
          pos.x -= HALF_SPEED;
        }
      } else {  // Shrink
        if (box.width <= 0) {  // Flip
          box.width = 0;
          cardComponent.faceup = flipComponent.targetFaceup;
          let sprite = entity.getComponent(base_components.Sprite);
          sprite.image = cardComponent.faceup ? cardComponent.faceupImage : cardComponent.backfaceImage;
        } else {
          box.width -= FLIP_SPEED;
          pos.x += HALF_SPEED;
        }
      }
    });
  }
}
