import { Scene } from "../corona/core/scene.mjs";
import { BoardFrameSystem } from "../corona/systems/board_frame_system.mjs";
import { VirusSystem } from "../corona/systems/virus_system.mjs";
import { SpecialPowersSystem } from "../corona/systems/special_powers_system.mjs";
import { CardsSystem } from "../corona/systems/cards_system.mjs";
import { TimeCounterSystem } from "../corona/systems/time_counter_system.mjs";

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

    resource_manager.loadFont('AvocadoCreamy', 'AvocadoCreamy.ttf');
  }

  init() {
    game_engine.addSystem(new BoardFrameSystem(this.boardFrameImage));
    game_engine.addSystem(new VirusSystem(this.virusImages, this.cloudImage));
    let specialPowersSystem = new SpecialPowersSystem(...this.cardImages, this.frameImage, this.glowImages);
    game_engine.addSystem(specialPowersSystem);
    game_engine.addSystem(new CardsSystem(this.cardImages, this.backfaceImage, 5, this.starImages, specialPowersSystem));
    game_engine.addSystem(new TimeCounterSystem('32px Comic Sans MS'));
  }
}
