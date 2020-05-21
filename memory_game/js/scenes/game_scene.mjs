import { Scene } from "../corona/core/scene.mjs";
import { BoardFrameSystem } from "../custom_systems/board_frame_system.mjs";
import { VirusSystem } from "../custom_systems/virus_system.mjs";
import { SpecialPowersSystem } from "../custom_systems/special_powers_system.mjs";
import { CardsSystem } from "../custom_systems/cards_system.mjs";
import { TimeCounterSystem } from "../custom_systems/time_counter_system.mjs";
import { Entity } from "../corona/ecs/entity.mjs";
import { RenderedRect } from "../corona/components/base_components.mjs";
import { Box } from "../corona/components/base_components.mjs";
import { Position } from "../corona/components/base_components.mjs";
import { canvas } from "../corona/core/canvas.mjs";
import { Fade } from "../corona/components/base_components.mjs";
import { FadeSystem } from "../corona/standard_systems/fade_system.mjs";
import { ParticleSystemsSystem } from "../corona/standard_systems/particle_systems_system.mjs";
import { PositionWiggle } from "../corona/components/base_components.mjs";

export class GameScene extends Scene {
  constructor() {
    super();
    this.boardFrameImage = resource_manager.loadImage('large_frame.png');

    this.starImages = resource_manager.loadImages(['star_yellow.png', 'star_red.png', 'star_blue.png', 'star_green.png']);
    this.glowImages = resource_manager.loadImages(['glow2.png', 'glow3.png', 'glow4.png']);
    this.backfaceImage = resource_manager.loadImage('cardback.png');
    const virusImageUrls = ['Virus1-01.png', 'Virus2-01.png', 'Virus3-01.png', 'Virus4-01.png', 'Virus5-01.png', 'Virus6-01.png'];
    this.virusImages = resource_manager.loadImages(virusImageUrls);
    const cardImageUrls = ['clorox.webp', 'mask.webp', 'quarantine.png', 'syringe.png', 'test_kit.png'];
    this.cardImages = resource_manager.loadImages(cardImageUrls);
    this.cloudImage = resource_manager.loadImage('cloud.png');
    this.frameImage = resource_manager.loadImage('frame.png');

    // const socialDistancingImageUrls = ['social_dist1.png', 'social_dist2.png', 'social_dist3.png', 'social_dist4.png', 'social_dist5.png', 'social_dist6.png', 'social_dist7.png'];
    // this.socialDistancingImages = resource_manager.loadImages(socialDistancingImageUrls);

    const leafImageUrls = ['leaf1.png', 'leaf2.png', 'leaf3.png', 'leaf4.png', 'leaf5.png', 'leaf6.png', 'leaf7.png', 'leaf8.png', 'leaf9.png'];
    this.leafImages = resource_manager.loadImages(leafImageUrls);

    resource_manager.loadFont('AvocadoCreamy', 'AvocadoCreamy.ttf');

    resource_manager.loadAudio('whoosh.wav', 'whoosh');
    resource_manager.loadAudio('cough.mp3', 'cough');
    resource_manager.loadAudio('cheering.wav', 'cheering');
    resource_manager.loadAudio('electricity.mp3', 'electricity');
    resource_manager.loadAudio('boom.wav', 'boom');
  }

  init() {
    game_engine.addSystem(new BoardFrameSystem(this.boardFrameImage));
    game_engine.addSystem(new VirusSystem(this.virusImages, this.cloudImage));
    let specialPowersSystem = new SpecialPowersSystem(...this.cardImages, this.frameImage, this.glowImages);
    game_engine.addSystem(specialPowersSystem);
    game_engine.addSystem(new CardsSystem(this.cardImages, this.backfaceImage, 5, this.starImages, specialPowersSystem));
    game_engine.addSystem(new TimeCounterSystem('32px Comic Sans MS'));

    let fadeScreen = new Entity()
      .addComponent(new Position(0, 0))
      .addComponent(new RenderedRect('black'))
      .addComponent(new Box(canvas.width, canvas.height, false));
    FadeSystem.fadeOut(fadeScreen, 3);
    this.addEntity(fadeScreen);

    let backgroundParticleSystem = ParticleSystemsSystem.addComponents(new Entity('backgroundParticleSystem'),
      canvas.width / 2,
      -200,
      ParticleSystemsSystem.createParticlePrefabs(
        this.leafImages, { particleLifetime: 10, rotationsPerSecond: 1, renderingLayer: 9 }),
      {
        particlesPerSecond: 10,
        emitterExpirationTime: Infinity,
        maxParticles: Infinity,
        particleMaxVelocity: 3,
        g: 0.01,
      });
    backgroundParticleSystem.addComponent(new PositionWiggle(canvas.width / 2, 0, 10, 0));
    this.addEntity(backgroundParticleSystem);
  }
}
