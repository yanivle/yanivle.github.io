import { Scene } from "../corona/core/scene.mjs";
import { Entity } from "../corona/ecs/entity.mjs";
import { SpriteRenderer } from "../corona/standard_systems/sprite_renderer.mjs";
import { canvas } from "../corona/core/canvas.mjs";
import { PositionWiggle } from "../corona/components/base_components.mjs";
import { randRange } from "../corona/core/math.mjs";
import { RotationWiggleSystem } from "../corona/standard_systems/rotation_wiggle_system.mjs";
import { SceneSwitchSystem } from "../corona/standard_systems/scene_switch_system.mjs";
import { TextRenderer } from "../corona/standard_systems/text_renderer.mjs";
import { ParticleSystemsSystem } from "../corona/standard_systems/particle_systems_system.mjs";
import { Prefab } from "../corona/ecs/prefab.mjs";
import { Position } from "../corona/components/base_components.mjs";

export class MenuScene extends Scene {
  constructor() {
    super();
    this.letterImages = {
      'c': resource_manager.loadImage('letter_c.png'),
      'o': resource_manager.loadImage('letter_o.png'),
      'r': resource_manager.loadImage('letter_r.png'),
      'n': resource_manager.loadImage('letter_n.png'),
      'a': resource_manager.loadImage('letter_a.png'),
    }
    this.bubbleImage = resource_manager.loadImage('glow1.png');
    // TODO: cancel the background system...
    this.backgroundImage = resource_manager.loadImage('menu_background.jpeg');

    this.sickKidImage = resource_manager.loadImage('sick_kid.png');
    // this.sickKidImage2 = resource_manager.loadImage('sick_kid2.png');
    // this.healthyKidImage = resource_manager.loadImage('healthy_kid.png');
  }

  init() {
    let bubbleUpParticleSystemPrefab = new Prefab(ParticleSystemsSystem.addComponents(new Entity('bubbleParticleSystemPrefab', false),
      0,
      0,
      ParticleSystemsSystem.createParticlePrefabs(
        [this.bubbleImage], { particleLifetime: 1, }),
      {
        particlesPerSecond: 8,
        emitterExpirationTime: Infinity,
        maxParticles: Infinity,
        particleMaxVelocity: 1,
        g: -0.1,
      }));

    let str = 'corona';
    let numLetters = str.length;
    let letterWidth = 128;
    let letterHeight = 128;
    let stringWidth = letterWidth * numLetters;
    let startX = (canvas.width - stringWidth) / 2 + letterWidth / 2;
    let startY = letterHeight / 2 + 100;
    for (let i = 0; i < numLetters; ++i) {
      let letter = SpriteRenderer.addComponents(new Entity(), this.letterImages[str[i]], { x: startX + i * letterWidth, y: startY, layer: 3, width: letterWidth, height: letterHeight });
      letter
        .addComponent(new PositionWiggle(20, 20, randRange(2, 5), randRange(2, 5), randRange(0, 6.28), randRange(0, 6.28)));
      RotationWiggleSystem.addComponents(letter, randRange(3, 10), randRange(0, 3.14 / 10), randRange(-0.1, 0.1));
      this.addEntity(letter);
    }
    let coronaParticleSystem = bubbleUpParticleSystemPrefab.instantiate().addComponent(new Position(canvas.width / 2, startY));
    coronaParticleSystem.addComponent(new PositionWiggle(stringWidth / 2, letterHeight / 2, 10, 7));
    this.addEntity(coronaParticleSystem);

    let clickTextX = canvas.width / 2;
    let clickTextY = canvas.height * 2 / 3;
    let clickText = TextRenderer.createRenderedText('Save the world\nPress mouse button to start!', '64px AvocadoCreamy', clickTextX, clickTextY, null, 'rgba(200, 200, 200, 0.7)', true);
    clickText.addComponent(new PositionWiggle(0, 32, 0, 1));
    this.addEntity(clickText);
    let clickTextParticleSystem = bubbleUpParticleSystemPrefab.instantiate().addComponent(new Position(clickTextX, clickTextY - 64));
    clickTextParticleSystem.addComponent(new PositionWiggle(300, 32, 10, 7));
    this.addEntity(clickTextParticleSystem);

    this.addEntity(SpriteRenderer.addComponents(new Entity(), this.backgroundImage, { x: 0, y: 0, width: canvas.width, height: canvas.height, layer: 9, centered: false }));

    let sickKid = SpriteRenderer.addComponents(new Entity(), this.sickKidImage, { x: 200, y: canvas.height + 200 });
    sickKid.addComponent(new PositionWiggle(0, 300, 0, 1, 0, 3.14 / 2));
    this.addEntity(sickKid);

    // let sickKid2 = SpriteRenderer.addComponents(new Entity(), this.sickKidImage2, { x: canvas.width - 200, y: canvas.height + 200 });
    // sickKid2.addComponent(new PositionWiggle(0, 300, 0, 1.5));
    // this.addEntity(sickKid2);

    // let healthyKid = SpriteRenderer.addComponents(new Entity(), this.healthyKidImage, { x: canvas.width - 200, y: canvas.height + 200 });
    // healthyKid.addComponent(new PositionWiggle(0, 300, 0, 3));
    // this.addEntity(healthyKid);

    SceneSwitchSystem.switchToSceneOnCondition('game', true, Infinity);
  }
}
