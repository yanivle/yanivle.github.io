import { System } from "../ecs/system.mjs";
import { canvas } from "../core/canvas.mjs";
import { PhysicsBody } from "../components/base_components.mjs";
import { Rotation } from "../components/base_components.mjs";
import { RotationWiggle } from "../components/base_components.mjs";
import { SpriteRenderer } from "./sprite_renderer.mjs";
import { Entity } from "../ecs/entity.mjs";
import { Position } from "../components/base_components.mjs";
import { RenderedText } from "../components/base_components.mjs";
import { Attractor } from "../components/base_components.mjs";
import { TextRenderer } from "./text_renderer.mjs";
import { mouse } from "../core/game_engine.mjs";
import { game_engine } from "../core/game_engine.mjs";

export class DoctorSystem extends System {
  constructor(doctorImage, speechBubbleImage, font, finishCb) {
    super();
    this.doctor = SpriteRenderer.addComponents(new Entity(), doctorImage, { x: Infinity, y: Infinity, layer: 0, width: 400, height: 400 })
      .addComponent(new PhysicsBody(0, 0, 0, 0, 0.3))
      .addComponent(new Rotation(0))
      .addComponent(new RotationWiggle(1 / 20, 6, 0));

    this.speechBubble = SpriteRenderer.addComponents(new Entity(), speechBubbleImage, { x: Infinity, y: Infinity, layer: 0, width: 400, height: 400 })
      .addComponent(new PhysicsBody(0, 0, 0, 0, 0.3))
      .addComponent(new Rotation(0))
      .addComponent(new RotationWiggle(1 / 20, 6, 0));

    this.text = TextRenderer.createRenderedText('', font, Infinity, Infinity, null, 'black', true)
      .addComponent(new PhysicsBody(0, 0, 0, 0, 0.3));

    this.state = 0;
    this.finishCb = finishCb;
  }

  speak(text) {
    let pos = this.doctor.getComponent(Position);
    pos.x = canvas.width + 100;
    pos.y = canvas.height / 2 + 200;
    this.doctor.addComponent(new Attractor(canvas.width / 2, canvas.height / 2 + 200, 0, 0.01))

    pos = this.speechBubble.getComponent(Position);
    pos.x = canvas.width + 100;
    pos.y = canvas.height / 2 - 100;
    this.speechBubble.addComponent(new Attractor(canvas.width / 2 + 100, canvas.height / 2 - 100, 0, 0.01))

    pos = this.text.getComponent(Position);
    pos.x = canvas.width + 100;
    pos.y = canvas.height / 2 - 130;
    this.text.addComponent(new Attractor(canvas.width / 2 + 100, canvas.height / 2 - 130, 0, 0.01));
    this.text.getComponent(RenderedText).text = text;
  }

  goOffscreen() {
    this.doctor.addComponent(new Attractor(canvas.width * 2, canvas.height / 2 + 200, 0, 0.01))
    this.speechBubble.addComponent(new Attractor(canvas.width * 2 + 100, canvas.height / 2 - 100, 0, 0.01))
    this.text.addComponent(new Attractor(canvas.width * 2 + 100, canvas.height / 2 - 130, 0, 0.01));
  }

  update() {
    if (this.state == 1) {
      if (mouse.pressed) {
        this.goOffscreen();
        this.state = 2;
        this.startTime = game_engine.now;
      }
    } else if (this.state == 2) {
      if (game_engine.now >= this.startTime + 0.2) {
        this.speak('Oh, and good luck!');
        this.state = 3;
      }
    } else if (this.state == 3) {
      if (game_engine.now >= this.startTime + 1.2) {
        this.goOffscreen();
        this.state = 4;
      }
    } else if (this.state == 4) {
      if (game_engine.now >= this.startTime + 1.2) {
        this.finishCb();
        this.state = 5;
      }
    }
  }

  init() {
    this.speak(`Dear hero!
Please help us fight the corona!
By finding 5 cards of the same kind
you will get valuable powerups!
Beware of the viruses though
and try to find get all powerups ASAP!


CLICK TO CONTINUE`);
    this.state = 1;
  }
}
