import { Scene } from "../corona/core/scene.mjs";
import { BoardFrameSystem } from "../custom_systems/board_frame_system.mjs";
import { VirusSystem } from "../custom_systems/virus_system.mjs";
import { SpecialPowersSystem } from "../custom_systems/special_powers_system.mjs";
import { CardsSystem, FlipSystem } from "../custom_systems/cards_system.mjs";
import { TimeCounterSystem } from "../custom_systems/time_counter_system.mjs";
import { Entity } from "../corona/ecs/entity.mjs";
import { RenderedRect } from "../corona/components/base_components.mjs";
import { Box } from "../corona/components/base_components.mjs";
import { Position } from "../corona/components/base_components.mjs";
import { canvas } from "../corona/core/canvas.mjs";
import { FadeSystem } from "../corona/standard_systems/fade_system.mjs";
import { ParticleSystemsSystem } from "../corona/standard_systems/particle_systems_system.mjs";
import { PositionWiggle } from "../corona/components/base_components.mjs";
import { DoctorSystem } from "../custom_systems/doctor_system.mjs";
import { SpriteRenderer } from "../corona/standard_systems/sprite_renderer.mjs";
import { event_manager } from "../corona/core/EventManager.mjs";
import * as smokeParticleSystem from '../prefabs/smokeParticleSystem.mjs';
import * as bloodParticleSystem from '../prefabs/bloodParticleSystem.mjs';
import { sequencer } from "../corona/core/Sequencer.mjs";
import { game_engine } from "../corona/core/game_engine.mjs";

export class GameScene extends Scene {
  constructor() {
    super();
    smokeParticleSystem.preloadResources();
    bloodParticleSystem.preloadResources();

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

    this.doctorImage = resource_manager.loadImage('doctor.png');
    this.speechBubbleImage = resource_manager.loadImage('speech_bubble.png');

    resource_manager.loadFont('AvocadoCreamy', 'AvocadoCreamy.ttf');

    resource_manager.loadAudio('whoosh.wav', 'whoosh');
    resource_manager.loadAudio('cough.mp3', 'cough');
    resource_manager.loadAudio('cheering.wav', 'cheering');
    resource_manager.loadAudio('electricity.mp3', 'electricity');
    resource_manager.loadAudio('boom.wav', 'boom');
    resource_manager.loadAudio('mumble.wav', 'mumble');

    resource_manager.loadAudio('anvil.wav', 'anvil');

    this.backgroundImage = resource_manager.loadImage('background.jpg');
  }

  dropFrame() {

  }

  init() {
    this.addEntity(
      SpriteRenderer.addComponents(new Entity(),
        this.backgroundImage,
        { x: 0, y: 0, width: canvas.width, height: canvas.height, layer: 10, centered: false }));

    sequencer.follow('fade', 'drop_frame');
    sequencer.follow('drop_frame', 'attract_special_frames');
    sequencer.follow('attract_special_frames', 'doctor_intro');
    sequencer.follow('doctor', 'show_cards');

    let doctorSystem = new DoctorSystem(this.doctorImage, this.speechBubbleImage, '22px AvocadoCreamy');
    let specialPowersSystem = new SpecialPowersSystem(...this.cardImages, this.frameImage, this.glowImages);
    let boardFrameSystem = new BoardFrameSystem(this.boardFrameImage, specialPowersSystem);
    let cardsSystem = new CardsSystem(this.cardImages, this.backfaceImage, 5, this.starImages, specialPowersSystem, doctorSystem);
    let virusSystem = new VirusSystem(this.virusImages, this.cloudImage);

    game_engine.addSystem(boardFrameSystem);
    game_engine.addSystem(specialPowersSystem);
    game_engine.addSystem(doctorSystem);
    game_engine.addSystem(cardsSystem);
    game_engine.addSystem(new FlipSystem());
    game_engine.addSystem(virusSystem);

    sequencer.setCallback('drop_frame', () => {
      boardFrameSystem.initFrameBounce();
    });

    sequencer.setCallback('attract_special_frames', () => {
      specialPowersSystem.attractFrames(boardFrameSystem.frame);
    });

    sequencer.setCallback('doctor_intro', () => {
      doctorSystem.speak('Welcome hero!\nPlease help us fight the corona!\nFind 5 cards of the same type to\nunlock special powers\nand defeat the virus!', 20);
    });

    sequencer.setCallback('show_cards', () => {
      cardsSystem.initCards();
      virusSystem.start();
      sequencer.unfollow('doctor', 'show_cards');
    });

    // game_engine.addSystem(new TimeCounterSystem('32px Comic Sans MS'));

    let fadeScreen = new Entity()
      .addComponent(new Position(0, 0))
      .addComponent(new RenderedRect('black'))
      .addComponent(new Box(canvas.width, canvas.height, false));
    FadeSystem.fadeOut(fadeScreen, 1);
    this.addEntity(fadeScreen);

    let fadeQueue = event_manager.getEventQueue('fade');
    let afterFade = fadeEvent => {
      if (fadeEvent.entity == fadeScreen) {
        fadeQueue.scheduleUnsubscribe(afterFade);
        sequencer.notifyEnded('fade');
      }
    };
    fadeQueue.subscribe(afterFade);

    let backgroundParticleSystem = ParticleSystemsSystem.addComponents(new Entity('backgroundParticleSystem'),
      canvas.width / 2,
      -200,
      ParticleSystemsSystem.createParticlePrefabs(
        { images: this.leafImages, particleLifetime: 10, rotationsPerSecond: 1, renderingLayer: 9 }),
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
